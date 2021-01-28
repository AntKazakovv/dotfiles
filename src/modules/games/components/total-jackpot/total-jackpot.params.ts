import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';
import {CountUpOptions} from 'countup.js';


export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITotalJackpotCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    title?: string;
    countUpOptions?: CountUpOptions;
}

export const defaultParams: ITotalJackpotCParams = {
    class: 'wlc-total-jackpot',
    title: 'Total Jackpot:',
    countUpOptions: {
        separator: ' ',
        decimalPlaces: 2,
        decimal: ',',
    },
};
