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
     * Don't change init method!
     * Only if you want to change 'final' to 'replace' in customHookConfig.
     * 'final': customMethod - will run after main method
     * 'replace': customMethod - will replace main method
     */
    public async init() {
        await this.configService.ready;

        let customHookConfig: ICustomHookConfig = {
            finances: {
                financesServiceOnPaymentPending: {
                    final: this.customOnPaymentPending,
                },
                financesServiceOnPaymentSuccess: {
                    final: this.customOnPaymentSuccess,
                },
                financesServiceOnPaymentFail: {
                    final: this.customOnPaymentFailed,
                },
            },
        };

        this.configService.set({
            name: 'customHookConfig',
            value: customHookConfig,
        });
    }

    public customOnPaymentPending() {
        // create custom method
    }

    public customOnPaymentSuccess() {
        // create custom method
    }

    public customOnPaymentFailed() {
        // create custom method
    }
}
