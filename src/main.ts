/* 📌 Milestone 1
Crea un type alias Person per rappresentare una persona generica.

Il tipo deve includere le seguenti proprietà:

id: numero identificativo, non modificabile
name: nome completo, stringa non modificabile
birth_year: anno di nascita, numero
death_year: anno di morte, numero opzionale
biography: breve biografia, stringa
image: URL dell'immagine, stringa */

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
}

/* 📌 Milestone 2
Crea un type alias Actress che oltre a tutte le proprietà di Person,
aggiunge le seguenti proprietà:

most_famous_movies: una tuple di 3 stringhe
awards: una stringa
nationality: una stringa tra un insieme definito di valori.
Le nazionalità accettate sono:
American, British, Australian, Israeli-American, South African,
French, Indian, Israeli, Spanish, South Korean, Chinese. */

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: 'American' | 'British' | 'Australian' | 'Israeli-American' | 'South African' | 'French' | 'Indian' | 'Israeli' | 'Spanish' | 'South Korean' | 'Chinese.'
}

/* 📌 Milestone 3
Crea una funzione getActress che, dato un id, effettua una chiamata a:

GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses/:id
La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta. */

function isActress(data: unknown): data is Actress {
  return (
    typeof data === 'object' && data !== null &&
    'id' in data && typeof data.id === 'number' &&
    'name' in data && typeof data.name === 'string' &&
    'birth_year' in data && typeof data.birth_year === 'number' &&
    'death_year' in data && typeof data.death_year === 'number' &&
    'biography' in data && typeof data.biography === 'string' &&
    'image' in data && typeof data.image === 'string' &&
    'most_famous_movies' in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(movie => typeof movie === 'string') &&
    'awards' in data && typeof data.awards === 'string' &&
    'nationality' in data && typeof data.nationality === 'string'
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`)
    const data: unknown = await response.json()
    if (!isActress(data)) {
      throw new Error('Dati non validi')
    }
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante la fetch:', error.message)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return null
  }
}

/* 📌 Milestone 4
Crea una funzione getAllActresses che chiama:

GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses
La funzione deve restituire un array di oggetti Actress.

Può essere anche un array vuoto */

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch('https://boolean-spec-frontend.vercel.app/freetestapi/actresses')
    if (!response.ok) { // verifico se la risposta è ok
      throw new Error(`Errore nella risposta: ${response.status}`)
    }
    const data: unknown = await response.json()
    // verifico che data sia un array di attrici valide
    if (!(data instanceof Array)) { // verifico che data sia un array
      throw new Error('Dati non validi, non è un array')
    }
    const attriciValide = data.filter(isActress) // filtro solo le attrici valide
    return attriciValide
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante la fetch:', error.message)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return [] // ritorno un array vuoto in caso di errore
  }
}

/* 📌 Milestone 5
Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata). */

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id)) // creo un array di promises
    const attrici = await Promise.all(promises) // aspetto che tutte le promises vengano risolte
    return attrici // ritorno l'array di attrici
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante la fetch:', error.message)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return [] // ritorno un array vuoto in caso di errore
  }
}
