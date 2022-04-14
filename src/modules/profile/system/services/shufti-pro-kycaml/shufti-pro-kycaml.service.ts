import {Injectable} from '@angular/core';
import {
    DomSanitizer,
    SafeResourceUrl,
} from '@angular/platform-browser';

import {
    DataService,
    IData,
} from 'wlc-engine/modules/core';

interface IShuftiProKycamlData {
    url: string;
}

@Injectable()
export class ShuftiProKycamlService {

    constructor(
        private dataService: DataService,
        private sanitizer: DomSanitizer,
    ) { }

    public async getIframeUlr(): Promise<SafeResourceUrl> {

        const res = await this.dataService.request<IData<IShuftiProKycamlData>>({
            name: 'kycamlGet',
            system: 'verification',
            url: '/kycaml',
            type: 'GET',
        });

        let url = res.data?.url;

        if (!url) {
            const res = await this.dataService.request<IData<IShuftiProKycamlData>>({
                name: 'kycamlGet',
                system: 'verification',
                url: '/kycaml',
                type: 'POST',
            });

            url = res.data?.url;

            if (!url) {
                throw new Error('Iframe url was not received');
            }
        }

        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
