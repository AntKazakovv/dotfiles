import {RawParams} from '@uirouter/core';

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

export class IconModel {
    readonly showAs: IconType;
    readonly modifier: string;
    readonly sref: string;
    readonly srefParams: RawParams;
    readonly href: string;
    readonly target: string;
    readonly alt: string;
    readonly title: string;
    readonly wlcElement: string;
    public isError: boolean = false;

    constructor(
        protected icon: IIconParams,
    ) {
        this.modifier = icon.modifier;
        this.sref = icon.sref;
        this.srefParams = icon.srefParams;
        this.href = icon.href;
        this.alt = icon.alt;
        this.title = icon.title;
        this.target = icon.target || (icon?.sref) ? '_self' : '_blank';
        this.showAs = (icon.showAs !== 'img' && icon.iconUrl.split('.').pop()) === 'svg' ? 'svg' : 'img';
        this.wlcElement = icon.wlcElement || 'wlc-icon';
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
        if (this.icon.iconUrl) {
            return this.icon.iconUrl;
        }
    }

    public get imageHover(): string {
        if (this.icon.iconHoverUrl) {
            return this.icon.iconHoverUrl;
        }
    }

    public get image2x(): string {
        if (this.icon.postfix?.main && this.icon.iconUrl) {
            return this.addPostfix(this.icon.iconUrl, this.icon.postfix.main);
        }
    }

    public get imageHover2x(): string {
        if (this.icon.postfix?.hover && this.icon.iconHoverUrl) {
            return this.addPostfix(this.icon.iconHoverUrl, this.icon.postfix.hover);
        }
    }

    protected addPostfix(image: string, postfix: string): string {
        const ext = image.split('.').pop();
        return `${image.replace('.' + ext, '')}${postfix}.${ext} 2x`;
    }

}
