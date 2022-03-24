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

// Comparator function used for 'SHOW_MODAL' event (open modal based on passed id)
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

/**
 * Common configurations for ProcessService
 */
export const processConfigsCommon: TProcessConfigs = {
    loginProcess: {
        use: true,
        launchOnAppStart: true,
        launch: {
            triggers: [{name: 'LOGOUT'}],
        },
        start: {
            triggers: [
                {name: ProcessEvents.buttonPressed, data: {eventId: 'login'}},
                {name: ProcessEvents.modalOpened, data: {eventId: 'login'}},
                {name: ProcessEvents.modalOpened, data: {eventId: 'play-game-for-real'}},
                {
                    name: 'SHOW_MODAL',
                    data: {
                        eventId: 'login',
                        comparator: comparatorShowModal,
                        description: ProcessEventsDescriptions.modalOpened + 'login',
                    },
                },
            ],
            exceptionsForGroup: {
                configParams: [{param: '$user.isAuthenticated'}],
            },
        },
        fail: {
            triggers: [
                {
                    name: ProcessEvents.failTrigger,
                    data: {
                        eventId: 'login',
                        comparator: (triggerData: IProcessEventData, eventData: IProcessEventData) => {
                            return triggerData.eventId === eventData.eventId &&
                                eventData.description !== ProcessEventsDescriptions.failTrigger + '403 (/auth PUT)';
                        },
                    },
                },
                {
                    name: 'USER_INFO_ERROR',
                    data: {
                        description: ProcessEventsDescriptions.failTrigger + '/userInfo GET',
                    },
                },
                {name: ProcessEvents.beforeunload},
            ],
        },
        relaunchAfterFail: true,
        success: {
            triggers: [
                {
                    name: 'USER_INFO',
                    data: {
                        description: ProcessEventsDescriptions.successTrigger + '/userInfo GET',
                    },
                },
            ],
        },
        stop: {
            triggers: [
                {
                    name: ProcessEvents.modalClosed, data: {
                        eventId: 'login',
                        comparator: comparatorModalClosed,
                    },
                },
                {
                    name: ProcessEvents.modalClosed, data: {
                        eventId: 'play-game-for-real',
                        comparator: comparatorModalClosed,
                    },
                },
                {name: ProcessEvents.buttonPressed, data: {eventId: 'signup'}},
                {name: ProcessEvents.modalOpened, data: {eventId: 'signup'}},
                {name: ProcessEvents.modalOpened, data: {eventId: 'restore-password'}},
                {
                    name: 'SHOW_MODAL',
                    data: {
                        eventId: 'signup',
                        comparator: comparatorShowModal,
                        description: ProcessEventsDescriptions.modalOpened + 'signup',
                    },
                },
                {
                    name: 'SHOW_MODAL',
                    data: {
                        eventId: 'restore-password',
                        comparator: comparatorShowModal,
                        description: ProcessEventsDescriptions.modalOpened + 'restore-password',
                    },
                },
            ],
        },
        relaunchAfterStop: true,
        restart: {
            triggers: [
                {
                    name: ProcessEvents.failTrigger,
                    data: {
                        eventId: 'login',
                        // Wrong password error
                        comparator: (triggerData: IProcessEventData, eventData: IProcessEventData) => {
                            return triggerData.eventId === eventData.eventId &&
                                eventData.description === ProcessEventsDescriptions.failTrigger + '403 (/auth PUT)';
                        },
                    },
                },
            ],
        },
    },
    signupProcess: {
        use: true,
        launchOnAppStart: true,
        launch: {
            triggers: [{name: 'LOGOUT'}],
        },
        start: {
            triggers: [
                {name: ProcessEvents.buttonPressed, data: {eventId: 'signup'}},
                {name: ProcessEvents.modalOpened, data: {eventId: 'signup'}},
                {
                    name: 'SHOW_MODAL',
                    data: {
                        eventId: 'signup',
                        comparator: comparatorShowModal,
                        description: ProcessEventsDescriptions.modalOpened + 'signup',
                    },
                },
            ],
            exceptionsForGroup: {
                configParams: [{param: '$user.isAuthenticated'}],
            },
        },
        fail: {
            triggers: [
                {name: ProcessEvents.modalOpened, data: {eventId: 'registration-errors'}},
                {
                    name: ProcessEvents.failTrigger,
                    data: {
                        eventId: 'signup',
                        comparator: (triggerData: IProcessEventData, eventData: IProcessEventData) => {
                            return triggerData.eventId === eventData.eventId &&
                                eventData.description !== ProcessEventsDescriptions.failTrigger + 'http 400';
                        },
                    },
                },
                {name: ProcessEvents.beforeunload},
            ],
        },
        relaunchAfterFail: true,
        success: {
            triggers: [
                {name: ProcessEvents.successTrigger, data: {eventId: 'signup'}},
            ],
        },
        stop: {
            triggers: [
                {
                    name: ProcessEvents.modalClosed, data: {
                        eventId: 'signup',
                        comparator: comparatorModalClosed,
                    },
                },
                {name: ProcessEvents.buttonPressed, data: {eventId: 'login'}},
                {name: ProcessEvents.modalOpened, data: {eventId: 'login'}},
                {
                    name: 'SHOW_MODAL',
                    data: {
                        eventId: 'login',
                        comparator: comparatorShowModal,
                        description: ProcessEventsDescriptions.modalOpened + 'login',
                    },
                },
            ],
        },
        relaunchAfterStop: true,
        restart: {
            triggers: [
                {
                    name: ProcessEvents.failTrigger,
                    data: {
                        eventId: 'signup',
                        // Email exists error
                        comparator: (triggerData: IProcessEventData, eventData: IProcessEventData) => {
                            return triggerData.eventId === eventData.eventId &&
                                eventData.description === ProcessEventsDescriptions.failTrigger + 'http 400';
                        },
                    },
                },
            ],
        },
    },
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
