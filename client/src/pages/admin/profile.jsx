import {
  CircularProgress,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Sidebar } from '../../components/sidebar.jsx';
import { API } from '../../services/api.js';

export const AdminProfile = () => {
  const [isWorking, setIsWorking] = useState(false);
  const { reset, register } = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsWorking(true);
      try {
        const response = await API.get('api/current');
        reset(response.data);
        setIsWorking(false);
      } catch (error) {
        setIsWorking(false);
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [reset]);

  return (
    <Sidebar>
      <Flex h="100vh" justify="center" pt="100px">
        <Container w="60%" p="6" rounded="md" bg="white">
          {isWorking ? (
            <CircularProgress isIndeterminate color="grey.300" />
          ) : (
            <>
              <Heading as="h1" size="lg" textAlign="center" mb="6">
                Profile
              </Heading>
              <Text mb="4" textAlign="center">
                View your profile details here.
              </Text>
              <form>
                <Stack gap="2">
                  <FormControl>
                    <FormLabel htmlFor="email">
                      <Text fontSize="xs" color="gray-900">
                        Email
                      </Text>
                    </FormLabel>
                    <Input
                      name="email"
                      variant="outline"
                      placeholder="Email"
                      type="email"
                      {...register('email')}
                      disabled
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="name">
                      <Text fontSize="xs" color="gray-900">
                        Name
                      </Text>
                    </FormLabel>
                    <Input
                      variant="outline"
                      placeholder="Name"
                      type="text"
                      {...register('name', { required: 'Please enter your name' })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="surname">
                      <Text fontSize="xs" color="gray-900">
                        Last name
                      </Text>
                    </FormLabel>
                    <Input
                      variant="outline"
                      placeholder="Last name"
                      type="text"
                      {...register('surname', { required: 'Please enter your last name' })}
                    />
                  </FormControl>
                </Stack>
              </form>
            </>
          )}
        </Container>
      </Flex>
    </Sidebar>
  );
};
