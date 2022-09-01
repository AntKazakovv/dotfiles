import {
    discardPeriodicTasks,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
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

import {
    DataService,
    IRequestMethod,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';

import _each from 'lodash-es/each';
import _values from 'lodash-es/values';
import _merge from 'lodash-es/merge';

describe('DataService', () => {
    let dataService: DataService;
    let eventService: EventService;
    let httpTestingController: HttpTestingController;
    let logServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);
    let cachingServiceSpy = jasmine.createSpyObj('CachingService', ['get', 'set']);
    let configServiceSpy = jasmine.createSpyObj('CachingService', ['get', 'set']);
    let translateServiceSpy = jasmine.createSpyObj('TranslateService', [], {
        currentLang: 'en',
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                WINDOW_PROVIDER,
                DataService,
                EventService,
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
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
            ],
        });
        dataService = TestBed.inject(DataService);
        eventService = TestBed.inject(EventService);
        configServiceSpy = TestBed.inject(ConfigService);
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

    it('-> checking the execution of requests', () => {
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

            dataService.request(request);
            const mockReq = httpTestingController.expectOne((request.url
                ? `/api/v1${request.url}`
                : `${request.fullUrl}`)
                + (request.noUseLang ? '' : '?lang=en'),
            );
            expect(mockReq.request).toBeTruthy();
            expect(mockReq.request.method).toEqual(request.type);
            expect(mockReq.request.responseType).toEqual('json');
        }
    });

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

    it('-> checking sending success and fail events', () => {
        let successEvent = 0;
        let failEvent = 0;

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

        eventService.filter({name: 'SUCCESS_TEST_EVENT'}).subscribe({
            next: () => successEvent++,
        });

        eventService.filter({name: 'FAIL_TEST_EVENT'}).subscribe({
            next: () => failEvent++,
        });

        dataService.request('test123/test123');
        httpTestingController.expectOne('http://test.test/').flush({});

        dataService.request('test123/test123');
        httpTestingController.expectOne('http://test.test/').flush({});

        dataService.request('test123/test123').catch(() => null);
        httpTestingController
            .expectOne('http://test.test/')
            .error(new ErrorEvent('error!'), {status: 404});

        expect(successEvent).toEqual(2);
        expect(failEvent).toEqual(1);
    });

    it('-> getMethodSubscribe: checking the receipt of a subscription',  () => {
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
