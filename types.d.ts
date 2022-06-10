declare type VideoData = {
  id: number;
  fileName: string;
  type: string;
  timestamp: string;
  uri: string;
  fileSize: number;
  duration: number;
  width: number;
  height: number;
  thumbnail: string;
  firebaseUrl: string;
  analysisData: any;
  thumbnailURL: string;
  videoURL: string;
};

export type AuthObject = {
  email: string;
  password: string;
};

export type UserObject = {
  id: string;
  email: string;
  playerstyle: string;
  gender: string;
  height: string;
  birthday: string;
  location: string;
  rating: string;
  nationality: string;
  firstName: string;
  middleName: string;
  lastName: string;
  userType: string;
  paymentPlan: string;
};

type UserState = {
  authUser: UserObject;
};

type UserAction = {
  type: string;
  authUser: UserObject;
};

export type ErrorObject = {
  code?: string;
  message: string;
};
