import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmergencyResponderInterface {
  id?: string;
  user_id?: string;
  specialty: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface EmergencyResponderGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  specialty?: string;
}
