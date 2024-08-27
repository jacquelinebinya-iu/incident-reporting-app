import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToastify } from '../../../components/utilities/toast.jsx';
import { API } from '../../../services/api';

export const InviteAdminModal = ({ isOpen, onClose, onInviteAdmin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastify = useToastify();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      onInviteAdmin(data);
      reset();
      onClose();
    } catch (error) {
      console.log('An error occured when inviting admins', error);
      toastify({ title: 'Failure', description: `${error.errorMessage}`, status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite New Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing="4">
                <FormControl isInvalid={errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                    })}
                  />
                  <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input id="name" {...register('name', { required: 'Name is required' })} />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.surname}>
                  <FormLabel htmlFor="surname">Surname</FormLabel>
                  <Input id="surname" {...register('surname', { required: 'Surname is required' })} />
                  <FormErrorMessage>{errors.surname && errors.surname.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
              Invite Admin
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
