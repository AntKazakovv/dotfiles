import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export type BlockType = 'type-default';
export type BlockTheme = 'default' | string;
export type AutoModifiersType = BlockType;
export type ManualModifiersType = string;
export type ModifiersType = AutoModifiersType | ManualModifiersType | null;

export interface IParams extends IComponentParams<BlockTheme, BlockType, string> {
    modifiers?: ModifiersType[];
    type?: BlockType;
    common?: {
        additionalModifiers?: ManualModifiersType;
    };
}

export const defaultParams: IParams = {
    class: 'wlc-login-signup',
    common: {
    },
};
