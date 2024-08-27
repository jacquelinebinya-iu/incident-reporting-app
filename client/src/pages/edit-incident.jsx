import {
  Button,
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
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useToastify } from '../components/utilities/toast';
import { API } from '../services/api';

export const EditIncident = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [incident, setIncident] = useState({});
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
    const fetchIncidentDetails = async () => {
      try {
        setIsWorking(true);
        const response = await API.get(`api/incidents/${id}`);
        reset({ ...response.data });
        setIncident(response.data);

        setIsWorking(false);
      } catch (error) {
        console.error('Error fetching incident details:', error);
        setIsWorking(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await API.get('api/incidents/categories');
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchIncidentDetails();
    fetchCategories();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsWorking(true);
      const result = await API.patch(`api/incidents/${incident.id}`, data);
      setIsWorking(false);
      if (result.success) {
        toastify({
          title: 'Success',
          description: `Incident with ID - ${id} has been successfully updated`,
          status: 'success',
        });
        navigate(`/incident/${id}`);
      } else {
        toastify({ title: 'Failure', description: `${result.data.errorMessage}` });
      }
    } catch (error) {
      console.log(error);
      toastify({ title: 'Failure', description: 'An error occurred while updating the incident', status: 'error' });
      setIsWorking(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Flex h="100vh" justify="center" py="100px" w="100vw" overflowX="hidden">
      <Container maxW={{ base: '90%', md: '60%' }} p="6" rounded="md" bg="white">
        {isWorking ? (
          <CircularProgress isIndeterminate color="grey.300" />
        ) : (
          <>
            <Heading as="h1" size="lg" textAlign="center" mb="6">
              Edit Incident
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="2">
                <FormControl isInvalid={errors.title}>
                  <Input
                    id="title"
                    variant="flushed"
                    placeholder="Title"
                    type="text"
                    {...register('title', {
                      required: 'Please enter a short title for the incident that occurred',
                    })}
                  />
                  <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="category">Select category</FormLabel>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue="Other"
                    rules={{ required: 'Please specify the category of the incident that occurred' }}
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

                <Input type="text" name="incidentDate" {...register('incidentDate', {})} disabled />

                {/* <FormControl isInvalid={errors.incidentDate}>
                  <FormLabel htmlFor="incidentDate">Incident Date</FormLabel>
                  <Controller
                    name="incidentDate"
                    control={control}
                    defaultValue={new Date() }
                    rules={{ required: "Please select the date when the incident occurred" }}
                    render={({ field }) => {

                        return(
                     <>
                     <h1>{JSON.stringify(incident.incidentDate)}</h1>
                     <SingleDatepicker
                        date={incident.incidentDate || new Date ()}
                        onDateChange={field.onChange}
                      />
                     </>
                      
                    )}}
                  />
                  <FormErrorMessage>
                    {errors.incidentDate && errors.incidentDate.message}
                  </FormErrorMessage>
                </FormControl> */}

                <FormControl isInvalid={errors.description}>
                  <Textarea
                    id="description"
                    placeholder="Add an incident description"
                    h="30em"
                    {...register('description', {
                      required: 'Please provide a detailed description of the incident that occurred',
                    })}
                  />
                  <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                </FormControl>
              </Stack>
              <Flex mt="2rem" pb="7rem" justify="space-between">
                <Button disabled={isWorking} maxW="8em" mt="4" colorScheme="teal" type="button" onClick={goBack}>
                  CANCEL
                </Button>
                <Button disabled={isWorking} maxW="8em" mt="4" colorScheme="teal" type="submit">
                  UPDATE
                </Button>
              </Flex>
            </form>
          </>
        )}
      </Container>
    </Flex>
  );
};
