import { Container, Flex, Input, Text } from '@chakra-ui/react';
import { lazy, Suspense, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Loading } from './Loading';
import styles from './App.module.css';

const Movies = lazy(() => import('./Movies'));

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  
  return (
    <main className={styles.App}>
      <Container centerContent>
        <Text marginTop="12" marginBottom="12" role="heading" as="h1" fontSize='50px' color='tomato'>
          Кінодовідник  
        </Text>
        <Flex width='100%' direction="column">
          <Input
            id="search" 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            placeholder="Оберіть фільм" 
            type="search" 
          />
        </Flex>

        <Flex minHeight="85vh" align="center" justify="center" direction="column">
          <Suspense fallback={<Loading />}>
            <Movies query={query} page={page} />
          </Suspense>
        </Flex>
        
        <Container as="footer">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={next => setPage(next.selected + 1)}
            pageRangeDisplayed={5}
            pageCount={500}
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
      </Container>
    </main>
  )
}
