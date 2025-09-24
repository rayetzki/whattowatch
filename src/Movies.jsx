import { Button, Card, Flex, Heading, Image, Dialog, Stack, Text, useDisclosure, Container } from "@chakra-ui/react";
import { lazy, Suspense, useEffect, useState, useDeferredValue } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from "./Loading";
import { fetchMovies } from "./api";
import useQuery from "./utils";

const Trailer = lazy(() => import('./Trailer'));

function Movies({ query, page, setTotalPages }) {
  const { onClose } = useDisclosure();

  const { results: movies, total_pages: totalPages } = useQuery({
    fn: () => fetchMovies(query, page),
    key: `movies-${query}-${page}`,
  });

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages]);

  function onDetailsClose() {
    setSelectedMovie(null);
    onClose();
  };

  return (
    <Container>
      {movies.map((movie) => (
        <Card.Root onClick={() => setSelectedMovie(movie)} cursor="pointer" key={movie.id} margin="8">
          <Card.Body>
            <Image
              src={movie.poster_path ? 'http://image.tmdb.org/t/p/w500' + movie.poster_path : 'https://comicbook.com/wp-content/uploads/sites/4/2017/09/72d770ba0277ba353152b70695c57921.png'}
              alt={movie.title || movie.name}
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Flex align="center" justify="space-between" paddingEnd="8">
                <Heading size='xs'>{movie.title || movie.name}</Heading>
                <Flex direction="row" align="center" gap="1">
                  {movie.vote_average && (
                    <Text fontWeight="bold" margin="0" fontSize="24">{movie.vote_average.toFixed(2)}</Text>
                  )}
                  <Image src="/whattowatch/star.svg" width="30" height="30" alt="Star" />
                </Flex>
              </Flex>
              {movie.overview && (
                <Text noOfLines={3} color='grey.200'>{movie.overview}</Text>
              )}
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
          </Card.Body>
        </Card.Root>
      ))}

      {selectedMovie && (
        <Dialog.Root lazyMount size='xl' open={!!selectedMovie.id} onOpenChange={onDetailsClose}>
          <Dialog.Backdrop />
          <Dialog.Trigger />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header fontSize='xl'>{selectedMovie.title || selectedMovie.name}</Dialog.Header>
              <Dialog.Body>
                <Image
                  src={selectedMovie.poster_path ? 'http://image.tmdb.org/t/p/w500' + selectedMovie.poster_path : defaultPoster}
                  alt={selectedMovie.title || selectedMovie.name}
                  borderRadius='lg'
                  marginBottom="4"
                  margin='0 auto'
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
                <ErrorBoundary fallbackRender={(props) => <Container>{props.error.toString()}</Container>}>          
                  <Suspense fallback={<Loading />}>
                    <Trailer movie={selectedMovie} />
                  </Suspense>
                </ErrorBoundary>
              </Dialog.Body>
              <Dialog.Footer>
                <Button colorScheme='blue' mr={3} onClick={onDetailsClose}>
                  Закрити
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      )}
    </Container>
  );
}

export default Movies;