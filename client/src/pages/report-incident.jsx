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
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToastify } from '../components/utilities/toast';
import { API } from '../services/api';

export const ReportIncident = () => {
  const [categories, setCategories] = useState([]);
  const [severityOptions, setSeverityOptions] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const toastify = useToastify();

  const navigate = useNavigate();

  useEffect(() => {
    setIsWorking(true);
    async function fetchCategories() {
      try {
        const response = await API.get('api/incidents/categories');
        setIsWorking(false);
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsWorking(false);
      }
    }

    async function fetchSeverityOptions() {
      try {
        const response = await API.get('api/incidents/severity/options');
        setIsWorking(false);
        setSeverityOptions(response.severityOptions);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsWorking(false);
      }
    }

    fetchCategories();
    fetchSeverityOptions();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsWorking(true);
      const result = await API.post('api/incidents', data);
      setIsWorking(false);

      if (result.success) {
        reset();
        toastify({
          title: 'Success',
          description: `Your incident with ID - ${result.data.id} is successfully created`,
          status: 'success',
        });
        navigate(`/incident/${result.data.id}`);
      } else {
        toastify({ title: 'Failure', description: `${result.errorMessage}`, status: 'error' });
      }
    } catch (error) {
      setIsWorking(false);
      console.log(error);
      toastify({ title: 'Failure', description: `${error.errorMessage}`, status: 'error' });
    }
  };

  return (
    <Flex h="100%" justify="center" py="100px" mb="400px" w="100vw" bg="gray.100" overflowX="hidden">
      <Container maxW={{ base: '90%', md: '60%' }} p="6" rounded="md" bg="white" variant={'elevated'} boxShadow="md">
        {isWorking ? (
          <CircularProgress isIndeterminate color="grey.300" />
        ) : (
          <>
            <Heading as="h1" size="lg" textAlign="center" mb="6">
              Report an Incident
            </Heading>
            <Text mb="4" textAlign="center">
              Fill in the form to safely report an incident, and we will get back to you within a maximum of 48 hours.
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="2">
                <FormControl isInvalid={errors.title}>
                  <Input
                    id="title"
                    variant="flushed"
                    placeholder="Title"
                    type="text"
                    {...register('title', {
                      required: 'Please enter a short title for the incident that occured',
                    })}
                  />
                  <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.location}>
                  <Input
                    id="location"
                    variant="flushed"
                    placeholder="Enter the location in which the incident occured(optional)"
                    type="text"
                    {...register('location')}
                  />
                  <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <Tooltip
                    label="High severity will escalate the issue, but all issues will be promptly addressed."
                    placement="right"
                    hasArrow>
                    <FormLabel htmlFor="severityOptions" cursor="pointer">
                      Set the severity for the incident
                    </FormLabel>
                  </Tooltip>
                  <Controller
                    name="severityOptions"
                    control={control}
                    defaultValue="Other"
                    render={({ field }) => (
                      <Select {...field} placeholder="Select severity of the incident">
                        {severityOptions.map((el, index) => (
                          <option key={index} value={el}>
                            {el}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="category">Select category</FormLabel>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue="Other"
                    rules={{ required: 'Please specify the category of the incident that occured' }}
                    render={({ field }) => (
                      <Select {...field} placeholder="Select category">
                        {categories.map((el, index) => (
                          <option key={index} value={el}>
                            {el}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={errors.incidentDate}>
                  <FormLabel htmlFor="incidentDate">Incident Date</FormLabel>
                  <Controller
                    name="incidentDate"
                    control={control}
                    defaultValue={new Date()}
                    rules={{ required: 'Please select the date when the incident occurred' }}
                    render={({ field }) => <SingleDatepicker date={field.value} onDateChange={field.onChange} />}
                  />
                  <FormErrorMessage>{errors.incidentDate && errors.incidentDate.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.description}>
                  <Textarea
                    id="description"
                    placeholder="Add an incident description"
                    h="15em"
                    {...register('description', {
                      required: 'Please provide a detailed description of the incident that occurred',
                    })}
                  />
                  <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                </FormControl>
              </Stack>
              <Center mt="2rem" mb="1rem">
                <Button disabled={isWorking} w="260px" mt="4" colorScheme="teal" type="submit">
                  SUBMIT
                </Button>
              </Center>
            </form>
          </>
        )}
      </Container>
    </Flex>
  );
};
