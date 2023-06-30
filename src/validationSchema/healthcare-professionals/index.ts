import * as yup from 'yup';

export const healthcareProfessionalValidationSchema = yup.object().shape({
  specialty: yup.string().required(),
  user_id: yup.string().nullable(),
});
