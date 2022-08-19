import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';
import {RecaptchaService} from 'wlc-engine/modules/core/system/services/recaptcha/recaptcha.service';
import {DataService} from 'wlc-engine/modules/core';
import {AppModule} from 'wlc-engine/modules/app/app.module';

describe('HeadersInterceptor', () => {
    let dataService: DataService;
    let httpTestingController: HttpTestingController;
    let recaptchaService: jasmine.SpyObj<RecaptchaService>;

    beforeEach(() => {
        recaptchaService = jasmine.createSpyObj(
            'RecaptchaService',
            ['getToken'],
            {
                ready: {
                    promise: Promise.resolve(),
                },
            },
        );
        recaptchaService.getToken.and.returnValues(Promise.resolve('test-token'));

        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [
                DataService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HeadersInterceptor,
                    multi: true,
                },
                {
                    provide: RecaptchaService,
                    useValue: recaptchaService,
                },
            ],
        });

        dataService = TestBed.inject(DataService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('-> should add header', fakeAsync(() => {
        dataService.registerMethod({
            name: 'test',
            system: 'test',
            type: 'GET',
            url: '/test',
        });
        dataService.request('test/test');
        tick();

        const mockReq1 = httpTestingController.expectOne('/api/v1/test?lang=en');
        expect(mockReq1.request.headers.get('X-RECAPTCHA')).toBeFalsy();

        mockReq1.flush({}, {status: 429, statusText: 'Too Many Requests', headers: {
            'X-RECAPTCHA': '1',
        }});

        tick();

        const mockReq2 = httpTestingController.expectOne('/api/v1/test?lang=en');
        expect(mockReq2.request.headers.get('X-RECAPTCHA')).toEqual('test-token');

        tick();
        httpTestingController.expectNone('/api/v1/test?lang=en');
    }));
});
