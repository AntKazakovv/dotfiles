import {Element} from 'ltx';
import {IContact} from 'wlc-engine/modules/chat/system/services/chat.service';

/**
 * Extends default typescript `Event` with adding type to target element
 */
export interface DOMEvent<T extends EventTarget & Node = HTMLElement> extends Event {
    readonly target: T;
}

export interface DOMFocusEvent<T extends EventTarget & HTMLElement = HTMLElement> extends FocusEvent {
    readonly relatedTarget: T;
}

export interface ILogInRequest {
    service: string;
    domain: string;
    username: string;
    password: string;
}

export type TFormType = 'form' | 'submit' | 'cancel' | 'result';

export interface IForm {
    type: TFormType;
    title?: string;
    instructions: string[];
    fields: any[];
}

export interface IStanza extends Element {
    attrs: {
        [key: string]: string | undefined;
    };
    children: IStanza[];
    name: string;
}

export interface IMessage {
    direction: Direction;
    body: string;
    datetime: Date;
    ocId?: string;
    id?: string;
    from?: IContact;
    hash?: string;
    read?: boolean;
    show?: boolean;
}

export enum Direction {
    in = 'in',
    out = 'out',
}

export interface IRoom {
    key: string;
    value: string;
    imgKey: string;
    address?: string;
}

export * from './dialogs.interfaces';
