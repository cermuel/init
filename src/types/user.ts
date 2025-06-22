export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  avatar?: {
    Style?: string;
    Seed?: string;
    Url?: string;
    Color?: string;
  };
}

export interface GetProfileResponse {
  data: {
    emailAddress: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: {
      Style: string;
      Seed: string;
      Url: string;
      Color: string;
    } | null;
    phoneNumber: string | null;
  };
}
