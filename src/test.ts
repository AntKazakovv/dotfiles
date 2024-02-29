// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import {getTestBed} from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';

import {AppModule} from 'wlc-engine/modules/app/app.module';

declare namespace globalThis {
    let WLC_VERSION: number;
}

@NgModule({
    providers: [
        AppModule,
        {
            provide: APP_BASE_HREF,
            useValue: '/',
        },
    ],
})
export class CustomTestModule {}

// Init uniq value
globalThis.WLC_VERSION = new Date().getTime();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    [
        BrowserDynamicTestingModule,
        CustomTestModule,
    ],
    platformBrowserDynamicTesting(),
    {
        teardown: {
            destroyAfterEach: false,
        },
        errorOnUnknownElements: true,
        errorOnUnknownProperties: true,
    },
);
