export interface IIconParams {
    showAs?: IconType;
    iconUrl?: string;
    iconHoverUrl?: string;
    postfix?: IPostfix;
    modifier?: string;
    sref?: string;
    href?: string;
    target?: string;
    alt?: string;
    title?: string;
}

interface IPostfix {
    main: string;
    hover?: string;
}

type IconType = 'img' | 'svg';

export class IconModel {
    readonly showAs: IconType;
    readonly modifier: string;
    readonly sref: string;
    readonly href: string;
    readonly target: string;
    readonly alt: string;
    readonly title: string;

    constructor (
        protected icon: IIconParams,
    ) {
        this.modifier = icon.modifier;
        this.sref = icon.sref;
        this.href = icon.href;
        this.alt = icon.alt;
        this.title = icon.title;
        this.target = icon.target || (icon?.sref) ? '_self' : '_blank';
        this.showAs = (icon.showAs !== 'img' && icon.iconUrl.split('.').pop()) === 'svg' ? 'svg' : 'img';
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

    public get image():string {
        if (this.icon.iconUrl) {
            return this.icon.iconUrl;
        }
    }

    public get imageHover():string {
        if (this.icon.iconHoverUrl) {
            return this.icon.iconHoverUrl;
        }
    }

    public get image2x():string {
        if (this.icon.postfix?.main && this.icon.iconUrl) {
            return this.addPostfix(this.icon.iconUrl, this.icon.postfix.main);
        }
    }

    public get imageHover2x():string {
        if (this.icon.postfix?.hover && this.icon.iconHoverUrl) {
            return this.addPostfix(this.icon.iconHoverUrl, this.icon.postfix.hover);
        }
    }

    protected addPostfix(image: string, postfix: string): string {
        const ext = image.split('.').pop();
        return `${image.replace('.' + ext, '')}${postfix}.${ext} 2x`;
    }

}
