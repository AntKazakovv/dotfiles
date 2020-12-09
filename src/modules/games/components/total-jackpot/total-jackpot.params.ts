import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITotalJackpotCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    title?: string;
}

export const defaultParams: ITotalJackpotCParams = {
    class: 'wlc-total-jackpot',
    title: 'Total Jackpot:',
};
