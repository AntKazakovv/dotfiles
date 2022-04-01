import * as Params from './message.params';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export type TObjectFit = 'contain' | 'cover' | 'scale-down' | 'fill' | 'none';
export type TOnActionClick = 'dismiss' | (() => void);

export interface IImage {
    src: string;
    alt?: string;
    fit?: TObjectFit;
}

export interface IAction {
    label: string;
    onClick: TOnActionClick;
}

export interface IMessageData {
    message: string | string[];
    messageContext?: IIndexing<string | number>;
    title?: string;
    displayAsHTML?: boolean;
    showCloseButton?: boolean;
    type?: Params.TMessageType;
    action?: IAction;
    image?: IImage;
    wlcElement?: string;
}
