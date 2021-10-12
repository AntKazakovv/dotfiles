import {RawParams} from '@uirouter/core';

import {
    AbstractModel,
    IFromLog,
    LogService,
} from 'wlc-engine/modules/core';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

export interface IPromoItemFields extends Omit<IPromoCustomFieldsResponse, 'button_link' | 'custom_button_link'>{
    sref: string,
    srefParams: RawParams,
}

/**
 * this fields must be in wordpress custom fields in promotion posts
 * and posts must be in 'promotion_posts' category
 */
export interface IPromoCustomFieldsResponse {
    short_description: string,
    background_image: string,
    bg_gradient: boolean,
    bonus_size: 'half_screen' | 'fullscreen',
    button_link: string,
    custom_button_link: string,
    button_text: string,
    decor_image: string,
    promo_sort_weight: number,
}

export interface IUrlSettings {
    sref: string,
    srefParams: RawParams,
};

export class WpPromoModel extends AbstractModel<TextDataModel>{
    private _acf: IPromoItemFields;

    constructor(
        from: IFromLog,
        data: TextDataModel,
        protected logService: LogService,
    ) {
        super({from: _assign({model: 'WpPromoModel'}, from)});
        this.data = data;
    }

    /**
     * return image url
     * @returns {string} image url
     */
    public get bgImageUrl(): string {
        return this._acf.background_image ? `url(${this._acf.background_image})` : '';
    }

    /**
     * return true if on wordpress this value setted as 'fullscreen'
     * @returns {boolean} fullwidth item
     */
    public get isFullscreenWidth(): boolean {
        return this._acf.bonus_size === 'fullscreen';
    }

    /**
     * return true if on wp this value setted true, by default false
     * @returns {boolean} use gradient
     */
    public get useBgGradient(): boolean {
        return this._acf.bg_gradient || false;
    }

    /**
     * return title of promo item
     * @returns {string} title
     */
    public get title(): string {
        return this.data.title || '';
    }

    /**
     * returns long description from wp
     * @returns {string} description
     */
    public get description(): string {
        return this._acf.short_description || '';
    }

    /**
     * returns button text
     * @returns {string} button text
     */
    public get buttonText(): string {
        return this._acf.button_text || '';
    }

    /**
     * returns sref
     * @returns {string} button sref
     */
    public get buttonSref(): string {
        return this._acf.sref || '';
    }

    /**
     * returns srefParams
     * @returns {RawParams} button srefParams
     */
    public get buttonSrefParams(): RawParams {
        return this._acf.srefParams || {};
    }

    /**
     * returns html string
     * @returns {string} html
     */
    public get html(): string {
        return this.data.html || '';
    }

    /**
     * returns decor image url
     * @returns {string} decor image url
     */
    public get decorImageUrl(): string {
        return this._acf.decor_image || '';
    }

    /**
     * return sort weight of item, if no value returns 0
     * @returns {number} sort weight
     */
    public get sortWeight(): number {
        return _toNumber(this._acf.promo_sort_weight) || 0;
    }

    public set data(data: TextDataModel) {
        super.data = data;

        const acf: IPromoCustomFieldsResponse = this.data.extFields?.acf || {};

        let urlButtonSettings: IUrlSettings = {sref: '', srefParams: {}};
        if (acf.custom_button_link) {
            try {
                urlButtonSettings = JSON.parse(acf.custom_button_link);
            } catch (error) {
                this.logService.sendLog({
                    code: '0.0.13',
                    from: {model: 'WpPromoModel', method: 'initData'},
                    data: error,
                });
            }
        } else {
            urlButtonSettings.sref = acf.button_link;
        }

        this._acf = _assign(acf, urlButtonSettings);
    }

    public get data(): TextDataModel {
        return super.data;
    }
}
