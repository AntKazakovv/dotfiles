import {
    StateDeclaration,
    Transition,
} from '@uirouter/core';

type TLifecycle =
    | 'onBefore'
    | 'onStart'
    | 'onFinish'
    | 'onSuccess';

type TLifecycleExt =
    | 'onEnter'
    | 'onExit';

interface ILifeCycleEvent {
    name: TLifecycle;
    transition: Transition;
}

interface ILifeCycleEventExt {
    name: TLifecycleExt;
    transition: Transition;
    state: StateDeclaration;
}

export type TLifecycleEvent = ILifeCycleEvent | ILifeCycleEventExt;

export interface ICurrentState {
    alias: string;
    params: Record<string, any>;
    url: string;
}

export const routerEventNames = {
    onSuccess: 'TRANSITION_SUCCESS',
    onEnter: 'TRANSITION_ENTER',
    onFinish: 'TRANSITION_FINISH',
} as const;
