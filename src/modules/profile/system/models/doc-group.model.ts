import {
    DocModel,
    IDocGroup,
    IDocTypeResponse,
    LoaderStatus,
    ValidationStatus,
} from 'wlc-engine/modules/profile';
import {AbstractDocModel} from './abstract.doc.model';

import {
    every as _every,
    kebabCase as _kebabCase,
    merge as _merge,
    some as _some,
} from 'lodash-es';

export class DocGroupModel extends AbstractDocModel implements IDocGroup {
    public readonly ID;
    public readonly Name;
    public readonly TypeKey;
    public readonly Description;
    public readonly docs;
    public preview;
    private readonly twoStepLoading;

    constructor(docType: IDocTypeResponse, docs: DocModel[] = [], twoStepLoading: boolean = false) {
        super();
        _merge(this, docType, {
            preview: {},
            docs,
            twoStepLoading,
        });
    }

    public get iconName(): string {
        return _kebabCase(this.TypeKey);
    }

    public get previewString(): string {
        return this.preview.base64;
    }

    public get statusIconName(): string {
        const {Validated, Awaiting, Failed} = ValidationStatus;

        if (!this.docs.length) {
            return _kebabCase(Awaiting);
        }
        if (_every(this.docs, ({Status}) => Status === Validated)) {
            return _kebabCase(Validated);
        }
        if (_some(this.docs, ({Status}) => Status === Failed)) {
            return _kebabCase(Failed);
        }
        if (_some(this.docs, ({Status}) => Status === Awaiting)) {
            return _kebabCase(Awaiting);
        }

        return _kebabCase(Awaiting);
    }

    public get isSelected(): boolean {
        return !!(this.twoStepLoading && this.previewString);
    }

    public get buttonText(): string {
        if(this.twoStepLoading
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
