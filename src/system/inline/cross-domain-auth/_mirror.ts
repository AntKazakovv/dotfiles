/* eslint-disable no-restricted-globals */

import {
    IJwtAuth,
    IJwtAuthSync,
    IJwtSetTokens,
} from './interfaces';
import {crossDomainEvents} from './constants';
import {WlcFlog} from '../_flog';

/**
 * For mirror domain
 */
export class WlcMirror {

    private wlcFlog: WlcFlog = window.WlcFlog;
    private iframe: HTMLIFrameElement;

    constructor(
        private preprodUrl: string,
    ) {
        this.init();
    }

    public sendPostMessage<T>(data: T): void {
        this.iframe?.contentWindow?.postMessage(data, '*');
    }

    private init(): void {
        if (!this.preprodUrl) {
            console.error('Option "preprodUrl" for mirror not detected');
            this.wlcFlog.send({code: '35.1.0'});
            return;
        }

        document.addEventListener('DOMContentLoaded', () => {
            this.createIframe();

            window.addEventListener('message', (event) => {
                if (!event.data?.event) {
                    return;
                }

                const data = event.data;

                if (data.event === 'JWT_SET_TOKENS') {
                    this.jwtSetTokensHandler(data);
                } else if (data.event === 'JWT_AUTH') {
                    this.jwtAuthHandler(data);
                } else if (data.event === 'JWT_AUTH_SYNC') {
                    this.jwtAuthSyncHandler(data);
                }
            }, false);

            document.body.prepend(this.iframe);
        });
    }

    private createIframe(): void {
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('src', this.preprodUrl);
        this.iframe.setAttribute('id', 'wlc-domain');
        this.iframe.style.display = 'none';
    }

    private dispatchEvent<T>(name: string, detail?: T): void {
        window.dispatchEvent(new CustomEvent(name, {
            detail: detail || {},
            bubbles: true,
            cancelable: false,
        }));
    }

    private jwtSetTokensHandler(data: IJwtSetTokens): void {
        this.dispatchEvent('LOCAL_STORAGE_SET', {
            name: 'jwtauthtoken',
            value: data.authToken,
        });
        this.dispatchEvent('LOCAL_STORAGE_SET', {
            name: 'jwtauthrefreshtoken',
            value: data.refreshToken,
        });
    }

    private jwtAuthHandler(data: IJwtAuth): void {
        this.dispatchEvent('LOCAL_STORAGE_SET', {
            name: 'jwtauthtoken',
            value: data.authToken,
        });
        this.dispatchEvent('LOCAL_STORAGE_SET', {
            name: 'jwtauthrefreshtoken',
            value: data.refreshToken,
        });

        if (data.xNonce) {
            this.dispatchEvent('LOCAL_STORAGE_SET', {
                name: 'x-nonce',
                value: data.xNonce,
            });
        }

        if (data.authToken && data.refreshToken) {
            setTimeout(() => {
                this.dispatchEvent(crossDomainEvents.AUTH_LOGIN);
                this.dispatchEvent('LOCAL_STORAGE_SET', {
                    name: 'jwtauthlogin',
                    value: true,
                });

                window.dispatchEvent(new CustomEvent('LOCAL_STORAGE_SET', {
                    detail: {
                        name: 'jwtauthlogin', value: true,
                    },
                    bubbles: true,
                    cancelable: false,
                }));
            });
        } else {
            this.dispatchEvent(crossDomainEvents.AUTH_LOGOUT);
        }
    }

    private jwtAuthSyncHandler(data: IJwtAuthSync): void {
        this.dispatchEvent('LOCAL_STORAGE_SET', {
            name: 'jwtauthtoken',
            value: data.authToken,
        });
        this.dispatchEvent('LOCAL_STORAGE_SET', {
            name: 'jwtauthrefreshtoken',
            value: data.refreshToken,
        });

        if (data.xNonce) {
            this.dispatchEvent('LOCAL_STORAGE_SET', {
                name: 'x-nonce',
                value: data.xNonce,
            });
        }

        if (data.authToken && data.refreshToken) {
            setTimeout(() => {
                this.dispatchEvent(crossDomainEvents.AUTH_LOGIN);
            });
        } else if (!data.authToken && !data.refreshToken) {
            this.dispatchEvent(crossDomainEvents.AUTH_LOGOUT);
        }
    }

}
