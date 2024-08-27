import {
  Button,
  Center,
  CircularProgress,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useToastify } from '../components/utilities/toast';
import { API } from '../services/api';

export const Profile = () => {
  const [isWorking, setWorking] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm();

  const toastify = useToastify();
  const genderOptions = [
    { name: 'Female', value: 'FEMALE' },
    { name: 'Male', value: 'MALE' },
    { name: 'Non Binary', value: 'NON_BINARY' },
    { name: 'Other', value: 'OTHER' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get(`api/current`);
        reset(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toastify({ title: 'Failure', description: `${error.errorMessage}`, status: 'error' });
      }
    };

    fetchUserProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setWorking(true);
      const response = await API.post('api/users/profile', data);
      if (response.success) {
        setWorking(false);
        toastify({ title: 'Success', description: 'Profile updated successfully', status: 'success' });
      }
    } catch (error) {
      setWorking(false);
      toastify({ title: 'Failure', description: `${error.errorMessage}`, status: 'error' });
    }
  };

  return (
    <Flex h="100vh" justify="center" pt="100px">
      <Container w="60%" p="6" rounded="md" bg="white">
        {isWorking ? (
          <CircularProgress isIndeterminate color="grey.300" />
        ) : (
          <>
            <Heading as="h1" size="lg" textAlign="center" mb="6">
              Edit Profile
            </Heading>
            <Text mb="4" textAlign="center">
              Fill in the form to update your profile.
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="2">
                <FormControl isInvalid={errors.studentNumber}>
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
                <FormControl isInvalid={errors.name}>
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
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.surname}>
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
                  <FormErrorMessage>{errors.surname && errors.surname.message}</FormErrorMessage>
                </FormControl>
                <FormLabel htmlFor="gender">
                  <Text fontSze="xs" color="gray-900">
                    Gender
                  </Text>
                </FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Please specify your gender' }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction={{ base: 'column', md: 'row' }} spacing={5}>
                        {genderOptions.map((el, index) => (
                          <Radio key={index} value={el.value}>
                            {el.name}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  )}
                />
                <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>
              </Stack>
              <Center mt="2rem" mb="1rem">
                <Button disabled={isWorking} w="260px" mt="4" colorScheme="teal" type="submit">
                  SAVE
                </Button>
              </Center>
            </form>
          </>
        )}
      </Container>
    </Flex>
  );
};
