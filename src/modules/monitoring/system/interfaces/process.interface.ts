import {Subscription} from 'rxjs';
import {
    IEvent,
    IGetParams,
} from 'wlc-engine/modules/core';

export type TProcessConfigs = {
    [key: string]: IProcessConfig;
}

export interface IProcessConfig {
    use: boolean;
    launchOnAppStart?: boolean;
    launch?: IProcessConfigGroup;
    start?: IProcessConfigGroup;
    fail?: IProcessConfigGroup;
    success?: IProcessConfigGroup;
    stop?: IProcessConfigGroup;
    restart?: IProcessConfigGroup;
    launchAfterTimer?: number;
    startAfterTimer?: number;
    failAfterTimer?: number;
    successAfterTimer?: number;
    stopAfterTimer?: number;
    relaunchAfterFail?: boolean;
    relaunchAfterSuccess?: boolean;
    relaunchAfterStop?: boolean;
}

export interface IProcessConfigGroup {
    triggers: (IEvent<IProcessEventData> | IProcessConfigEvent)[];
    exceptionsForGroup?: IProcessExceptions;
}


export interface IProcessEventData {
    eventId?: string;
    description?: string;
    comparator?: TComparatorFn;
}

export type TComparatorFn = (triggerData: IProcessEventData, eventData: unknown) => boolean;

export interface IProcessConfigEvent {
    events: IEvent<IProcessEventData>[];
    exceptions?: IProcessExceptions;
}

export interface IProcessExceptions {
    events?: IEvent<IProcessEventData>[];
    configParams?: IProcessExceptionConfigParam[];
}

export interface IProcessExceptionConfigParam {
    param: string | IGetParams;
    comparator?: (data: unknown) => boolean;
}


export interface ILaunchedProcess {
    status: TLaunchedProcessType;
    subscriptions: TLaunchedProcessSubscriptions;
    timers: TLaunchedProcessTimers;
}

type TLaunchedProcessType = 'created' | 'launched' | 'started' | 'succeed' | 'failed' | 'stopped';

type TLaunchedProcessSubscriptions = {
    [Key in TProcessSubscribeEvent]: ILaunchedProcessSubscription[];
}

export type TProcessSubscribeEvent = 'launch' | 'start' | 'fail' | 'success' | 'stop' | 'restart';

export interface ILaunchedProcessSubscription {
    subscription: Subscription;
    exceptionsSubscription?: Subscription;
}

type TLaunchedProcessTimers = {
    [Key in TProcessSubscribeEvent]: ReturnType<typeof setTimeout>[];
}
