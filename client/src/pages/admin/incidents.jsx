import {
  Box,
  Button,
  chakra,
  CircularProgress,
  Flex,
  Input,
  InputGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sidebar } from '../../components/sidebar';
import { API } from '../../services/api.js';

// Custom styled component for the table container
const StyledTableContainer = chakra(Box, {
  baseStyle: {
    overflowX: 'auto',
    maxWidth: '100%',
    '&::-webkit-scrollbar': {
      height: '8px',
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '20px',
      border: '3px solid transparent',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
    '&:hover': {
      scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent',
    },
  },
});

export const AdminIncidents = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [incidents, setIncidents] = useState([]);

  const toastify = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsWorking(true);

    const fetchIncidents = async () => {
      try {
        const response = await API.get('/api/incidents');
        setIncidents(response.data);
      } catch (error) {
        toastify({ title: 'Failure', description: `${error.errorMessage}`, status: 'error' });
      } finally {
        setIsWorking(false);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <Sidebar>
      <Box p={2} minH="100vh">
        <Text fontSize="2xl" mb={4}>
          Incidents Management
        </Text>
        {isWorking ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <CircularProgress isIndeterminate color="grey.300" />
          </Flex>
        ) : (
          <StyledTableContainer>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Reference</Th>
                  <Th>Date Reported</Th>
                  <Th>Title</Th>
                  <Th>Reported By</Th>
                  <Th>Status</Th>
                  <Th>Severity</Th>
                  <Th>Category</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {incidents.length > 0 ? (
                  incidents.map((incident) => (
                    <Tr key={incident.id}>
                      <Td>{incident.id}</Td>
                      <Td>{incident.reference}</Td>
                      <Td>{incident.createdAt}</Td>
                      <Td>{incident.title}</Td>
                      <Td>{incident.reportedBy}</Td>
                      <Td>{incident.status}</Td>
                      <Td>{incident.severity}</Td>
                      <Td>{incident.category}</Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          size="sm"
                          mr={2}
                          type={'button'}
                          onClick={() => {
                            navigate(`/admin/incidents/${incident.id}`);
                          }}>
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={9}>
                      <Text>No incidents found</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </StyledTableContainer>
        )}
      </Box>
    </Sidebar>
  );
};
