import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface ISource {
    media?: string;
    sizes?: string;
    srcset?: string;
    /** MIME type */
    type?: string;
}

export interface IImageCParams extends IComponentParams<string, string, string> {
    /**
     * Image src for picture that will be loaded faster then main picture.
     * Can be specified automatically, if used engine cdn //agstatic
     * */
    slimSrc?: string;
    /**
     * Sources for picture that will be loaded faster then main picture.
     * Can be specified automatically, if used engine cdn //agstatic
     * */
    slimSources?: ISource[];
    /** Image path for img tag (if path from sources not applied) */
    src?: string;
    /** Sources of image, for picture tag */
    sources?: ISource[];
    /** Add value of attribute wlcElement on element */
    wlcElement?: string;
    /** Use this image path if source from sources not loaded successfully */
    fallback?: string;
    /** Hide image if source from sources not loaded successfully */
    hideOnError?: boolean;
}

export const defaultParams: IImageCParams = {
    moduleName: 'core',
    componentName: 'wlc-image',
    class: 'wlc-image',
};
