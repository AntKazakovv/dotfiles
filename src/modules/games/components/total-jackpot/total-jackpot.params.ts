import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';
import {CountUpOptions} from 'countup.js';


export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITotalJackpotCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    countUpOptions?: CountUpOptions;
}

export const defaultParams: ITotalJackpotCParams = {
    class: 'wlc-total-jackpot',
    countUpOptions: {
        separator: ' ',
        decimalPlaces: 0,
        decimal: ',',
    },
};
