import { Button, Card, CardBody, Container, Flex, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';

const { 
  VITE_API_KEY: API_KEY,
  VITE_DEFAULT_POSTER_URL: defaultPoster, 
  VITE_POSTER_URL: posterURL,
  VITE_MOVIE_API: movieApiUrl,
  VITE_MOVIE_SEARCH_API: movieSearchApiUrl,
} = import.meta.env;

function useMovies(query = '', lang = 'uk') {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const url = new URL(query ? movieSearchApiUrl : movieApiUrl);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', lang);
  if (query) url.searchParams.set('query', query?.trim());
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

function Movies({ movies, onMovieSelect }) {
  return movies.map(movie => (
    <Card onClick={() => onMovieSelect(movie)} cursor="pointer" key={movie.id} margin="8">
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
              {movie.vote_average && (
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

function Trailer({ movie: { id, title } }) {
  const [key, setKey] = useState(null);

  useEffect(() => {
    const url = new URL(`https://api.themoviedb.org/3/${title ? "movie" : "tv"}/${id}/videos`);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', 'ua');
    
    fetch(url.toString())
      .then(res => res.json())
      .then(output => setKey(output.results?.[0].key));
  }, []);

  if (!key) {
    return <Text color="coral" marginBottom="4">На жаль, трейлера немає</Text>
  } else {
    return (
      <iframe width="100%" height="360" 
        src={`https://www.youtube.com/embed/${key}`} 
        frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
    )
  }
}

export default function App() {
  const { onClose } = useDisclosure();
  const [search, setSearch] = useState('');
  const [movies, totalPages, setPage] = useMovies(search);
  const [selectedMovie, setSelectedMovie] = useState(null);

  function onDetailsClose() {
    setSelectedMovie(null);
    onClose();
  }
  
  return (
    <main className={styles.App}>
      <Container centerContent>
        <Text marginTop="12" marginBottom="12" role="heading" as="h1" fontSize='50px' color='tomato'>
          Кінодовідник  
        </Text>
        <Flex width='100%' direction="column">
          <Input
            id="search" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Оберіть фільм" 
            type="search" 
          />
        </Flex>
        <Movies movies={movies} onMovieSelect={setSelectedMovie} />
        
        {selectedMovie && (
          <Modal size='2xl' isOpen={!!selectedMovie} onClose={onDetailsClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedMovie.title || selectedMovie.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Image
                  src={selectedMovie.poster_path ? posterURL + selectedMovie.poster_path : defaultPoster}
                  alt={selectedMovie.title || selectedMovie.name}
                  borderRadius='lg'
                  marginBottom="4"
                  objectFit="cover"
                />
                {selectedMovie.vote_average && (
                  <Text color='grey.100' marginBottom="4" fontWeight="bold">Рейтинг: {selectedMovie.vote_average}</Text>
                )}
                {selectedMovie.overview && (
                  <Text color='grey.100' marginBottom="4">{selectedMovie.overview}</Text>
                )}
                {selectedMovie.first_air_date || selectedMovie.release_date && (
                  <Text marginBottom="4" color='grey.600' fontSize="16" fontWeight="bold">
                    Прем'єра: {new Intl.DateTimeFormat('uk-UA', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    }).format(new Date(selectedMovie.first_air_date || selectedMovie.release_date))}
                  </Text>
                )}
                <Trailer movie={selectedMovie} />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onDetailsClose}>
                  Закрити
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={next => setPage(next.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={totalPages > 500 ? 500 : totalPages}
          previousLabel="<"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </Container>
    </main>
  )
}
