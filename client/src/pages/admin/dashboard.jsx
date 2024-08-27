import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Sidebar } from '../../components/sidebar';
import { API } from '../../services/api';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isWorking, setIsWorking] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await API.get('/api/admin/metrics');
        setMetrics(response.data);
        setIsWorking(false);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setMetrics(null);
        setIsWorking(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Sidebar>
      <Box p={4}>
        <Heading as="h1" mb={6}>
          Dashboard
        </Heading>
        {isWorking ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <CircularProgress isIndeterminate color="grey.300" />
          </Flex>
        ) : (
          metrics && (
            <>
              <Text my="30px">Welcome to the dashboard!</Text>
              <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
                <Card>
                  <CardHeader>
                    <Heading size="md">Total Users</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Users</StatLabel>
                      <StatNumber>{metrics.userCount}</StatNumber>
                      <StatHelpText>All registered users</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">New Signups</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatLabel>New Signups</StatLabel>
                      <StatNumber>{metrics.newSignupsTodayCount}</StatNumber>
                      <StatHelpText>Today</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Incidents Reported</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatLabel>Incidents Reported</StatLabel>
                      <StatNumber>{metrics.reportedIncidentCount}</StatNumber>
                      <StatHelpText>This month</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Resolved Incidents</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatLabel>Resolved Incidents</StatLabel>
                      <StatNumber>{metrics.resolvedIncidentCount}</StatNumber>
                      <StatHelpText>This month</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Pending Incidents</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatLabel>Pending Incidents</StatLabel>
                      <StatNumber>{metrics.pendingIncidentCount}</StatNumber>
                      <StatHelpText>Currently pending</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </>
          )
        )}
      </Box>
    </Sidebar>
  );
};
