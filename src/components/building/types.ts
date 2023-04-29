

export interface BuildingInvalidForms {
  ALL?: boolean;
  username?: string,
  buildingName?: string|null|undefined,
  region?: string|null|undefined,
  country?: string,
  countryMapObj?: string|null|undefined,
  map?: {
    lat?: number|null,
    lng?: number|null
  },
  size?: number|string,
  floor?: number|string,
  rooms?: number|string,
  pricePerDay?: number|string,
  availability?: number|string|boolean,
  imgs?: Array<string>,
  bundles?: Array<Object>
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


export interface BuildingCriteria {
  assignTo?: string|number|null|undefined;
  buildingId?:number;
  username?: string;
  name?: string|null|undefined;
  buildingName?: string|null|undefined;
  region?: string|null|undefined;
  country?: string|null|undefined;
  countryMapObj?: string|null|undefined;
  map?: {
    lat?: number|null,
    lng?: number|null
  };
  size?: {
    min?: number|null|undefined|boolean|string,
    max?: number|null|undefined|boolean|string
  };
  pricePerDay?:  {
    min?: number|null|undefined|boolean|string,
    max?: number|null|undefined|boolean|string
  };
  floor?: number|string;
  rooms?: number|string;
  availability?: number|string|boolean|string[];
  imgs?: Array<string>;
  bundles?: Array<Object>;
  availableTomorrow?: boolean|null|undefined|string;
}


export interface BuildingState {
  status: 'idle' | 'loading' | 'failed';
  buildings: any;
  queryBuildings: any;
  countries: any;//Array<Country>|null|undefined;//Country[];
  buildingById: any;
}


export interface Bundle {
  emptyBundle?: boolean;
  name: string;
  dinner: boolean;
  breakfast: boolean;
  lunch: boolean;
  selfCatering: boolean;
  wifi: boolean;
  bundlePrice: null|number;
  days: null|number;
  dates: Array<string>;
}



export interface Building {
  id?: number;
  assignTo: number;
  username: string;
  buildingName: string|null|undefined;
  region: string|null|undefined;
  country: string;
  countryMapObj: string|null|undefined;
  map: {
    lat: number|string|null;
    lng: number|string|null;
  },
  size: number|string;
  floor: number|string;
  rooms: number|string;
  pricePerDay: number|string;
  availability: number|string|boolean|string[];
  imgs: Array<string>;
  bundles: Array<Bundle>;
  rating: number;
  visits: number;
}







