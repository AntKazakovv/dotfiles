import {TestBed} from '@angular/core/testing';

import {SmsService} from 'wlc-engine/modules/user/submodules/sms/system/services/sms/sms.service';
import {
    DataService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';


describe('SmsService', () => {
    let smsService: SmsService;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let dataServiceSpy: jasmine.SpyObj<DataService>;

    logServiceSpy = jasmine.createSpyObj(
        'LogService',
        ['sendLog'],
    );
    eventServiceSpy = jasmine.createSpyObj(
        'EventService',
        ['emit'],
    );
    dataServiceSpy = jasmine.createSpyObj(
        'DataService',
        ['request', 'registerMethod'],
    );

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SmsService,
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: DataService,
                    useValue: dataServiceSpy,
                },
            ],
        });

        smsService = TestBed.inject(SmsService);
    });

    it('-> Should be created', () => {
        expect(smsService).toBeTruthy();
    });

    describe('Sending code', () => {
        it('-> Request should be handled', async () => {
            const phoneCode = '7';
            const phoneNumber = '9998887766';

            const smsToken = 'sms-token';

            dataServiceSpy.request
                .and.returnValue(Promise.resolve({
                    data: {
                        token: smsToken,
                        status: true,
                    }}));

            const {status, token} = await smsService.send(phoneCode, phoneNumber);

            expect(status).toBe(true);
            expect(token).toBe(smsToken);

            const endpoint = 'sms/send';

            const body = {
                phoneCode,
                phoneNumber,
            };

            expect(dataServiceSpy.request).toHaveBeenCalledWith(endpoint, body);
        });

        describe('Exceptions handling', () => {
            it('-> Request failure should be logged', async () => {
                const error = new Error('Mock exception');

                dataServiceSpy.request.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.send('', '');

                expect(res).toBeUndefined();
                expect(logServiceSpy.sendLog).toHaveBeenCalledWith({code: '15.0.0', data: error});
            });

            it('-> Request failure should emit an event', async () => {
                const error = new Error('Mock exception');

                dataServiceSpy.request.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.send('', '');

                expect(res).toBeUndefined();
                expect(eventServiceSpy.emit).toHaveBeenCalled();
            });
        });
    });

    describe('Validating code', () => {
        it('-> Request should be handled', async () => {
            const token = 'sms-token';
            const smsCode = 'sms-code';
            const phoneCode = '7';
            const phoneNumber = '9998887766';

            dataServiceSpy.request
                .and.returnValue(Promise.resolve({
                    data: {
                        token,
                        status: true,
                    }}));

            const res = await smsService.validate(
                token,
                smsCode,
                phoneCode,
                phoneNumber,
            );

            expect(dataServiceSpy.request).toHaveBeenCalled();
            expect(res.status).toBe(true);
            expect(res.token).toBe(token);

            const endpoint = 'sms/validate';
            const body = {
                phoneCode,
                phoneNumber,
                token,
                smsCode,
            };
            expect(dataServiceSpy.request).toHaveBeenCalledWith(endpoint, body);
        });

        describe('Exceptions handling', () => {
            it('-> Request failure should be logged', async () => {
                const error = new Error('Mock exception');

                dataServiceSpy.request.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.validate('', '', '', '');

                expect(res).toBeUndefined();
                expect(logServiceSpy.sendLog).toHaveBeenCalledWith({code: '15.0.1', data: error});
            });

            it('-> Request failure should emit an event', async () => {
                const error = new Error('Mock exception');

                dataServiceSpy.request.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.validate('', '', '', '');

                expect(res).toBeUndefined();
                expect(eventServiceSpy.emit).toHaveBeenCalled();
            });
        });
    });

    describe('State', () => {
        it('-> Request should be handled', async () => {
            const token = 'sms-token';

            dataServiceSpy.request
                .and.returnValue(Promise.resolve({
                    data: {
                        state: 'state',
                        status: true,
                    }}));

            const {state, status} = await smsService.state(token);

            expect(status).toBe(true);
            expect(state).toBeDefined();
            expect(state.length).toBeGreaterThan(0);

            const endpoint = 'sms/state';
            const body = {token};

            expect(dataServiceSpy.request).toHaveBeenCalledWith(endpoint, body);
        });

        describe('Exceptions handling', () => {
            it('-> Request failure should be logged', async () => {
                const error = new Error('Mock exception');

                dataServiceSpy.request.and.callFake(() => {
                    throw error;
                });

                const res = await smsService.state('');

                expect(res).toBeUndefined();
                expect(logServiceSpy.sendLog).toHaveBeenCalledWith({code: '15.0.2', data: error});
            });
        });
    });

    describe('Checking for state', () => {
        let stateSpy: jasmine.Spy;

        beforeAll(() => {
            stateSpy = spyOn(SmsService.prototype, 'state');
        });

        describe('Request should be handled', () => {
            const statuses = ['Unknown', 'Sent', 'Failed', 'Delivered', 'Canceled'];

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
                stateSpy.and.returnValue(Promise.reject());

                const res = await smsService.checkState('');

                expect(res).toBe(false);
            });
        });
    });
});
