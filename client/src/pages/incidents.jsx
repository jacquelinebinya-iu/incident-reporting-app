import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { API } from '../services/api';

const fetchIncidentsByStatus = async (status) => {
  try {
    const response = await API.get(`/api/incidents${status ? `?status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return [];
  }
};

export const Incidents = () => {
  const [selectedTab, setSelectedTab] = useState('');
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const getIncidents = async () => {
      const data = await fetchIncidentsByStatus(selectedTab);
      setIncidents(data);
    };

    getIncidents();
  }, [selectedTab]);

  return (
    <Flex direction="column" align="center" mt="6">
      <Box w="100%" minHeight="100vh" bg="gray.100" py={['6rem', '6rem', '5rem', '5rem']}>
        <Container maxW="container.sm">
          <Heading as="h1" size="lg" textAlign="center" mb="4">
            Your Incidents
          </Heading>
          <Text textAlign="center" mb="8">
            Here you can view all the incidents you have reported. If you need further assistance or wish to update any
            information, please contact us.
          </Text>

          <Tabs w="100%" onChange={(index) => setSelectedTab(['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'][index])}>
            <TabList flexWrap={{ base: 'wrap', md: 'nowrap' }}>
              <Tab flex="1">All</Tab>
              <Tab flex="1">Open</Tab>
              <Tab flex="1">In Progress</Tab>
              <Tab flex="1">Resolved</Tab>
              <Tab flex="1">Closed</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <IncidentList incidents={incidents} />
              </TabPanel>
              <TabPanel>
                <IncidentList incidents={incidents} />
              </TabPanel>
              <TabPanel>
                <IncidentList incidents={incidents} />
              </TabPanel>
              <TabPanel>
                <IncidentList incidents={incidents} />
              </TabPanel>
              <TabPanel>
                <IncidentList incidents={incidents} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Flex>
  );
};

const IncidentList = ({ incidents }) => (
  <VStack spacing={4}>
    {incidents.length === 0 ? (
      <Text>No incidents found.</Text>
    ) : (
      incidents.map((incident) => (
        <Link to={`/incident/${incident.id}`} key={incident.id} style={{ width: '100%' }}>
          <Card w="100%" py="8" variant="elevated">
            <CardHeader>
              <Heading size="md">#{incident.id}</Heading>
              <br />
              <Heading size="md">{incident.title}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{incident.description}</Text>
            </CardBody>
            <CardFooter>
              <p>Status: {incident.status}</p>
            </CardFooter>
          </Card>
        </Link>
      ))
    )}
  </VStack>
);
