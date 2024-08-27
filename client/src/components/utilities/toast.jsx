import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

export const useToastify = () => {
  const toast = useToast();
  console.log('Toastify is called');

  const toastify = useCallback(
    ({ title, description, status }) => {
      toast({
        title,
        description,
        status,
        isClosable: true,
        position: 'top',
      });
    },
    [toast]
  );

  return toastify;
};
