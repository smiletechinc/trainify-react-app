declare type Color = {
    id: number,
    name: string,
    code: string,
}

type AuthObject = {
    email:string;
    password:string;
};

type UserObject = {
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

type ErrorObject = {
    code?: string;
    message: string, 
}