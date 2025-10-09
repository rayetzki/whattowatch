const {
  VITE_API_KEY: API_KEY
} = import.meta.env;

export async function fetchMovies(query, page, lang = 'uk') {
  const url = new URL(`https://api.themoviedb.org/3/${query ? 'search/movie' : '/movie/popular'}`);

  url.searchParams.set('language', lang);  
  if (query) url.searchParams.set('query', query?.trim());
  if (page) url.searchParams.set('page', page);
  
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Authorization', `Bearer ${API_KEY}`);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  const data = await response.json();
  
  return data;
}

export async function fetchMovie(id, title) {
  const url = new URL(`https://api.themoviedb.org/3/${title ? "movie" : "tv"}/${id}/videos`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'ua');

  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Authorization', `Bearer ${API_KEY}`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  const data = await response.json();
  return data;
}