import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { HttpResponse } from "./types";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface IParams {
  [key: string | number]: string | number | boolean | null | undefined;
}

interface HttpOptions {
  baseUrl?: string;
}

class HttpService {
  private http: AxiosInstance;

  constructor(options: HttpOptions) {
    this.http = axios.create({
      baseURL: options.baseUrl,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
  }
  private get getAuthorization() {
    const accessToken = Cookies.get("token");
    console.log(accessToken);
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }

  public service() {
    this.injectInterceptors();
    return this;
  }

  private setupHeaders(hasAttachment = false) {
    return hasAttachment
      ? {
          "Content-Type": "multipart/form-data",
          ...this.getAuthorization,
        }
      : {
          "Content-Type": "application/json",
          ...this.getAuthorization,
        };
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    options: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    this.service();
    let resultData: HttpResponse<T>;
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options,
      });
      const responseData = response.data as T;
      resultData = { data: responseData || null, status: response.status };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        resultData = {
          data: error.response.data,
          status: error.response.status,
        };
      } else {
        resultData = { data: null, status: 500 };
      }
    }
    return resultData;
  }

  //Perform a GET request
  public async get<T>(
    url: string,
    params?: IParams,
    hasAttachment = false,
  ): Promise<HttpResponse<T>> {
    const requestData: IParams = {};
    for (const key in params) {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        requestData[key] = params[key];
      }
    }
    return this.request<T>(HttpMethod.GET, url, {
      params: requestData,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  //Perform a PUT request
  public async put<T, P>(
    url: string,
    payload: P,
    params?: IParams,
    hasAttachment = false,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(HttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  //Perform a POST request
  public async post<T, P>(
    url: string,
    payload: P,
    params?: IParams,
    hasAttachment = false,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(HttpMethod.POST, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  //Perform a UPDATE request
  public async update<T, P>(
    url: string,
    payload: P,
    params?: IParams,
    hasAttachment = false,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(HttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  //Perform a DELETE request
  public async delete<T>(
    url: string,
    params?: IParams,
    hasAttachment = false,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(HttpMethod.DELETE, url, {
      params,
      headers: this.setupHeaders(hasAttachment),
    });
  }
  //Inject interceptors for request and response
  private injectInterceptors() {
    //Set up request interceptor
    this.http.interceptors.request.use((request) => {
      //*Perform an action before the request is sent
      return request;
    });

    this.http.interceptors.response.use(
      (response) => {
        //*Perform an action before the response is returned
        return response;
      },

      (error) => {
        if (401 === error.response.status) {
          // 401 hatası alındığında kullanıcıyı doğrudan çıkış yaptır
          return refreshAuthUserLogout();
        } else if (error.response.status === 500) {
          error.response.data = "Sunucu hatası oluştu.";
          return error.response;
        } else {
          return error.response;
        }
      },
    );
  }
}
const refreshAuthUserLogout = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  Cookies.remove("username");
  window.localStorage.clear();
  window.location.href = "/login";
  return Promise.reject("error refreshing token");
};

export default HttpService;
