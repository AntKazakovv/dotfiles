import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {NgxWebstorageModule} from 'ngx-webstorage';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {SmsService} from 'wlc-engine/modules/user/system/services/sms/sms.service';
import {
    DataService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system/tokens/window';


describe('SmsService', () => {
    let smsService: SmsService;

    let sendLogSpy: jasmine.Spy;
    let emitEventSpy: jasmine.Spy;
    let requestSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                TranslateModule.forRoot(),
                UIRouterModule.forRoot(),
                NgxWebstorageModule.forRoot(),
                HttpClientTestingModule,
            ],
            providers: [
                WINDOW_PROVIDER,
                SmsService,
                LogService,
                EventService,
                DataService,
            ],
        });

        smsService = TestBed.inject(SmsService);
        sendLogSpy = spyOn(TestBed.inject(LogService), 'sendLog');
        emitEventSpy = spyOn(TestBed.inject(EventService), 'emit');
        requestSpy = spyOn(TestBed.inject(DataService), 'request');
    });

    it('-> Should be created', () => {
        expect(smsService).toBeTruthy();
    });

    describe('Sending code', () => {
        it('-> Request should be handled', async () => {
            const phoneCode = '7';
            const phoneNumber = '9998887766';

            const smsToken = 'sms-token';

            requestSpy.and.returnValue({
                data: {
                    token: smsToken,
                    status: true,
                }});

            const {status, token} = await smsService.send(phoneCode, phoneNumber);

            expect(status).toBe(true);
            expect(token).toBe(smsToken);

            const endpoint = 'sms/send';

            const body = {
                phoneCode,
                phoneNumber,
            };

            expect(requestSpy).toHaveBeenCalledWith(endpoint, body);
        });

        describe('Exceptions handling', () => {
            it('-> Request failure should be logged', async () => {
                const error = new Error('Mock exception');

                requestSpy.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.send('', '');

                expect(res).toBeUndefined();
                expect(sendLogSpy).toHaveBeenCalledWith({code: '15.0.0', data: error});
            });

            it('-> Request failure should emit an event', async () => {
                const res = await smsService.send('', '');

                expect(res).toBeUndefined();
                expect(emitEventSpy).toHaveBeenCalled();
            });
        });
    });

    describe('Validating code', () => {
        it('-> Request should be handled', async () => {
            const token = 'sms-token';
            const smsCode = 'sms-code';
            const phoneCode = '7';
            const phoneNumber = '9998887766';

            requestSpy.and.returnValue({
                data: {
                    token,
                    status: true,
                }});

            const res = await smsService.validate(
                token,
                smsCode,
                phoneCode,
                phoneNumber,
            );

            expect(requestSpy).toHaveBeenCalled();
            expect(res.status).toBe(true);
            expect(res.token).toBe(token);

            const endpoint = 'sms/validate';
            const body = {
                phoneCode,
                phoneNumber,
                token,
                smsCode,
            };
            expect(requestSpy).toHaveBeenCalledWith(endpoint, body);
        });

        describe('Exceptions handling', () => {
            it('-> Request failure should be logged', async () => {
                const error = new Error('Mock exception');

                requestSpy.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.validate('', '', '', '');

                expect(res).toBeUndefined();
                expect(sendLogSpy).toHaveBeenCalledWith({code: '15.0.1', data: error});
            });

            it('-> Request failure should emit an event', async () => {
                const res = await smsService.validate('', '', '', '');

                expect(res).toBeUndefined();
                expect(emitEventSpy).toHaveBeenCalled();
            });
        });
    });

    describe('State', () => {
        it('-> Request should be handled', async () => {
            const token = 'sms-token';

            requestSpy.and.returnValue({
                data: {
                    state: 'state',
                    status: true,
                }});

            const {state, status} = await smsService.state(token);

            expect(status).toBe(true);
            expect(state).toBeDefined();
            expect(state.length).toBeGreaterThan(0);

            const endpoint = 'sms/state';
            const body = {token};

            expect(requestSpy).toHaveBeenCalledWith(endpoint, body);
        });

        describe('Exceptions handling', () => {
            it('-> Request failure should be logged', async () => {
                const error = new Error('Mock exception');

                requestSpy.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.state('');

                expect(res).toBeUndefined();
                expect(sendLogSpy).toHaveBeenCalledWith({code: '15.0.2', data: error});
            });
        });
    });

    describe('Checking for state', () => {
        describe('Request should be handled', () => {
            const statuses = ['Unknown', 'Sent', 'Failed', 'Delivered', 'Canceled'];

            let stateSpy: jasmine.Spy;

            beforeAll(() => {
                stateSpy = spyOn(SmsService.prototype, 'state');
            });

            it('-> Should return true if state matches to any status', async () => {
                const token = 'sms-token';

                for (const state of statuses) {
                    stateSpy.and.returnValue(Promise.resolve({state}));

                    const res = await smsService.checkState(token);

                    expect(stateSpy).toHaveBeenCalledWith(token);
                    expect(res).toBe(true);
                }
            });

            it('-> Should return false if state does not match to any status', async () => {
                const token = 'sms-token';
                const state = 'no-existing-state';

                stateSpy.and.callFake(() => Promise.resolve({state}));
                smsService['checkStateCounter'] = 3;

                const res = await smsService.checkState(token);

                expect(stateSpy).toHaveBeenCalledWith(token);
                expect(res).toBe(false);
            });

            it('-> Should recall itself if state counter in range 0..2', async () => {
                const token = 'sms-token';
                const state = 'no-existing-state';

                smsService['checkStateCounter'] = 3;

                stateSpy.and.returnValue(Promise.resolve({state}));

                await smsService.checkState(token);

                expect(stateSpy).toHaveBeenCalledWith(token);
            });
        });

        describe('Exceptions handling', () => {
            it('-> Request failure returns false', async () => {
                const res = await smsService.checkState('');

                expect(res).toBe(false);
            });
        });
    });
});
