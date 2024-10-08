/* eslint-disable no-restricted-globals */

import {WlcMirror} from './_mirror';

export class WlcCrossDomainAuth implements ICrossDomainAuth {
    public get isMirror(): boolean {
        return !!this.mirror;
    }
    private mirror: WlcMirror;

    public initMirror(mainDomainUrl: string): void {
        this.mirror = new WlcMirror(mainDomainUrl);
    }

    public sendMessageForMainDomain<T>(data: T): void {
        if (this.mirror) {
            this.mirror.sendPostMessage<T>(data);
        }
    }
}

window.crossDomainAuth = new WlcCrossDomainAuth();
