import {
    discardPeriodicTasks,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import {HttpHeaders} from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import {TranslateService} from '@ngx-translate/core';

import {
    datatype,
    internet,
    random,
} from 'faker';
import {isObservable} from 'rxjs';
import _each from 'lodash-es/each';
import _values from 'lodash-es/values';
import _merge from 'lodash-es/merge';

import {
    DataService,
    IRequestMethod,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';

describe('DataService', () => {
    let dataService: DataService;
    let httpTestingController: HttpTestingController;
    let eventServiceSpy = jasmine.createSpyObj('EventService', ['emit']);
    let logServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);
    let cachingServiceSpy = jasmine.createSpyObj('CachingService', ['get', 'set']);
    let configServiceSpy = jasmine.createSpyObj('ConfigService', ['get', 'set']);
    let translateServiceSpy = jasmine.createSpyObj('TranslateService', [], {
        currentLang: 'en',
    });
    let hookServiceSpy: jasmine.SpyObj<HooksService> = jasmine.createSpyObj('hookService', ['run']);

    beforeEach(() => {
        hookServiceSpy.run.and.callFake((name: string, data: any) => {
            return data;
        });

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                WINDOW_PROVIDER,
                DataService,
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
                {
                    provide: CachingService,
                    useValue: cachingServiceSpy,
                },
                {
                    provide: TranslateService,
                    useValue: translateServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: HooksService,
                    useValue: hookServiceSpy,
                },
            ],
        });

        dataService = TestBed.inject(DataService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('-> should be created', () => {
        expect(dataService).toBeTruthy();
    });

    it('-> check registration of requests, registration of duplicates', () => {
        const verified: string[] = [];
        const methods: IRequestMethod[] = [
            {
                name: 'test',
                system: 'test',
                type: 'GET',
                url: '/test',
            },
            {
                name: 'test',
                system: 'test',
                type: 'GET',
                url: '/test',
            },
            {
                name: 'test',
                system: 'test',
                type: 'POST',
                url: '/test',
            },
            {
                name: 'test1',
                system: 'test',
                type: 'GET',
                url: '/test',
            },
            {
                name: 'test',
                system: 'test1',
                type: 'GET',
                url: '/test',
            },
        ];

        _each(methods, (method: IRequestMethod): void => {
            const registrationResult = dataService.registerMethod(method);
            const methodName = `${method.system}/${method.name}`;

            if (!verified.includes(methodName)) {
                verified.push(methodName);
                expect(dataService['apiList'][methodName]).toEqual(jasmine.objectContaining(method));
                expect(registrationResult).toBeTrue();
            } else {
                expect(registrationResult).toBeFalse();
            }
        });

        expect(_values(dataService['apiList']).length).toEqual(3);
    });

    it('-> checking the execution of requests', fakeAsync(() => {
        const urlsList: string[] = [];

        for (let i = 0; i <= 30; i++) {
            const request: IRequestMethod = {
                name: random.word(),
                system: random.word(),
                type: internet.httpMethod(),
                noUseLang: datatype.boolean(),
            };

            if (datatype.boolean()) {
                request.url = `/${random.word()}`;
            } else {
                request.fullUrl = internet.url();
            }

            if (urlsList.includes(request.url)) {
                continue;
            }

            if (request.url) {
                urlsList.push(request.url);
            }

            dataService.request(request);
            tick();
            const mockReq = httpTestingController.expectOne((request.url
                ? `/api/v1${request.url}`
                : `${request.fullUrl}`)
                + (request.noUseLang ? '' : '?lang=en'),
            );
            expect(mockReq.request).toBeTruthy();
            expect(mockReq.request.method).toEqual(request.type);
            expect(mockReq.request.responseType).toEqual('json');
        }
    }));

    it('-> checking the execution of recurring queries', fakeAsync(() => {
        registerTestMethod({
            fullUrl: 'http://test.test/',
            period: 100,
        });

        const subscription1 = dataService.subscribe('test/test', () => {});
        tick(1000);
        subscription1.unsubscribe();
        expect(httpTestingController.match('http://test.test/').length).toEqual(10);

        const subscription2 = dataService.subscribe('test/test', () => {});
        const subscription3 = dataService.subscribe('test/test', () => {});
        tick(1000);
        subscription2.unsubscribe();
        subscription3.unsubscribe();
        expect(httpTestingController.match('http://test.test/').length).toEqual(10);

        discardPeriodicTasks();
    }));

    it('-> check query execution with caching', fakeAsync(() => {
        registerTestMethod({
            cache: 100,
            url: '/test',
            noUseLang: false,
        });

        cachingServiceSpy.get.withArgs('/api/v1/test|en').and.resolveTo();
        dataService.request('test/test');
        tick();
        httpTestingController.expectOne('/api/v1/test?lang=en').flush({});
        expect(cachingServiceSpy.set.calls.mostRecent().args).toEqual(['/api/v1/test|en', {}, false, 100]);

        cachingServiceSpy.get.withArgs('/api/v1/test|en').and.resolveTo({});
        dataService.request('test/test');
        tick();
        httpTestingController.expectNone('/api/v1/test?lang=en');

        cachingServiceSpy.get.withArgs('/api/v1/test|en').and.resolveTo();
        dataService.request('test/test');
        tick();
        httpTestingController.expectOne('/api/v1/test?lang=en');
    }));

    it('-> check query execution with retry and fallback url', fakeAsync(() => {
        const fallbackUrl = internet.url();

        dataService.request({
            name: 'test',
            system: 'test',
            type: 'GET',
            url: '/test',
            noUseLang: true,
            retries: {
                count: [500, 500, 1000],
                fallbackUrl,
            },
        });
        tick();

        for (let i = 0; i <= 5; i++) {
            if (i === 3) {
                httpTestingController.expectNone('/api/v1/test');
            } else if (i === 5) {
                httpTestingController.expectOne(fallbackUrl);
            } else {
                httpTestingController
                    .expectOne('/api/v1/test')
                    .error(new ErrorEvent('error!'), {status: 500});
            }

            tick(500);
        }
    }));

    it('-> checking sending success and fail events', fakeAsync(() => {
        registerTestMethod({
            name: 'test123',
            system: 'test123',
            fullUrl: 'http://test.test/',
            retries: {
                count: [],
            },
            events: {
                success: 'SUCCESS_TEST_EVENT',
                fail: 'FAIL_TEST_EVENT',
            },
        });

        dataService.request('test123/test123');
        tick();

        httpTestingController.expectOne('http://test.test/').flush({});
        tick();

        expect(eventServiceSpy.emit).toHaveBeenCalledWith({
            name: 'SUCCESS_TEST_EVENT',
            data: {
                status: 'success',
                name: 'test123',
                system: 'test123',
                headers: new HttpHeaders(),
                data: {},
            },
        });

        expect(eventServiceSpy.emit).toHaveBeenCalledTimes(1);

        dataService.request('test123/test123').catch(() => null);
        tick();
        httpTestingController
            .expectOne('http://test.test/')
            .error(new ProgressEvent('error!'), {status: 404});


        expect(eventServiceSpy.emit).toHaveBeenCalledWith({
            name: 'FAIL_TEST_EVENT',
            data: new ProgressEvent('error!'),
        });
        expect(eventServiceSpy.emit).toHaveBeenCalledTimes(2);
    }));

    it('-> getMethodSubscribe: checking the receipt of a subscription', () => {
        registerTestMethod({
            fullUrl: 'http://test.test/',
        });

        expect(isObservable(dataService.getMethodSubscribe('test/test'))).toBeTrue();
        expect(isObservable(dataService.getMethodSubscribe('test1/test1'))).toBeFalse();
    });

    it('-> reset: method check', fakeAsync(() => {
        let i = 0;
        registerTestMethod({
            fullUrl: 'http://test.test/',
        });

        dataService.subscribe('test/test', {
            next: (data: any) => {
                if (i == 1) {
                    expect(data).toBeTruthy();
                } else {
                    expect(data).toBeNull();
                }
                i++;
            },
        });

        dataService.request('test/test');
        tick();
        httpTestingController.expectOne('http://test.test/').flush({});
        dataService.reset('test/test');
        tick();
        expect(i).toEqual(3);
    }));

    const registerTestMethod = (params: Partial<IRequestMethod> = {}): void => {
        dataService.registerMethod(_merge({
            name: 'test',
            system: 'test',
            type: 'GET',
            noUseLang: true,
        }, params));
    };
});
