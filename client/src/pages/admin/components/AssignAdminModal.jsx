import {
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { API } from '../../../services/api';

export const AssignAdminModal = ({ isOpen, onClose, currentAssignee, onAssignAdmin }) => {
  const [admins, setAdmins] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      assignedTo: currentAssignee,
    },
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsWorking(true);
      try {
        const response = await API.get('/api/admin/manage-admins');
        setAdmins(response.data);
        setIsWorking(false);
      } catch (error) {
        setIsWorking(false);
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      onAssignAdmin(data);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isWorking ? (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
          <CircularProgress isIndeterminate color="grey.300" />
        </Flex>
      ) : admins.length > 0 ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Assign Admin to Incident</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <FormControl isInvalid={errors.assignedTo}>
                  <FormLabel htmlFor="assignedTo">Assign to Admin</FormLabel>
                  <Select id="assignedTo" {...register('assignedTo', { required: 'Assigning an admin is required' })}>
                    <option value="">Select an admin</option>
                    {admins.map((admin) => (
                      <option
                        key={admin.id}
                        value={JSON.stringify({ adminId: admin.id, name: admin.name, surname: admin.surname })}>
                        {admin.name} {admin.surname}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" mr={3} type="submit" isDisabled={isSubmitting}>
                  Assign Admin
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      ) : (
        <Text>Admins not found</Text>
      )}
    </>
  );
};
