import { Box, Button, CircularProgress, Container, Flex, Heading, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import { Sidebar } from '../../components/sidebar';
import { useToastify } from '../../components/utilities/toast.jsx';
import { API } from '../../services/api.js';
import { AssignAdminModal } from './components/AssignAdminModal.jsx';
import { UpdateIncidentStatusModal } from './components/UpdateIncidentStatusModal';

export const AdminIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [isWorking, setIsWorking] = useState(true);
  const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure();
  const { isOpen: isAssignModalOpen, onOpen: onAssignModalOpen, onClose: onAssignModalClose } = useDisclosure();

  const toastify = useToastify();

  useEffect(() => {
    const getIncident = async () => {
      try {
        const response = await API.get(`/api/incidents/${id}`);
        setIncident(response.data);
        setIsWorking(false);
      } catch (error) {
        console.log(error);
        setIsWorking(false);
      }
    };
    getIncident();
  }, [id]);



  const handleUpdateStatus = async (data) => {
    try {
      await API.patch(`api/admin/incidents/update-status/${incident.id}`, { status: data.status });

      // Update incident status in state
      setIncident((prevIncident) => ({ ...prevIncident, status: data.status }));

      // Show success toast
      toastify({
        title: 'Success',
        description: 'Status updated successfully',
        status: 'success',
      });
    } catch (error) {
      console.error('Error updating incident status:', error);

      // Show failure toast
      toastify({
        title: 'Failure',
        description: error.errorMessage || 'An error occurred while updating the status',
        status: 'error',
      });
    }
  };

  const handleAssignAdmin = async (data) => {
    try {
      const { adminId, name, surname } = JSON.parse(data.assignedTo);

      await API.patch(`api/admin/assign/${incident.id}`, { adminId });

      toastify({
        title: 'Success',
        description: `Admin assigned successfully`,
        status: 'success',
      });
      setIncident((prevIncident) => ({
        ...prevIncident,
        ['assignee.name']: name,
        ['assignee.surname']: surname,
      }));
    } catch (error) {
      console.error('Error assigning admin to incident:', error);
      toastify({ title: 'Failure', description: `${error.errorMessage}`, status: 'error' });
    }
  };

  const handleCloseIncident = async () => {
    setIsWorking(false);
    try {
      await API.patch(`api/admin/incidents/close/${incident.id}`, {});
      // Update incident status in state
      setIncident((prevIncident) => ({ ...prevIncident, status: 'CLOSED' }));

      // Show success toast
      toastify({
        title: 'Success',
        description: `The incident has been closed successfully!`,
        status: 'success',
      });
    } catch (error) {
      console.error('Error updating incident status:', error);

      // Show failure toast
      toastify({
        title: 'Failure',
        description: error.errorMessage || 'An error occurred while updating the status',
        status: 'error',
      });
    }
  };

  return (
    <Sidebar>
      <Box mt="20px">
        <Flex width="100%" justifyContent="space-between" mb={4}>
          <Box>
            <Button type="button" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back
            </Button>
          </Box>
          <Box>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={onStatusModalOpen}
              w={{ base: '100%', md: 'auto' }}
              mr={{ base: 0, md: 2 }}
              mb={{ base: 4, md: 0 }}>
              Update Status
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={onAssignModalOpen}
              w={{ base: '100%', md: 'auto' }}
              mr={{ base: 0, md: 2 }}
              mb={{ base: 4, md: 0 }}>
              Assign Support/Admin
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleCloseIncident}
              w={{ base: '100%', md: 'auto' }}
              mr={{ base: 0, md: 2 }}
              mb={{ base: 4, md: 0 }}>
              X Close the incident
            </Button>
          </Box>
        </Flex>

        {isWorking ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <CircularProgress isIndeterminate color="grey.300" />
          </Flex>
        ) : (
          incident && (
            <Flex justify="center" pt="20px">
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
                    <strong>Assigned To:</strong>{' '}
                    {incident['assignee.name'] && incident['assignee.surname']
                      ? `${incident['assignee.name']} ${incident['assignee.surname']}`
                      : 'To be advised'}
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
          )
        )}
      </Box>
      <UpdateIncidentStatusModal
        isOpen={isStatusModalOpen}
        onClose={onStatusModalClose}
        incidentId={incident?.id}
        currentStatus={incident?.status}
        onUpdateStatus={handleUpdateStatus}
      />
      <AssignAdminModal
        isOpen={isAssignModalOpen}
        onClose={onAssignModalClose}
        incidentId={incident?.id}
        currentAssignee={JSON.stringify(
          incident?.assignedTo
            ? {
                adminId: incident.assignedTo,
                name: incident?.assignee?.name || '',
                surname: incident?.assignee?.surname || '',
              }
            : {
                adminId: '',
                name: '',
                surname: '',
              }
        )}
        onAssignAdmin={handleAssignAdmin}
      />
    </Sidebar>
  );
};
