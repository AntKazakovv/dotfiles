'use strict';

import {IIndexing} from 'wlc-engine/interfaces';

import {
    assign as _assign,
} from 'lodash';

import * as commonErrors from './0.common';
import * as authErrors from './1.auth';
import * as validationErrors from './2.validation';
import * as gamesErrors from './3.games';
import * as licenseErrors from './4.license';
import * as wordpressErrors from './5.wordpress';
import * as pageNotFoundErrors from './6.page-not-found';
import * as chatErrors from './7.chat';
import * as verifyIdentityErrors from './8.verify-identity';
import * as verificationErrors from './9.verification';

type ErrorGroupType = 'Common' | 'Sign Up' | 'Bonus' | '404 not found' | 'AutoTest' | 'Load' | 'Livechat' | 'Hellosoda';
type LogMethodsType = 'Flog' | 'Sentry' | 'Both';

export interface IErrorType {
    description: string;
    name: string;
    type: string;
    method?: LogMethodsType;
    createTicket?: boolean;
    level?: string;
    project?: string;
    group?: ErrorGroupType;
    threshold?: number;
}

export interface ILogTypes extends IIndexing<IErrorType> {
}

export const errorTypes: ILogTypes = _assign(
    {},
    commonErrors,
    authErrors,
    validationErrors,
    gamesErrors,
    licenseErrors,
    wordpressErrors,
    pageNotFoundErrors,
    chatErrors,
    verifyIdentityErrors,
    verificationErrors,
);
