// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
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

declare const require: {
    context(path: string, deep?: boolean, filter?: RegExp): {
        keys(): string[];
        <T>(id: string): T;
    };
};

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
    },
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().forEach(context);

// fix in angular 14
console.error = (data: unknown) => fail(data);
