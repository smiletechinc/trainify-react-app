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
}

export type AuthObject = {
    email:string;
    password:string;
};

export type UserObject = {
    id:string;
    email:string;
    playerstyle:string;
    gender:string;
    height:string;
    birthday:string;
    location:string;
    rating:string;
    nationality:string;
}

export type ErrorObject = {
    code?: string;
    message: string, 
}