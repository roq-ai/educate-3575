import axios from 'axios';
import queryString from 'query-string';
import { RenamedpublicInterface, RenamedpublicGetQueryInterface } from 'interfaces/renamedpublic';
import { GetQueryInterface } from '../../interfaces';

export const getRenamedpublics = async (query?: RenamedpublicGetQueryInterface) => {
  const response = await axios.get(`/api/renamedpublics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRenamedpublic = async (renamedpublic: RenamedpublicInterface) => {
  const response = await axios.post('/api/renamedpublics', renamedpublic);
  return response.data;
};

export const updateRenamedpublicById = async (id: string, renamedpublic: RenamedpublicInterface) => {
  const response = await axios.put(`/api/renamedpublics/${id}`, renamedpublic);
  return response.data;
};

export const getRenamedpublicById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/renamedpublics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRenamedpublicById = async (id: string) => {
  const response = await axios.delete(`/api/renamedpublics/${id}`);
  return response.data;
};
