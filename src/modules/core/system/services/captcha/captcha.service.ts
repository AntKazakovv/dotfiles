import {Injectable} from '@angular/core';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

@Injectable()
export class CaptchaService {
    private _captchaImageUrl: string;
    private _captchaCode: string;

    constructor(
        protected eventService: EventService,
    ) {}

    /**
     * @returns string - returns image for captcha
     */
    public get captchaImageUrl(): string {
        return this._captchaImageUrl;
    }

    /**
     * @returns void
     * @param string - set image for captcha and emit event of error
     */
    public set captchaImageUrl(url: string) {
        this._captchaImageUrl = url;

        this.eventService.emit({
            name: 'CAPTCHA_ERROR',
            data: url,
        });
    }

    /**
     * @returns string - returns entered captcha code
     */
    public get captchaCode(): string {
        return this._captchaCode;
    }

    /**
     * @returns void
     * @param string - set entered captcha code
     */
    public set captchaCode(data: string) {
        this._captchaCode = data;
    }
}
