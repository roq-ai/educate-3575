import * as yup from 'yup';

export const emergencyResponderValidationSchema = yup.object().shape({
  specialty: yup.string().required(),
  user_id: yup.string().nullable(),
});
