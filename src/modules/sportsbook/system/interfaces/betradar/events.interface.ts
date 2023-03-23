export interface ILocationChange {
    path: string;
}

export interface IError {
    code: ErrorCodes;
}

export enum ErrorCodes {
    BalanceLessThanAmount = 2003,
    UserInvalidCredentials = 2004,
    UserNotAuthorized = 2005,
}
