import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getHealthcareProfessionalById, updateHealthcareProfessionalById } from 'apiSdk/healthcare-professionals';
import { Error } from 'components/error';
import { healthcareProfessionalValidationSchema } from 'validationSchema/healthcare-professionals';
import { HealthcareProfessionalInterface } from 'interfaces/healthcare-professional';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function HealthcareProfessionalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HealthcareProfessionalInterface>(
    () => (id ? `/healthcare-professionals/${id}` : null),
    () => getHealthcareProfessionalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HealthcareProfessionalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHealthcareProfessionalById(id, values);
      mutate(updated);
      resetForm();
      router.push('/healthcare-professionals');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<HealthcareProfessionalInterface>({
    initialValues: data,
    validationSchema: healthcareProfessionalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Healthcare Professional
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="specialty" mb="4" isInvalid={!!formik.errors?.specialty}>
              <FormLabel>Specialty</FormLabel>
              <Input type="text" name="specialty" value={formik.values?.specialty} onChange={formik.handleChange} />
              {formik.errors.specialty && <FormErrorMessage>{formik.errors?.specialty}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'healthcare_professional',
    operation: AccessOperationEnum.UPDATE,
  }),
)(HealthcareProfessionalEditPage);
