import {
    isPlatformBrowser,
    isPlatformServer,
} from '@angular/common';
import {
    FactoryProvider,
    InjectionToken,
    PLATFORM_ID,
} from '@angular/core';

export const WINDOW = new InjectionToken<Window | unknown>('WindowToken');

function windowFactory(platformId: Object): Window | unknown {
    // eslint-disable-next-line no-restricted-globals
    window.isPlatformBrowser = false;
    // eslint-disable-next-line no-restricted-globals
    window.isPlatformServer = false;

    if (isPlatformBrowser(platformId)) {
        // eslint-disable-next-line no-restricted-globals
        window.isPlatformBrowser = true;
        // eslint-disable-next-line no-restricted-globals
        return window;
    } else if (isPlatformServer(platformId)) {
        // eslint-disable-next-line no-restricted-globals
        window.isPlatformServer = true;
        // TODO: research this case
        //! Possible problems: non-angular modules which expect window https://github.com/angular/universal/issues/1675
        // eslint-disable-next-line no-restricted-globals
        return globalThis;
    }
    return {};
}

export const WINDOW_PROVIDER: FactoryProvider = {
    provide: WINDOW,
    useFactory: windowFactory,
    deps: [PLATFORM_ID],
};
