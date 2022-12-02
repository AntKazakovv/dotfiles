import {TestBed} from '@angular/core/testing';

import {EventService} from 'wlc-engine/modules/core';
import {CaptchaService} from 'wlc-engine/modules/security/captcha/system/services/captcha/captcha.service';

describe('CaptchaService', () => {
    let captchaService: CaptchaService;
    let eventServiceSpy: jasmine.SpyObj<EventService>;

    const imageUrl: string = 'imageUrl';
    const captchaCode: string = 'captchaCode';

    beforeEach(async () => {
        eventServiceSpy = jasmine.createSpyObj(
            'EventService',
            ['emit'],
        );

        TestBed.configureTestingModule({
            providers: [
                CaptchaService,
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
            ],
        });
        captchaService = TestBed.inject(CaptchaService);
    });

    it('-> should be created', () => {
        expect(captchaService).toBeDefined();
    });

    it('-> should emit event on setting captchaImageUrl and get the same url on getting', () => {
        captchaService.captchaImageUrl = imageUrl;

        expect(eventServiceSpy.emit).toHaveBeenCalledWith({
            name: 'CAPTCHA_ERROR',
            data: imageUrl,
        });
        expect(captchaService.captchaImageUrl).toBe(imageUrl);
    });

    it('-> should set captcha code and return it correctly', () => {
        captchaService.captchaCode = captchaCode;

        expect(captchaService.captchaCode).toBe(captchaCode);
    });
});
