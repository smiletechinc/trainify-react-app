declare type Color = {
    id: number,
    name: string,
    code: string,
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