import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Button, Fade, Flex, IconButton, Link as ChakraLink, Spacer, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';

import deskLogo from '../assets/imp_long.svg';
import { logoutThunk } from '../features/users/user-thunks';

export const Menu = () => {
  const [display, changeDisplay] = useState('none');
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    try {
      dispatch(logoutThunk());

      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <Flex pos="fixed" top="0rem" right="0rem" zIndex={20} w="100%" boxShadow="lg" bg="white">
      <Flex display={['none', 'none', 'flex', 'flex']} w="100%" alignItems="center">
        <Flex my="0.5rem" px="1rem">
          <ChakraLink as={ReactRouterLink} to="/">
            <img src={deskLogo} width="103px" alt="A logo" />
          </ChakraLink>
        </Flex>

        <Spacer />

        <Flex>
          <ChakraLink as={ReactRouterLink} to="report">
            <Button variant="ghost" aria-label="Report an Incident" my="0.5rem" w="100%">
              Report an Incident
            </Button>
          </ChakraLink>

          <ChakraLink as={ReactRouterLink} to="/profile">
            <Button variant="ghost" aria-label="Profile" my="0.5rem" w="100%">
              Profile
            </Button>
          </ChakraLink>

          <Button variant="ghost" aria-label="Logout" my="0.5rem" w="100%" onClick={logoutHandler}>
            Logout
          </Button>
        </Flex>
      </Flex>

      <Flex display={['flex', 'flex', 'none', 'none']} w="100%" alignItems="center">
        <Flex my="0.5rem" p="0.5rem">
          <ChakraLink as={ReactRouterLink} to="/">
            <img src={deskLogo} alt="A logo" />
          </ChakraLink>
        </Flex>

        <Spacer />

        <IconButton
          aria-label="Open Menu"
          variant={'ghost'}
          size="lg"
          mr={0}
          icon={<HamburgerIcon />}
          onClick={() => {
            onToggle();
            changeDisplay('flex');
          }}
        />
      </Flex>
      <Fade in={isOpen}>
        <Flex
          w="100vw"
          bgColor="gray.50"
          pos={'fixed'}
          top="0"
          left={'0'}
          overflow={'auto'}
          flexDirection={'column'}
          display={display}>
          <Flex w="100%" my="0.5rem" p="0.5rem" justifyContent="space-between" alignItems={'center'}>
            <ChakraLink as={ReactRouterLink} to="/">
              <img src={deskLogo} alt="A logo" />
            </ChakraLink>

            <IconButton
              aria-label="Close Menu"
              variant={'ghost'}
              size="lg"
              icon={<CloseIcon />}
              onClick={() => {
                onToggle();
                changeDisplay('none');
              }}
            />
          </Flex>

          <Flex flexDirection={'column'} align="center">
            <ChakraLink as={ReactRouterLink} to="/report">
              <Button
                variant="ghost"
                aria-label="Report an Incident"
                my="5"
                w="100%"
                onClick={() => {
                  onToggle();
                  changeDisplay('none');
                }}>
                Report an Incident
              </Button>
            </ChakraLink>

            <ChakraLink as={ReactRouterLink} to="/profile">
              <Button
                variant="ghost"
                aria-label="Profile"
                my="5"
                w="100%"
                onClick={() => {
                  onToggle();
                  changeDisplay('none');
                }}>
                Profile
              </Button>
            </ChakraLink>

            <Button variant="ghost" aria-label="Logout" my="5" w="100%" onClick={logoutHandler}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Fade>
    </Flex>
  );
};
