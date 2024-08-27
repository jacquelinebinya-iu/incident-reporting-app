import {
  Button,
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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ENUM_INCIDENT_STATUSES } from '../../../constants/index.js';

export const UpdateIncidentStatusModal = ({ isOpen, onClose, currentStatus, onUpdateStatus }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: currentStatus,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(data);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Incident Status</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={errors.status}>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select
                id="status"
                defaultValue={currentStatus}
                {...register('status', { required: 'Status is required' })}>
                <option value={ENUM_INCIDENT_STATUSES.open}>Open</option>
                <option value={ENUM_INCIDENT_STATUSES.inProgress}>In Progress</option>
                <option value={ENUM_INCIDENT_STATUSES.resolved}>Resolved</option>
                <option value={ENUM_INCIDENT_STATUSES.closed}>Closed</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" isLoading={isSubmitting} isDisabled={isSubmitting}>
              Update Status
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
