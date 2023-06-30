import axios from 'axios';
import queryString from 'query-string';
import { MedicalEducatorInterface, MedicalEducatorGetQueryInterface } from 'interfaces/medical-educator';
import { GetQueryInterface } from '../../interfaces';

export const getMedicalEducators = async (query?: MedicalEducatorGetQueryInterface) => {
  const response = await axios.get(`/api/medical-educators${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMedicalEducator = async (medicalEducator: MedicalEducatorInterface) => {
  const response = await axios.post('/api/medical-educators', medicalEducator);
  return response.data;
};

export const updateMedicalEducatorById = async (id: string, medicalEducator: MedicalEducatorInterface) => {
  const response = await axios.put(`/api/medical-educators/${id}`, medicalEducator);
  return response.data;
};

export const getMedicalEducatorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/medical-educators/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMedicalEducatorById = async (id: string) => {
  const response = await axios.delete(`/api/medical-educators/${id}`);
  return response.data;
};
