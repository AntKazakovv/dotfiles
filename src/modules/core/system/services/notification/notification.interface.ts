import {
    Type,
} from '@angular/core';

import {IMessageData} from 'wlc-engine/modules/core/components/message/message.interface';

export interface INotificationOptions {
    dismissTime?: number;
}

export interface IPushComponentParams extends INotificationOptions {
    Component: Type<unknown>;
    componentParams?: unknown;
    modalTitle?: string;
}

export interface IPushMessageParams extends IMessageData, INotificationOptions {}

export interface INotificationMetadata {
    isModal: boolean;
    dismiss(): void;
}
