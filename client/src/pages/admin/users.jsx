import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Sidebar } from '../../components/sidebar';
import { useToastify } from '../../components/utilities/toast.jsx';
import { API } from '../../services/api.js';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [reload, setReload] = useState(false);

  const toastify = useToastify();

  useEffect(() => {
    setIsWorking(true);

    const fetchUsers = async () => {
      try {
        const response = await API.get('/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsWorking(false);
      }
    };

    fetchUsers();
  }, [reload]);

  const handleBlockUser = async (userId) => {
    setIsWorking(true);
    try {
      await API.patch(`api/admin/users/block/${userId}`, {});

      // Show success toast
      toastify({
        title: 'Success',
        description: `The user with id - ${userId} has been removed successfully!`,
        status: 'success',
      });

      // Trigger re-fetch by toggling reload state
      setReload((prev) => !prev);
    } catch (error) {
      console.error('Error removing user:', error);

      // Show failure toast
      toastify({
        title: 'Failure',
        description: error.errorMessage || 'An error occurred while removing the user',
        status: 'error',
      });
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Sidebar>
      <Box p={4} minH="100vh">
        <Text fontSize="2xl" mb={4}>
          Users Management
        </Text>
        {isWorking ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : users && users.length === 0 ? (
          <Text>No users found</Text>
        ) : (
          (
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Last Seen</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.role}</Td>
                      <Td>{user.lastSeen || 'Unknown'}</Td>
                      <Td>
                        <Button colorScheme="red" size="sm" onClick={() => handleBlockUser(user.id)}>
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) || <Text>Something wrong happened</Text>
        )}
      </Box>
    </Sidebar>
  );
};
