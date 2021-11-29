import {DOCUMENT} from '@angular/common';
import {
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import {UIRouter} from '@uirouter/core';

import * as logTypes from 'wlc-engine/shared-lib/log-types';
import {
    IFlogData,
    WlcFlog,
} from 'wlc-engine/system/inline/_flog';
import {
    ConfigService,
    IDurationWaiter,
    ILogObj,
    IWaitElementParams,
    LogService,
    TWaiter,
} from 'wlc-engine/modules/core';
import {
    WINDOW,
    WINDOW_PROVIDER,
} from 'wlc-engine/modules/app/system';

const logTypesMock: logTypes.ILogTypes = {
    '9.9.1': {},
    '9.9.1_1': {},
    '9.9.2': {
        method: ['flog'],
    },
    '9.9.3': {
        method: ['console'],
    },
    '9.9.4': {
        method: ['all'],
    },
    '9.9.5': {
        level: 'error',
    },
    '9.9.6': {
        level: 'fatal',
    },
};

class RouterMock {
    private onStartCb: Function;
    public transitionService = {
        onStart: (param: any, cb: Function) => {
            this.onStartCb = cb;
            return () => {
                this.onStartCb = null;
            };
        },
    };
    public stateService = {
        go: () => this.onStartCb && this.onStartCb(),
    };
}

class DocumentMock {
    private _cookie: string = '';
    public get cookie(): string {
        return this._cookie;
    };
    public set cookie(v : string) {
        this._cookie += v;
    };
    public querySelector(): any {};
}

const WlcFlogStub: Partial<WlcFlog> = {
    get enabled(): boolean {
        return true; 
    },
    send: () => {
        return Promise.resolve('');
    },
};

describe('LogService', () => {
    const configServiceSpy: ConfigService = jasmine.createSpyObj('ConfigService', ['get']);

    let logService: LogService;
    let routerMock: RouterMock;
    let documentMock: DocumentMock;
    let wlcFlogSendSpy: jasmine.Spy<(data: IFlogData) => Promise<string>>;
    let sendLogSpy: jasmine.Spy<(logObj: ILogObj) => void>;
    let window: Window;
    
    beforeEach(() => {
        spyOnProperty(logTypes, 'logTypes').and.returnValue(logTypesMock);
        wlcFlogSendSpy = spyOn(WlcFlogStub, 'send').and.returnValue(Promise.resolve(''));

        routerMock = new RouterMock();
        documentMock = new DocumentMock();

        TestBed.configureTestingModule({
            
            providers: [
                LogService,
                {provide: ConfigService, useValue: configServiceSpy},
                {provide: UIRouter, useValue: routerMock},
                {provide: DOCUMENT, useValue: documentMock},
                WINDOW_PROVIDER,
            ],
        });
        window = TestBed.inject<Window>(WINDOW);
        window.WlcFlog = WlcFlogStub;
        window.WLC_ENV = undefined;
        logService = TestBed.inject(LogService);
        sendLogSpy = spyOn(logService, 'sendLog').and.callThrough();
    });

    it('-> should be created', () => {
        expect(logService).toBeTruthy();
    });

    describe('-> durationWaiter()', () => {
        const timeout = 1;
        const createDW = (t = timeout): IDurationWaiter => {
            return logService.durationWaiter({
                code: '9.9.1',
            }, t);
        };

        it('-> should sendLog with data.duration if resolved (before timeout)', fakeAsync(() => {
            const dw: IDurationWaiter = createDW();
            dw.resolve();
            tick();
            expect(sendLogSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining(<ILogObj>{
                data: {
                    duration: jasmine.any(Number),
                },
            }));
        }));

        it('-> should NOT sendLog if cancelled (even after timeout)', fakeAsync(() => {
            const dw: IDurationWaiter = createDW();
            dw.cancel();
            tick(timeout * 1000);
            expect(sendLogSpy).not.toHaveBeenCalled();
        }));

        it('-> should sendLog if page closed (before timeout)', fakeAsync(() => {
            createDW();
            window.dispatchEvent(new Event('onbeforeunload'));
            tick();
            expect(sendLogSpy).toHaveBeenCalledTimes(1);
        }));

        it('-> should sendLog if page hided (before timeout)', fakeAsync(() => {
            createDW();
            window.dispatchEvent(new Event('pagehide'));
            tick();
            expect(sendLogSpy).toHaveBeenCalledTimes(1);
        }));
    });
    
    describe('-> waiter()', () => {
        const timeout = 1;
        const createW = (t = timeout): TWaiter => {
            return logService.waiter({
                code: '9.9.1',
            }, t);
        };

        it('-> should sendLog after timeout', fakeAsync(() => {
            createW();
            expect(sendLogSpy).not.toHaveBeenCalled();
            tick(timeout);
            expect(sendLogSpy).toHaveBeenCalledTimes(1);
        }));

        it('-> should NOT sendLog if timeout cleared', fakeAsync(() => {
            const waiter: TWaiter = createW();
            waiter();
            tick(timeout);
            expect(sendLogSpy).not.toHaveBeenCalled();
        }));
    });

    describe('-> waitForElement()', () => {
        const timeout = 1;
        const waiterParams: IWaitElementParams = {
            logObj: {code: '9.9.1'},
            selector: 'selector',
            timeout,
            minHeight: 10,
        };

        it('-> should sendLog if no element founded', fakeAsync(() => {
            logService.waitForElement(waiterParams);
            spyOn(documentMock, 'querySelector').and.returnValue(undefined);
            tick(timeout);
            expect(sendLogSpy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({code: '9.9.1'}),
            );
        }));

        it('-> should sendLog if element founded but has bad height', fakeAsync(() => {
            const mockElWithWrongHeight: Partial<Element> = {
                getBoundingClientRect: () => <DOMRect>{
                    height: 5,
                },
            };
            logService.waitForElement(waiterParams);
            spyOn(documentMock, 'querySelector').and.returnValue(mockElWithWrongHeight);
            tick(timeout);
            expect(sendLogSpy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({code: '9.9.1'}),
            );
        }));

        it('-> should NOT sendLog if element founded', fakeAsync(() => {
            const mockElWithGoodHeight: Partial<Element> = {
                getBoundingClientRect: () => <DOMRect>{
                    height: 20,
                },
            };
            logService.waitForElement(waiterParams);
            spyOn(documentMock, 'querySelector').and.returnValue(mockElWithGoodHeight);
            tick(timeout);
            expect(sendLogSpy).not.toHaveBeenCalled();
        }));

        it('-> should NOT sendLog if cancelled', fakeAsync(() => {
            const waiter: ReturnType<typeof logService.waitForElement> = logService.waitForElement(waiterParams);
            spyOn(documentMock, 'querySelector').and.returnValue(undefined);
            waiter();
            tick(timeout);
            expect(sendLogSpy).not.toHaveBeenCalled();
        }));

        it('-> should NOT sendLog if page closed', fakeAsync(() => {
            logService.waitForElement(waiterParams);
            spyOn(documentMock, 'querySelector').and.returnValue(undefined);
            window.dispatchEvent(new Event('onbeforeunload'));
            tick(timeout);
            expect(sendLogSpy).not.toHaveBeenCalled();
        }));

        it('-> should NOT sendLog if page leaved', fakeAsync(() => {
            logService.waitForElement(waiterParams);
            spyOn(documentMock, 'querySelector').and.returnValue(undefined);
            routerMock.stateService.go();
            tick(timeout);
            expect(sendLogSpy).not.toHaveBeenCalled();
        }));
    });

    describe('-> sendLog()', () => {
        it('-> should do nothing if no code in error config', () => {
            logService.sendLog({
                code: null,
            });
            expect(wlcFlogSendSpy).not.toHaveBeenCalled();
        });

        it('-> should send flog if no method in error config', () => {
            const log: ILogObj = {
                code: '9.9.1',
            };
            logService.sendLog(log);
            expect(wlcFlogSendSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining(log));
        });

        it('-> should send flog if "flog" in error config', () => {
            logService.sendLog({
                code: '9.9.2',
            });
            expect(wlcFlogSendSpy).toHaveBeenCalledTimes(1);
        });

        it('-> should console.log if "console" in error config', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.3',
            });
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });

        it('-> should use all methods if "all" in error config', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.4',
            });
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(wlcFlogSendSpy).toHaveBeenCalledTimes(1);
        });

        it('-> should console.log if level "error" in error config on dev/test', () => {
            window.WLC_ENV = 'dev';
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.5',
            });
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });

        it('-> should NOT console.log if level "error" in error config on prod', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.5',
            });
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('-> should console.log if level "error" in error config on prod with cookies "flog="', () => {
            documentMock.cookie = 'flog=';
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.5',
            });
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });

        it('-> should console.log if level "fatal" in error config on dev/test', () => {
            window.WLC_ENV = 'dev';
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.6',
            });
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });

        it('-> should NOT console.log if level "fatal" in error config on prod', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.6',
            });
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('-> should console.log if level "fatal" in error config on prod with cookies "flog="', () => {
            documentMock.cookie = 'flog=';
            const consoleErrorSpy = spyOn(console, 'error');
            logService.sendLog({
                code: '9.9.6',
            });
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('-> sendRequestLog()', () => {
        const log = {
            coreLog: {code: '9.9.1'},
            networkLog: {code: '9.9.1_1'},
            from: {
                service: 'UserService',
                method: 'login',
            },
        };
        it('-> should send coreLog if error', () => {
            logService.sendRequestLog({
                ...log,
                responseData: {
                    status: 'error',
                    errors: 'error msg',
                },
            });
            expect(sendLogSpy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({
                    code: '9.9.1',
                    flog: {
                        message: 'error msg',
                    },
                }));
        });

        it('-> should send networkLog if success', () => {
            logService.sendRequestLog({
                ...log,
                responseData: {
                    status: 'ok',
                },
            });
            expect(sendLogSpy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({code: '9.9.1_1'}),
            );
        });
    });
});
