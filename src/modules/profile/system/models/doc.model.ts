import {
    IDoc,
    IDocResponse,
    ValidationStatus,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

import {AbstractDocModel} from './abstract.doc.model';

import _kebabCase from 'lodash-es/kebabCase';
import _merge from 'lodash-es/merge';

export class DocModel extends AbstractDocModel implements IDoc {
    public readonly ID: number;
    public readonly IDUser: number;
    public readonly IDVerifier: number;
    public readonly Status: ValidationStatus;
    public readonly StatusDescription: string;
    public readonly AddDate: string;
    public readonly UpdateDate: string;
    public readonly FileName: string;
    public readonly FileType: string;
    public readonly DocType: string;
    public readonly Description: string;
    public readonly Link: string;
    public readonly DownloadLink: string;
    private readonly iconPath: string;

    constructor(docResponse: IDocResponse, iconPath: string = '') {
        super();
        _merge(this, docResponse, {iconPath});
    }

    public get iconName(): string {
        return `${this.iconPath}${_kebabCase(this.Status).trim()}.svg`;
    }

    public get className(): string {
        return _kebabCase(this.Status);
    }

    public get statusText(): string {
        switch (this.Status) {
            case ValidationStatus.Awaiting:
                return gettext('Pending');
            case ValidationStatus.Failed:
                return gettext('Not correct');
            default:
                return gettext('Loaded');
        }
    }

    public get canDelete(): boolean {
        return this.Status === ValidationStatus.Awaiting;
    }

    public get validated(): boolean {
        return this.Status === ValidationStatus.Validated;
    }
}
