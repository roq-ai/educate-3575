import axios from 'axios';
import queryString from 'query-string';
import { EmergencyResponderInterface, EmergencyResponderGetQueryInterface } from 'interfaces/emergency-responder';
import { GetQueryInterface } from '../../interfaces';

export const getEmergencyResponders = async (query?: EmergencyResponderGetQueryInterface) => {
  const response = await axios.get(`/api/emergency-responders${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmergencyResponder = async (emergencyResponder: EmergencyResponderInterface) => {
  const response = await axios.post('/api/emergency-responders', emergencyResponder);
  return response.data;
};

export const updateEmergencyResponderById = async (id: string, emergencyResponder: EmergencyResponderInterface) => {
  const response = await axios.put(`/api/emergency-responders/${id}`, emergencyResponder);
  return response.data;
};

export const getEmergencyResponderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/emergency-responders/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmergencyResponderById = async (id: string) => {
  const response = await axios.delete(`/api/emergency-responders/${id}`);
  return response.data;
};
