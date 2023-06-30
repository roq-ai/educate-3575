import axios from 'axios';
import queryString from 'query-string';
import {
  HealthcareProfessionalInterface,
  HealthcareProfessionalGetQueryInterface,
} from 'interfaces/healthcare-professional';
import { GetQueryInterface } from '../../interfaces';

export const getHealthcareProfessionals = async (query?: HealthcareProfessionalGetQueryInterface) => {
  const response = await axios.get(`/api/healthcare-professionals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHealthcareProfessional = async (healthcareProfessional: HealthcareProfessionalInterface) => {
  const response = await axios.post('/api/healthcare-professionals', healthcareProfessional);
  return response.data;
};

export const updateHealthcareProfessionalById = async (
  id: string,
  healthcareProfessional: HealthcareProfessionalInterface,
) => {
  const response = await axios.put(`/api/healthcare-professionals/${id}`, healthcareProfessional);
  return response.data;
};

export const getHealthcareProfessionalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/healthcare-professionals/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteHealthcareProfessionalById = async (id: string) => {
  const response = await axios.delete(`/api/healthcare-professionals/${id}`);
  return response.data;
};
