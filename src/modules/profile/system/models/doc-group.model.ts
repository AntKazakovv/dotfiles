import {
    IDocTypeResponse,
    LoaderStatus,
    ValidationStatus,
    IDocGroup,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';
import {DocModel} from 'wlc-engine/modules/profile/system/models/doc.model';
import {AbstractDocModel} from './abstract.doc.model';

import _every from 'lodash-es/every';
import _kebabCase from 'lodash-es/kebabCase';
import _merge from 'lodash-es/merge';
import _some from 'lodash-es/some';

export class DocGroupModel extends AbstractDocModel implements IDocGroup {
    public readonly ID;
    public readonly Name;
    public readonly TypeKey;
    public readonly Description;
    public readonly docs;
    public preview;
    private readonly twoStepLoading;
    private readonly iconPath: string;

    constructor(
        docType: IDocTypeResponse,
        docs: DocModel[] = [],
        twoStepLoading: boolean = false,
        iconPath: string = '',
    ) {
        super();
        _merge(this, docType, {
            preview: {},
            docs,
            twoStepLoading,
            iconPath,
        });
    }

    public get iconName(): string {
        return `${this.iconPath}${_kebabCase(this.TypeKey).trim()}.svg`;
    }

    public get defaultIcon(): string {
        return `${this.iconPath}default.svg`;
    }

    public get docList(): string {
        return `${this.iconPath}doc-common.svg`;
    }

    public get previewString(): string {
        return this.preview.base64;
    }

    public get statusIconName(): string {
        const {Validated, Awaiting, Failed} = ValidationStatus;

        if (!this.docs.length) {
            return `${this.iconPath}${_kebabCase(Awaiting).trim()}.svg`;
        }
        if (_every(this.docs, ({Status}) => Status === Validated)) {
            return `${this.iconPath}${_kebabCase(Validated).trim()}.svg`;
        }
        if (_some(this.docs, ({Status}) => Status === Failed)) {
            return `${this.iconPath}${_kebabCase(Failed).trim()}.svg`;
        }
        if (_some(this.docs, ({Status}) => Status === Awaiting)) {
            return `${this.iconPath}${_kebabCase(Awaiting).trim()}.svg`;
        }

        return `${this.iconPath}${_kebabCase(Awaiting).trim()}.svg`;
    }

    public get isSelected(): boolean {
        return !!(this.twoStepLoading && this.previewString);
    }

    public get buttonText(): string {
        if (this.twoStepLoading
            && !this.previewString
            && this.loadingStatus === LoaderStatus.Ready) {
            return gettext('Select File');
        }

        switch (this.loadingStatus) {
            case LoaderStatus.Loading:
                return gettext('File is loading...');
            case LoaderStatus.Deleting:
                return gettext('File is deleting...');
            default:
                return gettext('Upload');
        }
    }
}
