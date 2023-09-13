import {Injectable} from '@angular/core';

import {
    ICustomHookConfig,
    ConfigService,
} from 'wlc-engine/modules/core';

@Injectable({
    providedIn: 'root',
})
export class CustomHookService {

    constructor(
        private configService: ConfigService,
    ) {
        this.init();
    }

    /**
     * Don't change init method! Only if you want to fill customHookConfig.
     * final: will run after main method, replace: will replace main method.
     * 
     * Config example:
     * 
     * let customHookConfig: ICustomHookConfig = {
     *     finances: {
     *         financesServiceOnPaymentPending: {
     *             final: this.customMethod,
     *         },
     *         financesServiceOnPaymentFail: {
     *             replace: this.customMethod,
     *         },
     *     },
     * };
     */
    public async init() {
        await this.configService.ready;

        let customHookConfig: ICustomHookConfig = {};

        this.configService.set({
            name: 'customHookConfig',
            value: customHookConfig,
        });
    }
}
