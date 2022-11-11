import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {RawParams} from '@uirouter/core';

import _assign from 'lodash-es/assign';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

/** Input params for an icon in an icon list [IconListComponent]{@link IconListComponent}. */
export interface IIconParams {
    /** Defines how to display image. If not defined, it will be defined automatically */
    showAs?: IconType;
    /** Path to image  */
    iconUrl?: string;
    /** Path to image which be displayed by hover. */
    iconHoverUrl?: string;
    /** Postfix for image resolutions (2x supported). */
    postfix?: IPostfix;
    /** Class modifier for the list item.  */
    modifier?: string;
    /** Inside link. Only one parameter available `sref` or `href` */
    sref?: string;
    /** Params for sref */
    srefParams?: RawParams;
    /** Outside link. Only one parameter available `sref` or `href`. */
    href?: string;
    /** If not defined, uses `_self` for `sref` and `_blank` for `href`. */
    target?: string;
    /** Image alt attribute. Requires only if image is displayed with `<img>` tag. */
    alt?: string;
    /** Link title attribute. Requires only if image is displayed with `<a>` tag. */
    title?: string;
    wlcElement?: string;
}

/** Image resolution postfix. Example: `'@2x'`. */
interface IPostfix {
    main: string;
    hover?: string;
}

/** Type of displayed icon. */
type IconType = 'img' | 'svg';

export class IconModel extends AbstractModel<IIconParams> {
    public isError: boolean = false;

    constructor(
        from: IFromLog,
        data: IIconParams,
    ) {
        super({from: _assign({model: 'IconModel'}, from)});
        this.data = {
            ...data,
            target: data.target || (data?.sref) ? '_self' : '_blank',
            showAs: (data.showAs !== 'img' && data.iconUrl.split('.').pop()) === 'svg' ? 'svg' : 'img',
            wlcElement: data.wlcElement || 'wlc-icon',
        };
    }

    /**
     * @returns {string} return modifier
     */
    public get modifier(): string {
        return this.data.modifier;
    }

    /**
     * @returns {string} return sref
     */
    public get sref(): string {
        return this.data.sref;
    }

    /**
     * @returns {string} return srefParams
     */
    public get srefParams(): RawParams {
        return this.data.srefParams;
    }

    /**
     * @returns {string} return href
     */
    public get href(): string {
        return this.data.href;
    }

    /**
     * @returns {string} return alt icon
     */
    public get alt(): string {
        return this.data.alt;
    }

    /**
     * @returns {string} return target
     */
    public get target(): string {
        return this.data.target;
    }

    /**
     * @returns {string} return title
     */
    public get title(): string {
        return this.data.title;
    }

    /**
     * return showAs. Defines how to display image.
     */
    public get showAs(): IconType {
        return this.data.showAs;
    }

    /**
     * @returns {string} return wlcElement
     */
    public get wlcElement(): string {
        return this.data.wlcElement;
    }

    public get template(): string {
        if (this.href) {
            return 'href';
        } else if (this.sref) {
            return 'sref';
        } else {
            return 'span';
        }
    }

    public get image(): string {
        return GlobalHelper.proxyUrl(this.data.iconUrl);
    }

    public get imageHover(): string {
        return GlobalHelper.proxyUrl(this.data.iconHoverUrl);
    }

    public get image2x(): string {
        if (this.data.postfix?.main && this.data.iconUrl) {
            return this.addPostfix(GlobalHelper.proxyUrl(this.data.iconUrl), this.data.postfix.main);
        }
    }

    public get imageHover2x(): string {
        if (this.data.postfix?.hover && this.data.iconHoverUrl) {
            return this.addPostfix(GlobalHelper.proxyUrl(this.data.iconHoverUrl), this.data.postfix.hover);
        }
    }

    protected addPostfix(image: string, postfix: string): string {
        const ext = image.split('.').pop();
        return `${image.replace('.' + ext, '')}${postfix}.${ext} 2x`;
    }

}
