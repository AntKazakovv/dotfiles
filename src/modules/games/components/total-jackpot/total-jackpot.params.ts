import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';
import {CountUpOptions} from 'countup.js';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';


export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type TotalJackpotNoContentByThemeType = Partial<Record<ComponentTheme, INoContentCParams>>;

export interface ITotalJackpotCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    countUpOptions?: CountUpOptions;
    noContent?: TotalJackpotNoContentByThemeType;
}

export const defaultParams: ITotalJackpotCParams = {
    class: 'wlc-total-jackpot',
    moduleName: 'games',
    componentName: 'wlc-total-jackpot',
    theme: 'default',
    countUpOptions: {
        separator: ' ',
        decimalPlaces: 0,
        decimal: ',',
    },
};

