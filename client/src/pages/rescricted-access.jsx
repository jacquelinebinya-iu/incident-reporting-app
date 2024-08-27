import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestrictedAccess = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Go to the home page
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mb={4}>
        Restricted Access
      </Heading>
      <Text fontSize="xl" mb={6}>
        You do not have permission to view this page.
      </Text>
      <VStack spacing={4}>
        <Button colorScheme="teal" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button colorScheme="teal" onClick={handleGoHome}>
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default RestrictedAccess;
