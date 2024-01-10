export interface ILocationChange {
    path: string;
}

export interface IError {
    code: ErrorCodes;
}

export enum ErrorCodes {
    UserInvalidCredentials = 2004,
    UnserNotAuthorized = 2005,
}
