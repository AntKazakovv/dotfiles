import _kebabCase from 'lodash-es/kebabCase';
import _assign from 'lodash-es/assign';

import {IFromLog} from 'wlc-engine/modules/core';
import {AbstractDocModel} from 'wlc-engine/modules/profile/system/models/abstract.doc.model';
import {
    IUserDoc,
    ValidationStatus,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

export class DocModel extends AbstractDocModel<IUserDoc> {

    constructor(
        from: IFromLog,
        data: IUserDoc,
        private iconPath: string,
    ) {
        super(
            _assign({model: 'DocModel'}, from),
            data,
        );
    }

    /**
     * Icon path with icon name
     *
     * @returns {string}
     */
    public get iconName(): string {
        return `${this.iconPath}${_kebabCase(this.status).trim()}.svg`;
    }

    /**
     * Class name in kebab-case
     *
     * @returns {string}
     */
    public get className(): string {
        return _kebabCase(this.status);
    }

    /**
     * Status text
     *
     * @returns {string}
     */
    public get statusText(): string {
        switch (this.status) {
            case ValidationStatus.Awaiting:
                return gettext('Pending');
            case ValidationStatus.Failed:
                return gettext('Not correct');
            case ValidationStatus.Expired:
                return gettext('Expired');
            default:
                return gettext('Loaded');
        }
    }

    /**
     * Can we delete doc?
     *
     * @returns {boolean}
     */
    public get canDelete(): boolean {
        return this.status === ValidationStatus.Awaiting;
    }

    /**
     * Is doc validated?
     *
     * @returns {boolean}
     */
    public get validated(): boolean {
        return this.status === ValidationStatus.Validated;
    }

    /**
     * Doc id
     *
     * @returns {number}
     */
    public get id(): number {
        return this.data.ID;
    }

    /**
     * User id
     *
     * @returns {number}
     */
    public get idUser(): number {
        return this.data.IDUser;
    }

    /**
     * Verifier id
     *
     * @returns {number}
     */
    public get idVerifier(): number {
        return this.data.IDVerifier;
    }


    /**
     * Status description
     *
     * @returns {string}
     */
    public get statusDescription(): string {
        return this.data.StatusDescription;
    }

    /**
     * Time when the document was added (Format: 'YYYY-MM-DD HH:MM:SS')
     *
     * @returns {string}
     */
    public get addDate(): string {
        return this.data.AddDate;
    }

    /**
     * Update date
     *
     * @returns {string}
     */
    public get updateDate(): string {
        return this.data.UpdateDate;
    }

    /**
     * File name
     *
     * @returns {string}
     */
    public get fileName(): string {
        return this.data.FileName;
    }

    /**
     * File extension
     *
     * @returns {string}
     */
    public get fileType(): string {
        return this.data.FileType;
    }

    /**
     * Doc type
     *
     * @returns {string}
     */
    public get docType(): string {
        return this.data.DocType;
    }

    /**
     * Validation status
     *
     * @returns {ValidationStatus}
     */
    public get status(): ValidationStatus {
        return this.data.Status;
    }

    /**
     * Description
     *
     * @returns {string}
     */
    public get description(): string {
        return this.data.Description;
    }

    /**
     * File link
     *
     * @returns {string}
     */
    public get link(): string {
        return this.data.Link;
    }

    /**
     * File download link
     *
     * @returns {string}
     */
    public get downloadLink(): string {
        return this.data.DownloadLink;
    }
}
