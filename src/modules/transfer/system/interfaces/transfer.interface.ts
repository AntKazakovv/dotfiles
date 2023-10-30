export enum TransferByEnum {
    EMAIL = 0,
    ID = 1,
    EMAIL_OR_ID = 2,
}

export interface ITransferSendDataParams {
    email: string;
    amount: number;
    type: 'email' | 'sms';
}

export interface ITransfer {
    TransferBy: TransferByEnum,
    DisableConfirmation: boolean,
    CurrentDaily: string;
    IDBonus?: string;
    MaxOnce?: string;
    MinOnce?: string;
    MaxDaily?: string;
    DocsVerified: boolean;
}

export interface ITransferResponse {
    result: string;
}

export interface ITransferLimits {
    min: number;
    max: number;
}
