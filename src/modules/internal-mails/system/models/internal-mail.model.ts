import {
    AbstractModel,
    GlobalHelper,
    IFromLog,
    IIndexing,
} from 'wlc-engine/modules/core';
import {
    IInternalMail,
    TInternaiMailStatus,
} from 'wlc-engine/modules/internal-mails/system/interfaces/internal-mails.interface';

import _assign from 'lodash-es/assign';
import _isString from 'lodash-es/isString';

export class InternalMailModel extends AbstractModel<IInternalMail> {
    public static currentLanguage: string;
    private _nameLangValue: string;
    private _contentLangValue: string;

    constructor(
        from: IFromLog,
        data: IInternalMail,
    ) {
        super({from: _assign({model: 'InternalMailModel'}, from)});
        this.data = data;
        this._nameLangValue = this.getLangValue(this.data.Name);
        this._contentLangValue = this.getLangValue(this.data.Content);
    }

    /**
     * @returns {string} mail id
     */
    public get id(): string {
        return this.data.ID;
    }

    /**
     * @returns {string} the sender of the mail
     */
    public get from(): string {
        return gettext('Administration');
    }

    /**
     * @returns {string} mail title
     */
    public get title(): string {
        return this._nameLangValue;
    }

    /**
     * @returns {string} day of creation of the mail
     */
    public get date(): string {
        return GlobalHelper.toLocalTime(this.data.Created, 'SQL', 'dd-MM-yyyy HH:mm');
    }

    /**
     * @returns {string} mail's message
     */
    public get content(): string {
        return this._contentLangValue;
    }

    /**
     * @returns {TInternaiMailStatus} mail's reading status
     */
    public get status(): TInternaiMailStatus {
        return this.data.Status;
    }

    /**
     * Set mail's reading status
     * @param {boolean} status if `true` set 'readed' status, if `false` set 'new' status
     */
    public set readedStatus(status: boolean) {
        this.data.Status = status ? 'readed' : 'new';
    }

    /**
     * Parse the value to the current language
     *
     * @param {string | IIndexing<string>} value value for parsing to the current language
     * @returns {string} value in the current language
     */
    private getLangValue(value: string | IIndexing<string>): string {
        if (_isString(value)) {
            try {
                // Clear value from wrapping tags
                const regExp = /{".+"}/;
                if (regExp.test(value)) {
                    const data = JSON.parse(value.match(regExp).toString());
                    return data[InternalMailModel.currentLanguage] || data['en'];
                } else {
                    throw new Error();
                }
            } catch (error) {
                return value;
            }
        }
        return value[InternalMailModel.currentLanguage] || value['en'];
    }
}
