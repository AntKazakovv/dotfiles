import _every from 'lodash-es/every';
import _kebabCase from 'lodash-es/kebabCase';
import _some from 'lodash-es/some';
import _assign from 'lodash-es/assign';

import {IFromLog} from 'wlc-engine/modules/core';
import {DocModel} from 'wlc-engine/modules/profile/system/models/doc.model';
import {AbstractDocModel} from 'wlc-engine/modules/profile/system/models/abstract.doc.model';
import {
    IDocType,
    LoaderStatus,
    ValidationStatus,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

interface IDocPreview {
    base64?: string,
    file?: File,
}

export class DocGroupModel extends AbstractDocModel<IDocType> {
    private _preview: IDocPreview = {};

    constructor(
        from: IFromLog,
        data: IDocType,
        public docs: DocModel[] = [],
        private twoStepLoading = false,
        private iconPath: string = '',
    ) {
        super(
            _assign({model: 'DocGroupModel'}, from),
            data,
        );
    }

    /**
     * Set preview
     *
     * @param {IDocPreview} previewObj
     */
    public set preview(previewObj: IDocPreview) {
        this._preview = previewObj;
    }

    /**
     * Icon path with icon name
     *
     * @returns {string}
     */
    public get iconName(): string {
        return `${this.iconPath}${_kebabCase(this.typeKey).trim()}.svg`;
    }

    /**
     * Default icon path
     *
     * @returns {string}
     */
    public get defaultIcon(): string {
        return `${this.iconPath}default.svg`;
    }

    /**
     * Doc list icon path
     *
     * @returns {string}
     */
    public get docList(): string {
        return `${this.iconPath}doc-common.svg`;
    }

    /**
     * Preview file
     *
     * @returns {File}
     */
    public get previewFile(): File {
        return this._preview.file;
    }

    /**
     * Doc image preview in base64
     *
     * @returns {string}
     */
    public get previewString(): string {
        return this._preview.base64;
    }

    /**
     * Check docs verification status
     *
     * @returns {string} path to the document verification status icon
     */
    public get statusIconName(): string {
        const {Validated, Awaiting, Failed} = ValidationStatus;

        if (!this.docs.length) {
            return `${this.iconPath}${_kebabCase(Awaiting).trim()}.svg`;
        }
        if (_every(this.docs, (doc) => doc.status === Validated)) {
            return `${this.iconPath}${_kebabCase(Validated).trim()}.svg`;
        }
        if (_some(this.docs, (doc) => doc.status === Failed)) {
            return `${this.iconPath}${_kebabCase(Failed).trim()}.svg`;
        }
        if (_some(this.docs, (doc) => doc.status === Awaiting)) {
            return `${this.iconPath}${_kebabCase(Awaiting).trim()}.svg`;
        }

        return `${this.iconPath}${_kebabCase(Awaiting).trim()}.svg`;
    }

    /**
     * Have we image preview?
     *
     * @returns {boolean}
     */
    public get isSelected(): boolean {
        return !!(this.twoStepLoading && this.previewString);
    }

    /**
     * Upload button text
     *
     * @returns {string}
     */
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

    /**
     * Doc type id
     *
     * @returns {string}
     */
    public get id(): string {
        return this.data.ID;
    }

    /**
     * Doc type name
     *
     * @returns {string}
     */
    public get name(): string {
        return this.data.Name;
    }

    /**
     * Doc type key
     *
     * @returns {string}
     */
    public get typeKey(): string {
        return this.data.TypeKey;
    }

    /**
     * Doc type description
     *
     * @returns {string}
     */
    public get description(): string {
        return this.data.Description;
    }
}
