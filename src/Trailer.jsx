import { Text } from "@chakra-ui/react";
import { fetchMovie } from "./api";
import useQuery from "./utils";

function Trailer({ movie: { id, title } }) {
  const { results: [{ key }]} = useQuery({
    fn: () => fetchMovie(id, title),
    key: `movie-${id}`
  });

  if (!key) {
    return <Text color="coral" marginBottom="4">На жаль, трейлера немає</Text>
  } else {
    return (
      <iframe 
        width="100%" 
        height="360" 
        src={`https://www.youtube.com/embed/${key}`}          
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    );
  }
}

export default Trailer;