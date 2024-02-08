import {Injectable} from '@angular/core';

/**
 * Only types and interfaces may be imported from 'qrcode'
 * **/
import {
    QRCodeSegment,
    QRCodeToDataURLOptions,
} from 'qrcode';

@Injectable({
    providedIn: 'root',
})
export class QRCodeService {
    /**
     * Package instance
     * **/
    QRCode: typeof import('qrcode');

    constructor() {}

    protected async loadPackage(): Promise<void> {
        const {default: QRCode} = await import('qrcode');
        this.QRCode = QRCode;
    }

    public async toDataURL(
        text: string | QRCodeSegment[],
        options?: QRCodeToDataURLOptions,
    ): Promise<string> {
        if (!this.QRCode) {
            await this.loadPackage();
        }

        return this.QRCode.toDataURL(text, options);
    }
}
