import { Text } from "@chakra-ui/react";
import { useData } from "./utils";

const { VITE_API_KEY: API_KEY } = import.meta.env;

function getUrl(id, title) {
  const url = new URL(`https://api.themoviedb.org/3/${title ? "movie" : "tv"}/${id}/videos`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'ua');
  return url.toString();
}

export default function Trailer({ movie: { id, title } }) {
  const { results: [{ key }]} = useData(getUrl(id, title));

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
    )
  }
}