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
import {errorTypes as loyaltyLogs} from './16.loyalty';
import {errorTypes as financesLogs} from './17.finances';
import {errorTypes as processLogs} from './18.process';
import {errorTypes as internalMailsLogs} from './19.internal-mails';
import {errorTypes as bannersLogs} from './20.banners';
import {errorTypes as merchantWalletLogs} from './21.merchant-wallet';

export const defaultLogMethods: TLogMethods[] = ['flog'];
export const defaultLogLevel: TLogLevel = 'log';
export const defaultConsoleLogLevels: TLogLevel[] = ['error', 'fatal'];
export const consoleLogProdCookie: string = 'flog=';

interface IIndexing<T> {
    [key: string]: T;
}

export type TLogMethods = 'flog' | 'console' | 'all';
type TLogDuration = 'fromStart';
type TLogLevel = 'log' | 'error' | 'warning' | 'fatal' | 'info';

export interface ILogType {
    method?: TLogMethods[];
    level?: TLogLevel;
    threshold?: number;
    durationType?: TLogDuration;
}

interface IFromLog {
    service?: string;
    method?: string;
    model?: string;
    parentModel?: string;
    helper?: string;
    component?: string;
    pipe?: string;
    directive?: string;
}

export interface ILogObj<T = any> extends ILogType {
    code: string;
    data?: T;
    flog?: IIndexing<string | number | boolean>;
    from?: IFromLog;
}

export interface ILogTypes extends IIndexing<ILogType> {
}

export const logTypes: ILogTypes = Object.assign(
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
    loyaltyLogs,
    financesLogs,
    processLogs,
    internalMailsLogs,
    bannersLogs,
    merchantWalletLogs,
);
