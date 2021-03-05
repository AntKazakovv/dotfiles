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
}

export interface IPushMessageParams extends IMessageData, INotificationOptions {
    wlcElement?: string;
}

export interface INotificationMetadata {
    dismiss(): void;
}
