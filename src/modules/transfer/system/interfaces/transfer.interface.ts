export interface ITransferSendDataParams {
    email: string;
    amount: number;
    type: 'email' | 'sms';
}

export interface ITransferParams {
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
