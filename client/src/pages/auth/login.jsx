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
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';

import { Logo } from '../../components/auth/logo';
import { useToastify } from '../../components/utilities/toast';
import { resetAuthState } from '../../features/user-slice';
import { loginThunk } from '../../features/users/user-thunks';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordClick = () => setShowPassword(!showPassword);

  const dispatch = useDispatch();

  const toastify = useToastify();

  const navigate = useNavigate();

  const { isWorking, loginStatus, user, errorMessage } = useSelector((state) => state.user);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (loginStatus === 'success') {
      reset();
      toastify({ title: 'Success', description: `Welcome back ${user?.name}`, status: 'success' });
      dispatch(resetAuthState());
      navigate('/');
    } else if (loginStatus === 'failure') {
      toastify({ title: 'Error', description: errorMessage, status: 'error' });
      dispatch(resetAuthState());
    }
  }, [loginStatus, errorMessage, dispatch, toastify, reset]);

  const onSubmit = async (data) => {
    dispatch(loginThunk(data));
  };

  return (
    <Flex h="100vh" justify="center" alignItems="center" backgroundColor="gray.100">
      <Container maxW={{ base: '80%', md: '58%' }} boxShadow="dark-lg" p="6" rounded="md" bg="white">
        <Logo />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="2">
            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                {...register('email', {
                  required: 'Please enter your email address',
                })}
              />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  pr="4.5rem"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Enter your password',
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
          </Stack>

          <Center mt="1rem" mb="1rem">
            <ChakraLink as={ReactRouterLink} to="/signup">
              <Text fontSize="xs">Don't have an account? Register</Text>
            </ChakraLink>

            <Text fontSize="xs" pl="3" pr="3">
              |
            </Text>

            <ChakraLink as={ReactRouterLink} to="/reset-password">
              <Text fontSize="xs">Forgot Password</Text>
            </ChakraLink>
          </Center>

          <Center mt="2rem" mb="1rem">
            <Button w="260px" isLoading={isWorking} colorScheme="teal" type="submit">
              Sign In
            </Button>
          </Center>
        </form>
      </Container>
    </Flex>
  );
};
