export interface User {
  id?: number | null;
  email: string;
  profileName: string;
  phone: number | string;
  username: string;
  password: string;
  country: string;
  role: number | string;
  buildings?: any[];
}

export interface UserInvalidForms {
  ALL?: boolean;
  id?: Number | null;
  email?: string;
  profileName?: string;
  username?: string;
  password?: string;
  country?: string;
  role?: number | null;
  phone?: number | string | null;
}


export interface Country {
   id: string|number;
   long_name: string;
   short_name : string;
   center_lat : number;
   center_lng : number;
   sw_lat: number;
   sw_lng: number;
   ne_lat: number;
   ne_lng: number;
}

export interface UserState {
  status: 'idle' | 'loading' | 'failed';
  users: any;
  queryUsers: any;
  countries: any;//Array<Country>|null|undefined;//Country[];
  userById: any;
  loadingUsers: boolean;
}

export interface Criteria {
  username?: string;
  email?: string;
  phone?: number;
  country?: string;
  profileName?: string;
  password?: string;
  role?: number | null;
}





