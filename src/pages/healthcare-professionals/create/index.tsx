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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createHealthcareProfessional } from 'apiSdk/healthcare-professionals';
import { Error } from 'components/error';
import { healthcareProfessionalValidationSchema } from 'validationSchema/healthcare-professionals';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { HealthcareProfessionalInterface } from 'interfaces/healthcare-professional';

function HealthcareProfessionalCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HealthcareProfessionalInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHealthcareProfessional(values);
      resetForm();
      router.push('/healthcare-professionals');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HealthcareProfessionalInterface>({
    initialValues: {
      specialty: '',
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Healthcare Professional
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(HealthcareProfessionalCreatePage);
