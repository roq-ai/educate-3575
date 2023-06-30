import * as yup from 'yup';

export const medicalEducatorValidationSchema = yup.object().shape({
  specialty: yup.string().required(),
  user_id: yup.string().nullable(),
});
