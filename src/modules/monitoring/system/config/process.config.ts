import {
    ILaunchedProcess,
    IProcessEventData,
    TComparatorFn,
    TProcessConfigs,
} from 'wlc-engine/modules/monitoring/system/interfaces/process.interface';

export enum ProcessEvents {
    launchTrigger = 'launchTrigger',
    startTrigger = 'startTrigger',
    successTrigger = 'successTrigger',
    failTrigger = 'failTrigger',
    stopTrigger = 'stopTrigger',
    restartTrigger = 'restartTrigger',
    modalOpened = 'modalOpened',
    modalClosed = 'modalClosed',
    buttonPressed = 'buttonPressed',
    beforeunload = 'beforeunload',
}

export enum ProcessEventsDescriptions {
    launchTrigger = 'Launch: ',
    startTrigger = 'Start: ',
    successTrigger = 'Success: ',
    failTrigger = 'Error: ',
    stopTrigger = 'Stop: ',
    restartTrigger = 'Restart: ',
    modalOpened = 'Modal opened: ',
    modalClosed = 'Modal closed: ',
    buttonPressed = 'Button pressed: ',
    beforeunload = 'Page is unloaded',
    noReason = 'no reason',
}

// Comparator function used for 'SHOW_MODAL' event (open modal with passed id)
// for checking that trigger eventId match opened modal id
const comparatorShowModal: TComparatorFn = (triggerData: IProcessEventData, modalId: string): boolean => {
    return triggerData.eventId === modalId;
};

// Comparator function used for checking that modal closed but NOT because of form submitting
const comparatorModalClosed: TComparatorFn =
    (triggerData: IProcessEventData, eventData: IProcessEventData): boolean => {
        return triggerData.eventId === eventData.eventId &&
            eventData.description !== ProcessEventsDescriptions.modalClosed + 'submit';
    };

// Comparator function used for checking that login error is NOT wrong password and NOT captcha error
const comparatorLoginFail: TComparatorFn = (triggerData: IProcessEventData, eventData: IProcessEventData): boolean => {
    return triggerData.eventId === eventData.eventId &&
        (
            eventData.description !== ProcessEventsDescriptions.failTrigger + '403 (/auth PUT)'
            && eventData.description !== ProcessEventsDescriptions.failTrigger + '429 (/auth PUT)'
        );
};

// Comparator function used for checking that login error is wrong password or captcha error
const comparatorLoginRestart: TComparatorFn = (
    triggerData: IProcessEventData,
    eventData: IProcessEventData,
): boolean => {
    return triggerData.eventId === eventData.eventId &&
        (
            eventData.description === ProcessEventsDescriptions.failTrigger + '403 (/auth PUT)'
            || eventData.description === ProcessEventsDescriptions.failTrigger + '429 (/auth PUT)'
        );
};

// Comparator function used for checking that signup error is NOT 'email exist'
const comparatorSignupFail: TComparatorFn = (triggerData: IProcessEventData, eventData: IProcessEventData): boolean => {
    return triggerData.eventId === eventData.eventId &&
        eventData.description !== ProcessEventsDescriptions.failTrigger + 'http 400';
};

// Comparator function used for checking that signup error is 'email exist'
const comparatorSignupRestart: TComparatorFn = (
    triggerData: IProcessEventData, eventData: IProcessEventData,
): boolean => {
    return triggerData.eventId === eventData.eventId &&
        eventData.description === ProcessEventsDescriptions.failTrigger + 'http 400';
};
/**
 * Map of comparator functions for remote config
 */
export const comparatorMap = {
    'comparatorShowModal': comparatorShowModal,
    'comparatorModalClosed': comparatorModalClosed,
    'comparatorLoginFail': comparatorLoginFail,
    'comparatorLoginRestart': comparatorLoginRestart,
    'comparatorSignupFail': comparatorSignupFail,
    'comparatorSignupRestart': comparatorSignupRestart,
};

/**
 * Common configurations for ProcessService
 */
export const processConfigsCommon: TProcessConfigs = {
};

export const emptyLaunchedProcess: ILaunchedProcess = {
    status: undefined,
    subscriptions: {
        launch: [],
        start: [],
        fail: [],
        success: [],
        stop: [],
        restart: [],
    },
    timers: {
        launch: [],
        start: [],
        fail: [],
        success: [],
        stop: [],
        restart: [],
    },
};
