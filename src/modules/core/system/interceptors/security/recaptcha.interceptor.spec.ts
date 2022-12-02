import {
    HttpClient,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import {
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import {RecaptchaInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/recaptcha.interceptors';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {RecaptchaService} from 'wlc-engine/modules/security/recaptcha';

describe('RecaptchaInterceptor', () => {

    let http: HttpClient;

    let httpTestingController: HttpTestingController;
    let recaptchaServiceSpy: jasmine.SpyObj<RecaptchaService>;
    let injectionServiceSpy: jasmine.SpyObj<InjectionService>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;

    beforeEach(() => {
        recaptchaServiceSpy = jasmine.createSpyObj(
            'RecaptchaService',
            ['getToken'],
            {
                ready: {
                    promise: Promise.resolve(),
                },
            },
        );
        recaptchaServiceSpy.getToken.and.returnValues(Promise.resolve('test-token'));

        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get', 'set'],
            {
                'ready': Promise.resolve(),
            },
        );
        configServiceSpy.get.and.returnValues({});
        configServiceSpy.get.withArgs('appConfig.useRecaptcha').and.returnValues(true);

        injectionServiceSpy = jasmine.createSpyObj(
            'InjectionService',
            ['getService'],
        );
        injectionServiceSpy.getService.and.callFake((name: string): Promise<any> => {
            if (name === 'recaptcha.recaptcha-service') {
                return Promise.resolve(recaptchaServiceSpy);
            }
        });

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: RecaptchaInterceptor,
                    multi: true,
                },
                {
                    provide: RecaptchaService,
                    useValue: recaptchaServiceSpy,
                },
                {
                    provide: InjectionService,
                    useValue: injectionServiceSpy,
                },
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
            ],
        });

        http = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        return configServiceSpy.ready;
    });

    it('-> should add X-RECAPTCHA', fakeAsync(() => {
        http.get('/bootstrap').subscribe();

        tick(500);
        http.get('/test').subscribe();

        const mockReq1 = httpTestingController.expectOne('/test');
        expect(mockReq1.request.headers.get('X-RECAPTCHA')).toBeFalsy();

        mockReq1.flush({}, {status: 429, statusText: 'Too Many Requests', headers: {
            'X-RECAPTCHA': '1',
        }});

        tick(500);
        const mockReq2 = httpTestingController.expectOne('/test');
        expect(mockReq2.request.headers.get('X-RECAPTCHA')).toEqual('test-token');

        tick(500);
        httpTestingController.expectNone('/test');
    }));

});
