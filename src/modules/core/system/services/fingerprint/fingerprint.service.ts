import {Injectable} from '@angular/core';

import {
    Agent,
    GetResult,
} from '@fingerprintjs/fingerprintjs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {RestMethodType} from 'wlc-engine/modules/core/system/services/data/data.service';

export type TFingerprintConfigKeys = 'profiles' | 'auth' | 'trustDevices';

type TFingerprintConfig = Record<TFingerprintConfigKeys, RestMethodType[]>;

export const configUrlForFingerprint: TFingerprintConfig = {
    profiles: ['POST', 'PATCH', 'PUT'],
    auth: ['PUT'],
    trustDevices: ['POST'],
};

@Injectable({
    providedIn: 'root',
})
export class FingerprintService {

    public version: string = '';

    private _fingerprintHash: string = '';

    constructor(
        private logService: LogService,
    ) {}

    /**
     * Fingerprint hash. Unique hash device
     *
     * @returns {Promise<string>}
     */
    public getFingerprintHash(): Promise<string> {
        return this._fingerprintHash ? Promise.resolve(this._fingerprintHash) : this.generateFingerprint();
    }

    private async generateFingerprint(): Promise<string> {
        try {
            const fingerprintLoader: Agent = await FingerprintJS.load();
            const resultDataFingerprint: GetResult = await fingerprintLoader.get();
            this.version = resultDataFingerprint.version;
            this._fingerprintHash = resultDataFingerprint.visitorId;

            return resultDataFingerprint.visitorId;
        } catch (error) {
            this.logService.sendLog({code: '1.9.1', data: error});
            return Promise.resolve('');
        }
    }
}
