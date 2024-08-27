import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import md5 from 'md5';
import { useCallback, useEffect, useState } from 'react';
import { FiBarChart2, FiHome, FiMenu, FiUsers } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { NavLink as ReactRouterLink, useLocation, useNavigate } from 'react-router-dom';

import deskLogo from '../assets/imp_long.svg';
import { logoutThunk } from '../features/users/user-thunks';
import { API } from '../services/api.js';

const LinkItems = [
  { name: 'Dashboard', icon: FiHome, url: '/admin' },
  { name: 'Incidents', icon: FiBarChart2, url: '/admin/incidents' },
  { name: 'Users', icon: FiUsers, url: '/admin/users' },
  { name: 'Admins', icon: FiUsers, url: '/admin/manage-admins' },
];

// Function to generate Gravatar URL
const getGravatarUrl = (email) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

const CustomAvatar = ({ email }) => <Avatar size={'sm'} src={getGravatarUrl(email)} />;

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      overflow="hidden"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <ChakraLink as={ReactRouterLink} to="/admin">
          <img src={deskLogo} width="103px" alt="A logo" />
        </ChakraLink>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} to={link.url} isActive={location.pathname === link.url}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, isActive, children, to, ...rest }) => {
  return (
    <Box as={ReactRouterLink} to={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'gray.900' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        {...rest}>
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const [admin, setAdmin] = useState({ email: '', name: '', surname: '', role: '' });
  const [isWorking, setIsWorking] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCurrentAdmin = useCallback(async () => {
    setIsWorking(true);
    try {
      const response = await API.get('/api/current');
      console.log(':::::::Current Admin', response.data);
      setAdmin(response.data);
      setIsWorking(false);
    } catch (error) {
      setIsWorking(false);
      console.log(error);
    }
  }, [admin.id]);

  useEffect(() => {
    fetchCurrentAdmin();
  }, [fetchCurrentAdmin]);

  const logoutHandler = () => {
    try {
      dispatch(logoutThunk());

      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return isWorking ? (
    <Text>Loading</Text>
  ) : (
    <Flex
      position={'fixed'}
      zIndex={1000}
      maxW={{ base: '100%', md: `calc(100vw - ${15}rem)` }}
      w="100%"
      // overflow="hidden"
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <CustomAvatar email={admin.email} />
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <VStack display="flex" alignItems="flex-start" spacing="1px" ml="2" pb="20px" px={'6px'}>
                <Text fontWeight={'bold'}>{`${admin.name} ${admin.surname}`}</Text>
                <Text fontSize="sm" color="gray.600">
                  {admin.role}
                </Text>
              </VStack>
              <MenuItem role={'button'} onClick={() => navigate('/admin/profile')}>
                Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem role={'button'} onClick={logoutHandler}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export const Sidebar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} overflow="hidden">
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* Mobile navigation */}
      <MobileNav onOpen={onOpen} />
      <Box
        ml={{ base: 0, md: 60 }}
        mt={'60px'}
        p="4"
        position={'relative'}
        zIndex={10}
        maxW={{ base: '100vw', md: `calc(100vw - ${15}rem)` }}
        overflow="auto">
        {children}
      </Box>
    </Box>
  );
};
