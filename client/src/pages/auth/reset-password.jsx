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
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';

import { Logo } from '../../components/auth/logo';
import { useToastify } from '../../components/utilities/toast';
import { resetAuthState } from '../../features/user-slice';
import { resetPasswordThunk } from '../../features/users/user-thunks';

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordClick = () => setShowPassword(!showPassword);
  const handleConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

  const dispatch = useDispatch();

  const toastify = useToastify();

  const navigate = useNavigate();

  const { isWorking, errorMessage, resetPasswordStatus } = useSelector((state) => state.user);
  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (resetPasswordStatus === 'success') {
      reset();
      toastify({
        title: 'Success',
        description: `🎊Congratulations your password is successfully reset, please login to continue`,
        status: 'success',
      });
      dispatch(resetAuthState());
      navigate('/login');
    } else if (resetPasswordStatus === 'failure') {
      toastify({ title: 'Error', description: errorMessage, status: 'error' });
      dispatch(resetAuthState());
    }
  }, [resetPasswordStatus, errorMessage, dispatch, toastify, reset]);

  const onSubmit = async (data) => {
    dispatch(resetPasswordThunk(data));
  };

  return (
    <Flex h="100vh" justify="center" alignItems="center" backgroundColor="gray.100">
      <Container maxW={{ base: '80%', md: '58%' }} boxShadow="dark-lg" p="6" rounded="md" bg="white">
        <Logo />
        <Text mb="4">Enter your email and new password below.</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email} mb="4">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password} mb="4">
            <FormLabel htmlFor="password">New Password</FormLabel>
            <InputGroup size="md">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+]).{6,}$/,
                    message: 'Password must contain at least one number and one special character',
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

          <FormControl isInvalid={errors.confirmPassword} mb="6">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Enter your new password again"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
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

          <Center mt="1rem" mb="1rem">
            <ChakraLink as={ReactRouterLink} to="/login">
              <Text fontSize="xs">Already have an account? Sign in</Text>
            </ChakraLink>
          </Center>

          <Center mt="2rem" mb="1rem">
            <Button w="260px" isLoading={isWorking} colorScheme="teal" type="submit">
              Reset Password
            </Button>
          </Center>
        </form>
      </Container>
    </Flex>
  );
};
