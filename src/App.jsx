import { Card, CardBody, Container, Flex, Heading, Image, Input, Stack, Text } from '@chakra-ui/react';
import { useDeferredValue, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';

const { 
  VITE_API_KEY: API_KEY,
  VITE_DEFAULT_POSTER_URL: defaultPoster, 
  VITE_POSTER_URL: posterURL,
  VITE_MOVIE_API: movieApiUrl,
  VITE_MOVIE_SEARCH_API: movieSearchApiUrl,
} = import.meta.env;

function useMovies(query, lang = 'uk') {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const url = new URL(query ? movieSearchApiUrl : movieApiUrl);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', lang);
  if (query) url.searchParams.set('query', query.trim());
  if (page) url.searchParams.set('page', page);

  useEffect(() => {
    fetch(url.toString())
      .then(response => response.json())
      .then(movies => {        
        setPage(movies.page);
        setTotalPages(movies.total_pages);
        setMovies(movies.results);
      });
  }, [page, query]);

  return [movies, totalPages, setPage];
}

function Movies({ movies }) {
  return movies.map(movie => (
    <Card cursor="pointer" key={movie.id} margin="8">
      <CardBody>
        <Image
          src={movie.poster_path ? posterURL + movie.poster_path : defaultPoster}
          alt={movie.title || movie.name}
          borderRadius='lg'
        />
        <Stack mt='6' spacing='3'>
          <Flex align="center" justify="space-between">
            <Heading size='md'>{movie.title || movie.name}</Heading>
            <Flex direction="row">
              <Image src="/star.svg" width="30" height="30" alt="Star" />
              {movie.vote_agerage && (
                <Text marginLeft="2" fontWeight="bold" fontSize="24">{movie.vote_average.toFixed(2)}</Text>
              )}
            </Flex>
          </Flex>
          <Text noOfLines={3} color='grey.200'>{movie.overview}</Text>
          {movie.first_air_date || movie.release_date && (
            <Text noOfLines={3} color='grey.600' fontWeight="bold">
              Прем'єра в Україні: {new Intl.DateTimeFormat('uk-UA', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }).format(new Date(movie.first_air_date || movie.release_date))}
            </Text>
          )}
        </Stack>
      </CardBody>
    </Card>
  ));
}

function App() {
  const [search, setSearch] = useState('');
  const defferedSearch = useDeferredValue(search);
  const [movies, totalPages, setPage] = useMovies(defferedSearch);
  
  return (
    <main className={styles.App}>
      <header className={styles.App__Header}></header>
      <Container centerContent>
        <Flex width='100%' direction="column">
          <Input
            id="search" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Оберіть фільм" 
            type="search" 
          />
        </Flex>
        <Movies movies={movies} />
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={next => setPage(next.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </Container>
    </main>
  )
}

export default App
