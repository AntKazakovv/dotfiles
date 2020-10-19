import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export type ModifiersType = string;

export interface ISPParams extends IComponentParams {
    modifiers?: ModifiersType[];
    common?: {
    };
}

export const defaultParams: ISPParams = {
    class: 'wlc-post',
    common: {
    },
};
