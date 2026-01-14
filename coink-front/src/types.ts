export interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  countryId: number;
  countryName: string;
  departmentId: number;
  departmentName: string;
  municipalityId: number;
  municipalityName: string;
  createdAt: string;
}

export interface Country {
  id: number;
  name: string;
  isoCode: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Municipality {
  id: number;
  name: string;
}
