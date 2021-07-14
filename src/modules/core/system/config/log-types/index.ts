'use strict';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import _assign from 'lodash-es/assign';

import {errorTypes as commonLogs} from './0.common';
import {errorTypes as authLogs} from './1.auth';
import {errorTypes as validationLogs} from './2.validation';
import {errorTypes as gamesLogs} from './3.games';
import {errorTypes as licenseLogs} from './4.license';
import {errorTypes as wordpressLogs} from './5.wordpress';
import {errorTypes as pageNotFoundLogs} from './6.page-not-found';
import {errorTypes as dataLogs} from './7.data';
import {errorTypes as verifyIdentityLogs} from './8.verify-identity';
import {errorTypes as verificationLogs} from './9.verification';
import {errorTypes as bonusesLogs} from './10.bonuses';
import {errorTypes as storeLogs} from './11.store';
import {errorTypes as postsLogs} from './12.posts';
import {errorTypes as tournamentsLogs} from './13.tournaments';
import {errorTypes as livechatLogs} from './14.livechat';
import {errorTypes as smsLogs} from './15.sms';

export type TLogMethods = 'flog' | 'console' | 'all'; // flog - as default
type TLogDuration = 'fromStart';
type TLogLevel = 'log' | 'error' | 'warning' | 'fatal' | 'info';

export interface ILogType {
    method?: TLogMethods[];
    level?: TLogLevel;
    threshold?: number;
    durationType?: TLogDuration;
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
    dataLogs,
    verifyIdentityLogs,
    verificationLogs,
    bonusesLogs,
    storeLogs,
    postsLogs,
    tournamentsLogs,
    livechatLogs,
    smsLogs,
);
