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
type Video = {
  id: number;
  fileName: string;
  type: string;
  timestamp: string;
  fileSize: number;
  duration: number;
  width: number;
  analysisData: any;
  thumbnailURL: string;
  videoURL: string;
  createrId: string;
  name: string;
  thumbnailURI: string;
  videoURI: string;
};

export type VideoState = {
  videos: Video[];
};

type VideoAction = {
  type: string;
  video: Video;
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

type DispatchType = (args: VideoAction) => VideoAction;
type Videos = Array<Video>;
