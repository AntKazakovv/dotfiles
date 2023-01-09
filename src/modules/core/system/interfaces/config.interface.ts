import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.params';

export interface IDefaultConfig {
    replaceConfig?: boolean;
}

export interface ISvgIcons {
    [key: string]: string;
}

export type CustomType = 'custom';
export interface IComponentParams<T, R, M> {
    moduleName?: string;
    componentName?: string;
    wlcElement?: string;
    class?: string;
    theme?: 'default' | T;
    type?: R;
    themeMod?: 'default' | M;
    customMod?: string | string[];
}

export interface IComponentWithPendingBtns<T, R, M> extends IComponentParams<T, R, M> {
    btnsParams: IIndexing<IButtonCParams>;
}
