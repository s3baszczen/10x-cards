-- Migration: Initial Schema
-- Description: Creates the initial database schema for 10x-cards application
-- Tables: flashcards, generations, generation_error_logs
-- Note: The auth.users table is managed by Supabase

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Flashcards table
create table public.flashcards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    front_text text not null,
    back_text text not null,
    creation text not null check (creation in ('ai', 'manual', 'ai-edited')),
    generation_id uuid null,
    status boolean not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);

comment on table public.flashcards is 'Stores flashcards created by users';

-- Generations table
create table public.generations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar(255) not null,
    source_text_hash varchar(128) not null,
    generated_flashcards_count integer not null check (generated_flashcards_count >= 0),
    created_at timestamptz not null default current_timestamp
);

comment on table public.generations is 'Tracks AI-generated flashcard creation events';

-- Add foreign key constraint for flashcards.generation_id
alter table public.flashcards
    add constraint fk_flashcards_generation
    foreign key (generation_id)
    references public.generations(id)
    on delete set null;

-- Generation Error Logs table
create table public.generation_error_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar(255) not null,
    source_text_hash varchar(128) not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    error_code varchar(100) not null,
    error_message text not null,
    created_at timestamptz not null default current_timestamp
);

comment on table public.generation_error_logs is 'Logs errors that occur during flashcard generation';

-- Create indexes
create index idx_flashcards_user_id on public.flashcards(user_id);
create index idx_flashcards_generation_id on public.flashcards(generation_id);
create index idx_generations_user_id on public.generations(user_id);
create index idx_generation_error_logs_source_text_hash on public.generation_error_logs(source_text_hash);
create index idx_generation_error_logs_user_id on public.generation_error_logs(user_id);

-- Enable Row Level Security
alter table public.flashcards enable row level security;
alter table public.generations enable row level security;
alter table public.generation_error_logs enable row level security;

-- RLS Policies for flashcards

-- Select policy for authenticated users
create policy "Users can view their own flashcards"
    on public.flashcards
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own flashcards"
    on public.flashcards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Update policy for authenticated users
create policy "Users can update their own flashcards"
    on public.flashcards
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Delete policy for authenticated users
create policy "Users can delete their own flashcards"
    on public.flashcards
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for generations

-- Select policy for authenticated users
create policy "Users can view their own generations"
    on public.generations
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own generations"
    on public.generations
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- RLS Policies for generation_error_logs

-- Select policy for authenticated users
create policy "Users can view their own error logs"
    on public.generation_error_logs
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own error logs"
    on public.generation_error_logs
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for flashcards updated_at
create trigger handle_flashcards_updated_at
    before update on public.flashcards
    for each row
    execute function public.handle_updated_at(); 