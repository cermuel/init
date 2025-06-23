export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  avatar?: {
    style?: string;
    seed?: string;
    url?: string;
    color?: string;
  };
}

export interface GetProfileResponse {
  data: {
    emailAddress: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: {
      style: string;
      seed: string;
      url: string;
      color: string;
    } | null;
    phoneNumber: string | null;
  };
}
