import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModifiersType = string;

export interface ISPParams extends IComponentParams<string, string, string> {
    modifiers?: ModifiersType[];
    common?: {
    };
}

export const defaultParams: ISPParams = {
    class: 'wlc-post',
    common: {
    },
};
