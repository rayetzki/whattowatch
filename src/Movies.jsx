import { Button, Card, CardBody, Flex, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Fragment, lazy, memo, Suspense, useEffect, useState } from "react";
import { Loading } from "./Loading";
import { useData } from "./utils";

const {
  VITE_API_KEY: API_KEY,
  VITE_DEFAULT_POSTER_URL: defaultPoster, 
  VITE_POSTER_URL: posterURL,
  VITE_MOVIE_API: movieApiUrl,
  VITE_MOVIE_SEARCH_API: movieSearchApiUrl,
} = import.meta.env;

const Trailer = lazy(() => import('./Trailer'));

function getUrl(query, page, lang = 'uk') {
  const url = new URL(query ? movieSearchApiUrl : movieApiUrl);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', lang);
  if (query) url.searchParams.set('query', query?.trim());
  if (page) url.searchParams.set('page', page);
  return url.toString();
}

function Movies({ query, page, setTotalPages }) {
  const { onClose } = useDisclosure();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { results: movies, total_pages: totalPages } = useData(getUrl(query, page));

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages]);

  function onDetailsClose() {
    setSelectedMovie(null);
    onClose();
  };

  return (
    <Fragment>
      {movies.map(movie => (
        <Card onClick={() => setSelectedMovie(movie)} cursor="pointer" key={movie.id} margin="8">
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
                  <Image src="/whattowatch/star.svg" width="30" height="30" alt="Star" />
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
      ))}

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
              <Suspense fallback={<Loading />}>
                <Trailer movie={selectedMovie} />
              </Suspense>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onDetailsClose}>
                Закрити
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Fragment>
  );
}

export default memo(Movies);