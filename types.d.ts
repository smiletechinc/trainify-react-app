type Color = {
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

declare enum ButtonState {
    DEFAULT = 'DEFAULT',
    HOVER = 'HOVER',
    CLICK = 'CLICK',
    DISABLED = 'DISABLED',
}

declare enum ReturnKeyType {
    Done = 'done',
    Go =  'go',
    NEXT = 'next',
    SEARCH = 'search',
    SEND = 'send'
}

// declare enum AutoCapitalize {
//     CHARACTERS = 'characters',
//     WORDS = 'words',
//     SENTENCES = 'sentences',
//     NONE = 'none',
// }