import { StatusCode } from "./api";
import { AppName, FileType } from "./context";

export interface UploadFilePayload {
  fileType: string;
  fileName: string;
  content: string;
  language?: string;
}
export interface UpdateFilePayload {
  id: string | number;
  dto: {
    fileType?: string;
    fileName?: string;
    content?: string;
    language?: string;
  };
}

export interface GetFilesResponse {
  code: StatusCode;
  data: {
    createdAt: string | null;
    updatedAt: string | null;
    id: string;
    deletedAt: string | null;
    fileName: string;
    fileType: AppName;
    userId: string;
  }[];
}

export interface GetSingleFileResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    fileType: string;
    fileName: string;
    content: {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      language: string | null;
      content: string;
    };
    userId: string;
  };
  code: StatusCode;
}
