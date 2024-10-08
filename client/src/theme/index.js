import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
};

export const theme = extendTheme({
  fonts: {
    heading: 'Quicksand',
    body: 'Quicksand',
  },
  breakpoints,
});
