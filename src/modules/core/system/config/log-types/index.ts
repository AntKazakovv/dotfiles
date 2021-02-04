'use strict';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import {
    assign as _assign,
} from 'lodash-es';

import * as commonLogs from './0.common';
import * as authLogs from './1.auth';
import * as validationLogs from './2.validation';
import * as gamesLogs from './3.games';
import * as licenseLogs from './4.license';
import * as wordpressLogs from './5.wordpress';
import * as pageNotFoundLogs from './6.page-not-found';
import * as chatLogs from './7.chat';
import * as verifyIdentityLogs from './8.verify-identity';
import * as verificationLogs from './9.verification';
import * as bonusesLogs from './10.bonuses';
import * as storeLogs from './11.store';

type LogGroupType = 'Common' | 'Sign Up' | 'Bonus' | '404 not found' | 'AutoTest' | 'Load' | 'Livechat' | 'Hellosoda';
type LogMethodsType = 'Flog' | 'Sentry' | 'Both';

export interface ILogType {
    description: string;
    name: string;
    type: string;
    method?: LogMethodsType;
    createTicket?: boolean;
    level?: string;
    project?: string;
    group?: LogGroupType;
    threshold?: number;
}

export interface ILogTypes extends IIndexing<ILogType> {
}

export const logTypes: ILogTypes = _assign(
    {},
    commonLogs,
    authLogs,
    validationLogs,
    gamesLogs,
    licenseLogs,
    wordpressLogs,
    pageNotFoundLogs,
    chatLogs,
    verifyIdentityLogs,
    verificationLogs,
    bonusesLogs,
    storeLogs,
);
