import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Sidebar } from '../../components/sidebar';
import { useToastify } from '../../components/utilities/toast.jsx';
import { API } from '../../services/api.js';
import { InviteAdminModal } from './components/InviteAdminModal.jsx';

export const ManageAdmins = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [admins, setAdmins] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [reloadAdmins, setReloadAdmins] = useState(false);

  const toastify = useToastify();

  useEffect(() => {
    setIsWorking(true);

    const fetchUsers = async () => {
      try {
        const response = await API.get('/api/admin/manage-admins');
        setAdmins(response.data);
      } catch (error) {
        toastify({
          title: 'Failure',
          description: `${error.errorMessage || 'An error occurred'}`,
          status: 'error',
        });
      } finally {
        setIsWorking(false);
      }
    };

    fetchUsers();
  }, [reloadAdmins]);

  const blockAdmin = async (data) => {
    setIsWorking(true);
    try {
      const response = await API.post('/api/admin/block', data);
      console.log(response.data);
      toastify({
        title: 'Success',
        description: 'Admin is successfully removed',
        status: 'success',
      });

      setReloadAdmins((prev) => !prev); // Trigger reload of admins
    } catch (error) {
      console.error('Error blocking admin:', error);
      toastify({
        title: 'Failure',
        description: `${error.errorMessage || 'An error occurred'}`,
        status: 'error',
      });
    } finally {
      setIsWorking(false);
    }
  };

  const handleInviteAdmin = async (data) => {
    setIsWorking(true);
    try {
      const result = await API.post('/api/admin/invite-admin', data);
      console.log('Invite admin', result);
      toastify({
        title: 'Success',
        description: 'Admin invited successfully',
        status: 'success',
      });

      setReloadAdmins((prev) => !prev); // Trigger reload of admins
    } catch (error) {
      console.error('Error inviting admin:', error);
      toastify({
        title: 'Failure',
        description: `${error.errorMessage || 'An error occurred'}`,
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
          Manage Admins
        </Text>
        <Flex width="100%" justifyContent="flex-end" mb={4}>
          <Button colorScheme="blue" variant="outline" onClick={onOpen} mr={2}>
            + Invite a new admin
          </Button>
        </Flex>
        {isWorking ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : admins && admins.length === 0 ? (
          <Text>No admins found</Text>
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
                  {admins.map((admin) => (
                    <Tr key={admin.id}>
                      <Td>{admin.id}</Td>
                      <Td>{admin.name}</Td>
                      <Td>{admin.email}</Td>
                      <Td>{admin.role}</Td>
                      <Td>{admin.lastSeen || 'Unknown'}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          // isDisabled={admin.role !== 'SUPER_ADMIN'}
                          onClick={() => blockAdmin({ adminId: admin.id })}>
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
      <InviteAdminModal isOpen={isOpen} onClose={onClose} onInviteAdmin={handleInviteAdmin} />
    </Sidebar>
  );
};
