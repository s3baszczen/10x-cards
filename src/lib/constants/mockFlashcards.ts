import type { CreateFlashcardDTO } from '@/types'

export const MOCK_FLASHCARDS: Record<string, CreateFlashcardDTO[]> = {
  general: [
    {
      front_text: 'Co to jest uczenie maszynowe?',
      back_text: 'Uczenie maszynowe to dziedzina sztucznej inteligencji, która zajmuje się tworzeniem systemów, które automatycznie uczą się i doskonalą na podstawie doświadczenia, bez jawnego programowania.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Jakie są główne typy uczenia maszynowego?',
      back_text: 'Główne typy uczenia maszynowego to: uczenie nadzorowane, uczenie nienadzorowane, uczenie przez wzmacnianie i uczenie półnadzorowane.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to jest model AI?',
      back_text: 'Model AI to matematyczna reprezentacja systemu uczenia maszynowego, która została wytrenowana na danych do wykonywania określonych zadań, takich jak klasyfikacja, przewidywanie lub generowanie zawartości.',
      creation: 'ai' as const,
    },
  ],
  programming: [
    {
      front_text: 'Co to jest TypeScript?',
      back_text: 'TypeScript to silnie typowany język programowania, który jest nadzbiorem JavaScript, oferujący dodatkowe funkcje, takie jak statyczne typowanie.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Czym są generyki w TypeScript?',
      back_text: 'Generyki pozwalają na tworzenie elastycznych, wielokrotnego użytku funkcji i klas, które mogą działać z wieloma typami danych, zachowując jednocześnie bezpieczeństwo typów.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to jest React?',
      back_text: 'React to biblioteka JavaScript do budowania interfejsów użytkownika, która umożliwia tworzenie komponentów wielokrotnego użytku i efektywne aktualizowanie DOM za pomocą wirtualnego DOM.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to są hooki w React?',
      back_text: 'Hooki to funkcje, które pozwalają na korzystanie ze stanu i innych funkcji React bez pisania klas. Najczęściej używane to useState i useEffect.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Czym jest Astro?',
      back_text: 'Astro to nowoczesny framework do budowania szybkich, opartych na treści stron internetowych z mniejszą ilością JavaScript po stronie klienta, używając "Islands Architecture".',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to jest Tailwind CSS?',
      back_text: 'Tailwind CSS to framework CSS typu utility-first, który pozwala szybko budować niestandardowe projekty bezpośrednio w znacznikach HTML poprzez stosowanie klas narzędziowych.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to jest SSR?',
      back_text: 'Server-Side Rendering (SSR) to technika renderowania strony na serwerze, a następnie wysyłania w pełni renderowanego HTML do klienta, co poprawia wydajność i SEO.',
      creation: 'ai' as const,
    },
  ],
  history: [
    {
      front_text: 'Kiedy rozpoczęła się II wojna światowa?',
      back_text: 'II wojna światowa rozpoczęła się 1 września 1939 roku, gdy nazistowskie Niemcy zaatakowały Polskę.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Kto był pierwszym prezydentem Stanów Zjednoczonych?',
      back_text: 'George Washington był pierwszym prezydentem Stanów Zjednoczonych, sprawującym urząd w latach 1789-1797.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Kiedy upadł mur berliński?',
      back_text: 'Mur berliński upadł 9 listopada 1989 roku, co symbolizowało koniec zimnej wojny i początek zjednoczenia Niemiec.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to była rewolucja przemysłowa?',
      back_text: 'Rewolucja przemysłowa to okres od około 1760 do 1840 roku, gdy nastąpiło przejście od ręcznych metod produkcji do produkcji maszynowej, początkowo w Wielkiej Brytanii.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Kim był Mikołaj Kopernik?',
      back_text: 'Mikołaj Kopernik (1473-1543) był polskim astronomem, który zaproponował teorię heliocentryczną, zgodnie z którą Słońce, a nie Ziemia, znajduje się w centrum układu planetarnego.',
      creation: 'ai' as const,
    },
  ],
  biology: [
    {
      front_text: 'Co to jest DNA?',
      back_text: 'DNA (kwas deoksyrybonukleinowy) to molekuła zawierająca genetyczne instrukcje używane w rozwoju i funkcjonowaniu wszystkich znanych organizmów żywych i wielu wirusów.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Czym jest fotosynteza?',
      back_text: 'Fotosynteza to proces, w którym zielone rośliny, glony i niektóre bakterie przekształcają energię świetlną w energię chemiczną, produkując glukozę i tlen z dwutlenku węgla i wody.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Jakie są podstawowe elementy komórki eukariotycznej?',
      back_text: 'Podstawowe elementy komórki eukariotycznej to: jądro komórkowe, mitochondria, siateczka śródplazmatyczna, aparat Golgiego, lizosomy, peroksysomy, cytoszkielet i błona komórkowa.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Co to jest ewolucja?',
      back_text: 'Ewolucja to proces, w którym gatunki organizmów zmieniają się genetycznie w czasie w wyniku doboru naturalnego, powodując wzrost różnorodności biologicznej.',
      creation: 'ai' as const,
    },
    {
      front_text: 'Czym jest ekosystem?',
      back_text: 'Ekosystem to biologiczna społeczność organizmów interakcji z ich środowiskiem fizycznym jako system. Ekosystem składa się z organizmów, środowiska i wszystkich interakcji pomiędzy nimi.',
      creation: 'ai' as const,
    },
  ],
}
