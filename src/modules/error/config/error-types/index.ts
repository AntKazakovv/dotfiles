'use strict';

import {
    assign as _assign,
} from 'lodash';

import * as group0 from './0.common';
import * as group1 from './1.auth';
import * as group2 from './2.validation';
import * as group3 from './3.games';
import * as group4 from './4.license';
import * as group5 from './5.wordpress';
import * as group6 from './6.page-not-found';
import * as group7 from './7.chat';
import * as group8 from './8.verify-identity';
import * as group9 from './9.verification';

type ErrorGroup = 'Common' | 'Sign Up' | 'Bonus' | '404 not found' | 'AutoTest' | 'Load' | 'Livechat' | 'Hellosoda';
type LogMethods = 'Flog' | 'Sentry' | 'Both';

export interface IErrorType {
    description: string;
    name: string;
    type: string;
    method?: LogMethods;
    createTicket?: boolean;
    level?: string;
    project?: string;
    group?: ErrorGroup;
    threshold?: number;
}

export interface IErrorTypes {
    [key: string]: IErrorType;
}

export const errorTypes = _assign(
    {},
    group0,
    group1,
    group2,
    group3,
    group4,
    group5,
    group6,
    group7,
    group8,
    group9,
);
