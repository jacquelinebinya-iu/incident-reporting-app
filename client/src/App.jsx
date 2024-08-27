import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export const App = () => (
  <Flex h="100vh" justify="center" alignItems="center" backgroundColor="gray.100">
    <Outlet />
  </Flex>
);
