import { Button, Container, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { API } from '../services/api';

const fetchIncident = async (id) => {
  const response = await API.get(`/api/incidents/${id}`);
  return response.data;
};

export const ViewIncident = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getIncident = async () => {
      try {
        const data = await fetchIncident(parseInt(id));
        setIncident(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getIncident();
  }, [id]);

  const handleClick = () => {
    navigate(`/incident/edit/${incident.id}`);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <VStack pt="100px">
      <Container maxW="container.sm">
        <Flex width="100%" justify="flex-end">
          <Button colorScheme="gray-900" variant="outline" onClick={handleClick}>
            Edit Incident
          </Button>
        </Flex>
      </Container>
      <Flex h="100%" d justify="center" pt="60px" pb={'6rem'}>
        <Container maxW="container.sm" p="6" rounded="md" bg="gray.100">
          <Stack direction="column" spacing="24px" w="100%">
            <Heading size="md">Incident #{incident.id}</Heading>
            <Heading size="md">Title: {incident.title}</Heading>
            <Text>
              <strong>REFERENCE:</strong> {incident.reference}
            </Text>
            <Text>
              <strong>Severity:</strong> {incident.severity}
            </Text>
            <Text>
              <strong>Location:</strong> {incident.location || 'Not specified'}
            </Text>
            <Text>
              <strong>Description:</strong> {incident.description}
            </Text>
            <Text>
              <strong>Category:</strong> {incident.category}
            </Text>

            <Text>
              <strong>Incident Date:</strong> {incident.incidentDate}
            </Text>
            <Text>
              <strong>Status:</strong> {incident.status}
            </Text>
            <Text>
              <strong>Assigned To:</strong> {incident.assignedTo || 'To be advised'}
            </Text>
            <Text>
              <strong>Reported By:</strong> {`${incident['reporter.name']} ${incident['reporter.surname']}`}
            </Text>
            <Text>
              <strong>Resolution Date:</strong> {incident.resolutionDate || 'To be advised'}
            </Text>
            <Text>
              <strong>In Progress Date:</strong> {incident.inProgressDate || 'To be advised'}
            </Text>
            <Text>
              <strong>Closure Date:</strong> {incident.closureDate || 'To be advised'}
            </Text>
          </Stack>
        </Container>
      </Flex>
    </VStack>
  );
};
