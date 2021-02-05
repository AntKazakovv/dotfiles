export interface IDocTypeResponse {
    ID: string;
    Name: string;
    TypeKey: string;
}

export enum ValidationStatus {
    Awaiting = 'AwaitingValidation',
    Validated = 'Validated',
    Failed = 'FailedValidation',
}

export interface IDoc {
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

export type LoaderType = 'loading' | 'deleting' | false;

export interface IDocItem extends IDocTypeResponse {
    docs?: IDoc[];
    loading?: LoaderType;
}

export interface IDroppedFiles {
    label: string;
    files: FileList;
}
