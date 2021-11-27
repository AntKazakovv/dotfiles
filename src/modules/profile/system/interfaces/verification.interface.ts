export interface IDocType {
    ID: string;
    Name: string;
    TypeKey: string;
    Description?: string;
}

export enum ValidationStatus {
    Awaiting = 'AwaitingValidation',
    Validated = 'Validated',
    Failed = 'FailedValidation',
}

export interface IUserDoc {
    ID: number;
    IDUser: number;
    IDVerifier: number;
    Status: ValidationStatus;
    StatusDescription: string;
    AddDate: string;
    UpdateDate: string;
    FileName: string;
    FileType: string;
    DocType: string;
    Description: string;
    Link: string;
    DownloadLink: string;
}

export enum LoaderStatus {
    Loading = 'loading',
    Deleting = 'deleting',
    Ready = 'ready'
}

export interface IDroppedFiles {
    label: string;
    files: FileList;
}

export interface ISelectOptions {
    value: unknown;
    title: string;
}
