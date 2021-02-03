import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModifiersType = string;

export interface IPostCParams extends IComponentParams<string, string, string> {
    modifiers?: ModifiersType[];
    common?: {
    };
}

export const defaultParams: IPostCParams = {
    class: 'wlc-post',
    common: {
    },
};
