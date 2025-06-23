export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export interface ErrorType {
  data: {
    message: string[] | string;
    statusCode?: StatusCode;
  };
}

export interface ApiErrorData {
  message: string;
  error: string;
  statusCode: number;
}

export interface FetchError {
  error: {
    status: number;
    data: ApiErrorData;
  };
  isUnhandledError: boolean;
  meta: {
    request: Record<string, any>;
    response: Record<string, any>;
  };
}
