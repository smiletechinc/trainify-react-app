export type Metadata = {
  [key: string]: string | number | boolean;
};
// export interface HomeReducer {
//   aqiData: null | [];
//   aqi: number;
// }
// export interface PatientReducer {
//   healthData: Object;
// }


export type UserObject = {
  id:string;
  email:string;
  firstName:string;
  middleName:string;
  lastName:string;
  gender:string;
  height:string;
  birthday:string;
  location:string;
  rating:string;
  nationality:string;
  playerstyle:string;
  userType:string;
  paymentPlan:string;
}