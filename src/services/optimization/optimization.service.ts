import {Injectable} from '@angular/core';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {TDeviceSelection} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    IActivation,
} from 'wlc-engine/modules/core/system/interfaces/base-config/optimization.interface';

@Injectable({
    providedIn: 'root',
})
export class OptimizationService {

    public get useSlimImages(): boolean {
        return this._useSlimImages;
    }

    private _useSlimImages: boolean = false;

    constructor(
        private configService: ConfigService,
        private logService: LogService,
    ) {
        this.init();
    }

    /**
     * Slim version of images.
     * Now it used for game thumbnails + betradar sportsbook widgets
     *
     * @param {string} url - image url
     */
    public getSlimImage(url: string): string {
        return url.replace(/(gstatic|agstatic\.com)\/games\//, '$1/slim/games/');
    }

    private async init(): Promise<void> {
        await this.configService.ready;

        if (this.configService.get('$base.optimization.slimImages.use')) {
            const activation = this.configService.get<IActivation>('$base.optimization.slimImages.activation');

            if (activation?.deviceType && !this.checkActivationByDevice(activation.deviceType)) {
                return;
            }

            if (activation?.siteCompileTime) {
                this.logService.sendLog$.subscribe((log) => {
                    if (log.code === '0.0.9' && log?.duration > activation.siteCompileTime) {
                        this._useSlimImages = true;
                    }
                });
                return;
            }
            this._useSlimImages = true;
        }
    }

    private checkActivationByDevice(device: TDeviceSelection): boolean {
        switch (device) {
            case 'mobile':
                return this.configService.get<boolean>('appConfig.mobile');
            case 'desktop':
                return !this.configService.get<boolean>('appConfig.mobile');
            default:
                return true;
        }
    }
}
