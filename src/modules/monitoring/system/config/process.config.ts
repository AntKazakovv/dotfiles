import {
    ILaunchedProcess,
    IProcessEventData,
    TProcessConfigs,
} from 'wlc-engine/modules/monitoring/system/interfaces/process.interface';

export enum ProcessServiceEvents {
    launchTrigger = 'launchTrigger',
    startTrigger = 'startTrigger',
    successTrigger = 'successTrigger',
    failTrigger = 'failTrigger',
    stopTrigger = 'stopTrigger',
    modalOpen = 'modalOpened',
    modalClose = 'modalClosed',
    modalCloseAll = 'modalClosedAll',
    buttonPress = 'buttonPressed',
    beforeunload = 'beforeunload',
}

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
                {name: ProcessServiceEvents.modalOpen, data: {eventId: 'login'}},
                {name: ProcessServiceEvents.modalOpen, data: {eventId: 'play-game-for-real'}},
            ],
            exceptionsForGroup: {
                configParams: [{param: '$user.isAuthenticated'}],
            },
        },
        fail: {
            triggers: [
                {name: ProcessServiceEvents.failTrigger, data: {eventId: 'login'}},
                {name: 'USER_INFO_ERROR'},
                {name: ProcessServiceEvents.beforeunload},
            ],
        },
        restartAfterFail: true,
        failAfterTimer: 60000,
        success: {
            triggers: [{name: 'USER_INFO'}],
        },
        stop: {
            triggers: [
                {name: ProcessServiceEvents.modalClose, data: {
                    eventId: 'login',
                    comparator: (triggerData: IProcessEventData, eventData: IProcessEventData) => {
                        return triggerData.eventId === eventData.eventId &&
                            eventData.description !== 'Close reason: submit';
                    },
                }},
                {name: ProcessServiceEvents.modalClose, data: {
                    eventId: 'play-game-for-real',
                    comparator: (triggerData: IProcessEventData, eventData: IProcessEventData) => {
                        return triggerData.eventId === eventData.eventId &&
                            eventData.description !== 'Close reason: submit';
                    },
                }},
                {
                    name: ProcessServiceEvents.modalOpen,
                    data: {
                        eventId: 'signup',
                        description: 'Modal close reason: signup modal',
                    },
                },
                {
                    name: ProcessServiceEvents.modalOpen,
                    data: {
                        eventId: 'restore-password',
                        description: 'Modal close reason: restore-password modal',
                    },
                },
            ],
        },
        restartAfterStop: true,
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
    },
    timers: {
        launch: [],
        start: [],
        fail: [],
        success: [],
        stop: [],
    },
};
