import {NgModule} from '@angular/core';

import {QRCodeService} from 'wlc-engine/modules/qr-code/system';

export const components = {};

export const services = {
    'qr-code-service': QRCodeService,
};

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        QRCodeService,
    ],
    exports: [],
})
export class QrCodeModule {}
