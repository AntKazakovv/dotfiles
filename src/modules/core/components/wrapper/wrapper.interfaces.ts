import {
    ILayoutComponent,
    ISmartSectionConfig,
} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export interface IWrapperCParams {
    components?: ILayoutComponent[];
    class?: string;
    wlcElement?: string;
    smartSection?: ISmartSectionConfig;
}
