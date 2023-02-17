import { Card, CardBody, Container, Flex, Heading, Image, Input, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import styles from './App.module.css';

const { 
  VITE_API_KEY: API_KEY,
  VITE_DEFAULT_POSTER_URL: defaultPoster, 
  VITE_POSTER_URL: posterURL,
  VITE_MOVIE_API: movieApiUrl 
} = import.meta.env;

function useMovies(lang = 'uk') {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const url = new URL(movieApiUrl);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', lang);

  useEffect(() => {
    fetch(url.toString())
      .then(response => response.json())
      .then(movies => {        
        setPage(movies.page);
        setMovies(movies.results);
      });
  }, []);

  return [movies, page, setPage];
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
              <Image src="/public/star.svg" width="30" height="30" alt="Star" />
              <Text marginLeft="2" fontWeight="bold" fontSize="24">{movie.vote_average.toFixed(2)}</Text>
            </Flex>
          </Flex>
          <Text noOfLines={3} color='grey.200'>{movie.overview}</Text>
          <Text noOfLines={3} color='grey.600' fontWeight="bold">
            Прем'єра в Україні: {new Intl.DateTimeFormat('uk-UA', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }).format(new Date(movie.release_date || movie.first_air_date))}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  ));
}

function App() {
  const [movies, page, setPage] = useMovies();
  
  return (
    <main className={styles.App}>
      <header className={styles.App__Header}></header>
      <Container centerContent>
        <Flex width='100%' direction="column">
          <Input id="search" placeholder="Оберіть фільм" type="search" />
        </Flex>
        {movies.length > 0 && <Movies movies={movies} />}
      </Container>
    </main>
  )
}

export default App
