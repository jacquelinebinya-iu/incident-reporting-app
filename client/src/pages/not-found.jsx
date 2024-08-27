import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Go to the home page
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mb={4}>
        404 - Not Found
      </Heading>
      <Text fontSize="xl" mb={6}>
        The page you are looking for does not exist.
      </Text>
      <Button colorScheme="teal" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
