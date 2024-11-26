/* eslint-disable no-restricted-globals */

import {WlcMirror} from './_mirror';

export class WlcCrossDomainAuth implements ICrossDomainAuth {
    public get isMirror(): boolean {
        return !!this.mirror;
    }

    protected readonly isProdEnvironment: boolean = !window['WLC_ENV'];
    protected readonly testMainDomain: string = 'https://test-crossdomain.egamings.com';
    protected mirror: WlcMirror;

    public initMirror(mainDomainUrl: string): void {
        this.mirror = new WlcMirror(this.isProdEnvironment ? mainDomainUrl : this.testMainDomain);
    }

    public sendMessageForMainDomain<T>(data: T): void {
        if (this.mirror) {
            this.mirror.sendPostMessage<T>(data);
        }
    }
}

window.crossDomainAuth = new WlcCrossDomainAuth();
