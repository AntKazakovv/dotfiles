import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModifiersType = string;

export interface IPostCParams extends IComponentParams<string, string, string> {
    modifiers?: ModifiersType[];
    slug?: string;
    setTitle?: (title: string) => void;
    parseAsPlainHTML?: boolean;
}

export const defaultParams: IPostCParams = {
    class: 'wlc-post',
    parseAsPlainHTML: false,
};
