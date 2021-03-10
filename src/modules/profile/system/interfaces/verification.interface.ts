import {DocModel} from 'wlc-engine/modules/profile/system/models/doc.model';

export interface IDocTypeResponse {
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

export interface IDocResponse {
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

export interface IDoc extends IDocResponse {
    iconName: string;
    className: string;
    statusText: string;
    validated: boolean;
    canDelete: boolean;
}

export enum LoaderStatus {
    Loading = 'loading',
    Deleting = 'deleting',
    Ready = 'ready'
}

export interface IDocGroup extends IDocTypeResponse {
    docs: DocModel[];
    iconName: string;
    buttonText: string;
    statusIconName: string;
    previewString: string;
    pending: boolean;
    preview: {
        base64?: string,
        file?: File,
    };
    switchLoader(status: LoaderStatus): void;
}

export interface IDroppedFiles {
    label: string;
    files: FileList;
}

export interface ISelectOptions {
    value: unknown;
    title: string;
}
