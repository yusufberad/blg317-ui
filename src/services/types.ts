export interface HttpResponse<T> {
  data: T | null;

  status: number;
}

export interface Movie {
  id: number;
  name: string;
  year: number;
  rank: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface defaultResponse {
  success: boolean;
  statusCode: number;
  status: string;
  message: string;
  messageDetail?: string;
  timestamp: string;
}

export interface Teacher {
  id: number;
  username: string;
  university: string;
  department: string;
  examType: string;
  degree: string;
  image: string;
  subject: Subject[];
}

export interface defaultListResponse<T> {
  content: T[];
  totalElements: number;
  last: boolean;
  totalPages: number;
  first: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}
