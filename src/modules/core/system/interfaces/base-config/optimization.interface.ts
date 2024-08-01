import {TDeviceSelection} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export interface IOptimizationConfig {
    slimImages?: ISlimImages;
    slimExtraImages?: ISlimExtraImages;
    lazyLoadingIntersectionObserver?: ILazyLoadingIntersectionObserver;
}

export interface ISlimExtraImages {
    use: boolean;
}

export interface ISlimImages {
    /** Use or not */
    use: boolean;
    /** Use some activation rules */
    activation?: IActivation;
}

export interface IActivation {
    /** For which devices (desktop, mobile or any) */
    deviceType?: TDeviceSelection;
    /** Activate if duration of flog 0.0.9 is more than specified */
    siteCompileTime?: number;
}

export interface ILazyLoadingIntersectionObserver {
    use?: boolean;
    components?: TLazyLoadingComponents[];
}

type TLazyLoadingComponents = 'icon-list';
