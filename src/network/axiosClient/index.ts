import axios from 'axios';
import {API_ENDPOINT_ENV} from '../Server';

const axiosClient = axios.create({
  baseURL: API_ENDPOINT_ENV,
  //timeout: 35000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

axiosClient.interceptors.request.use(async config => {
  // Handle token here ...
  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  error => {
    
    if (error && error.response) {
      if (error.response.status >= 400 && error.response.status <= 600) {
        throw new FBBackendError(
          error.response.status,
          error.response.data.msg || error.response.data.message,
        );
      } else if (error.response.status === 0) {
        throw new FBAppError(
          error.response.status,
          'networkerror.no_network',
        );
      }
    }
    throw new FBGenericError(error.response?.status);
  },
);

export default axiosClient;

export class FBError {}

export const isFBBackendError = (error: any): error is FBBackendError => {
  return error instanceof FBBackendError;
};

export class FBBackendError extends FBError{
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
  
  public toSignOut() {
    return this.status === 401;
  }
}

export const isFBAppError = (error: any): error is FBAppError => {
  return error instanceof FBAppError;
};

export class FBAppError extends FBError{
  public status: number;
  public key: string;

  constructor(status: number, key: string) {
    super();
    this.status = status;
    this.key = key;
  }
}

export const isFBGenericError = (error: any): error is FBGenericError => {
  return error instanceof FBGenericError;
};

export class FBGenericError extends FBError{
  public key = 'genericerror'
  public status?: number;
  
  constructor(status?: number) {
    super();
    this.status = status;
  }
}
