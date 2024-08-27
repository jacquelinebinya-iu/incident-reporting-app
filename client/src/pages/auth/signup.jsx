import { Link as ChakraLink } from '@chakra-ui/react';
import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Logo } from '../../components/auth/logo';
import { useToastify } from '../../components/utilities/toast';
import { resetAuthState } from '../../features/user-slice';
import { registerThunk } from '../../features/users/user-thunks';

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordClick = () => setShowPassword(!showPassword);
  const handleConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

  const dispatch = useDispatch();

  const toastify = useToastify();

  const navigate = useNavigate();

  const { isWorking, errorMessage, registerStatus } = useSelector((state) => state.user);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    if (registerStatus === 'success') {
      reset();
      toastify({ title: 'Success', description: 'Account is successfully registered', status: 'success' });
      dispatch(resetAuthState());
      navigate('/');
    } else if (registerStatus === 'failure') {
      toastify({ title: 'Error', description: errorMessage, status: 'error' });
      dispatch(resetAuthState());
    }
  }, [registerStatus, errorMessage, dispatch, toastify, reset, navigate]);

  const onSubmit = async (data) => {
    if (!isWorking) {
      dispatch(registerThunk(data));
    }
  };

  return (
    <Flex h="100vh" justify="center" alignItems="center" backgroundColor="gray.100">
      <Container maxW={{ base: '80%', md: '58%' }} boxShadow="dark-lg" p="6" rounded="md" bg="white">
        <Logo />
        <Center pb="8">
          <h2>Create an account to start reporting</h2>
        </Center>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="2">
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="Name"
                type="text"
                {...register('name', {
                  required: 'Please enter your name',
                  pattern: {
                    value: /^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/,
                    message:
                      'Name must contain only letters and may have single apostrophes or hyphens between letters',
                  },
                })}
              />
              <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.surname}>
              <FormLabel htmlFor="surname">Surname</FormLabel>
              <Input
                id="surname"
                placeholder="Surname"
                type="text"
                {...register('surname', {
                  required: 'Please enter your surname',
                  pattern: {
                    value: /^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/,
                    message:
                      'Surname must contain only letters and may have single apostrophes or hyphens between letters',
                  },
                })}
              />
              <FormErrorMessage>{errors.surname && errors.surname.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                {...register('email', {
                  required: 'Please enter your email address',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email format',
                  },
                })}
              />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  id="password"
                  // variant="flushed"
                  placeholder="Password"
                  pr="4.5rem"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Enter your password',
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+]).{6,}$/,
                      message: 'A valid password must contain at least 6 characters, one digit and a special character',
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handlePasswordClick}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  pr="4.5rem"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'E your password again',
                    validate: (value) => value === watch('password') || 'Passwords do not match',
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleConfirmPasswordClick}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <Center mt="1rem" mb="1rem">
            <ChakraLink as={ReactRouterLink} to="/login">
              <Text fontSize="xs"> Do you have an existing account? Sign in</Text>
            </ChakraLink>
          </Center>

          <Center mt="2rem" mb="1rem">
            <Button w="260px" isLoading={isWorking} colorScheme="teal" type="submit">
              Create an account
            </Button>
          </Center>
        </form>
      </Container>
    </Flex>
  );
};
