export interface IKycamlData {
    url: string;
    service: 'SumSub' | 'ShuftiPro';
    status: string;
}

export type TDocsMode = 'manual' | 'kycMode';

export type questionnaireStatus = 'AwaitingValidation' | 'FailedValidation' | 'Validated' | 'Expired';

export interface IUserDoc {
    AddDate: string,
    Added: string,
    AdditionalParams?: Record<string, string>[],
    CreatedBy: string,
    Description: string,
    DocType: string,
    ExpiryDate: string,
    FileName: string,
    FileType: string,
    ID: number,
    IDUser: number,
    IDVerifier: number,
    Mode: TDocsMode,
    Modified: string,
    Name: Record<string,string>,
    Status: string,
    StatusDescription: string,
    StatusDescriptionPrivate: string,
    TypeKey: string,
    UpdateDate: string,
    isDisabled: number,
    isInternal: number,
}
