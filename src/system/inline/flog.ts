'use strict';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

interface IData extends IIndexing<any> {
    code: string;
    level: string;
}

interface IFP2Options {
    excludes?: IIndexing<boolean>;
}

type voidFunction = () => void;

class WlcFlog {
    public readonly enabled: boolean = false;

    private fingerprint: string;
    private isReadyResolve: voidFunction;

    private isReady: Promise<void> = new Promise((resolve: voidFunction, reject: voidFunction) => {
        this.isReadyResolve = resolve;
    });
    private readonly params = {
        url: '/flog',
        method: 'POST',
        startTime: new Date(),
        flogDisableMessage: 'Flog disabled',
    };
    private readonly FP2Options: IFP2Options = {
        excludes: {
            fonts: true,
            canvas: true,
            webgl: true,
            audio: true,
            enumerateDevices: true,
            adBlock: true,
            webglVendorAndRenderer: true,
        },
    };

    constructor() {
        this.enabled = !window.WLC_ENV || document.cookie.indexOf('flog=') !== -1;
        if (window.Fingerprint2) {
            this.getHash().finally(() => {
                this.isReadyResolve();
            });
        } else {
            this.isReadyResolve();
        }
    }

    /**
     * Log error
     *
     * @param {string} code Error code
     * @param {IIndexing<any>} data Error data
     * @returns {Promise<string>}
     */
    public async log(code: string, data: IIndexing<any>): Promise<string> {
        return this.send({
            level: 'log',
            code: code,
            ...data,
        });
    }

    /**
     * Log error with duration param
     *
     * @param {string} code Error code
     * @returns {Promise<string>}
     */
    public async logDuration(code: string): Promise<string> {
        return this.log(code, {
            duration: this.timeFromStart(),
        });
    }

    /**
     * Log with level error
     *
     * @param {string} code Error code
     * @param {IIndexing<any>} data Error data
     * @returns {Promise<string>}
     */
    public async error(code: string, data: IIndexing<any>): Promise<string> {
        return this.send({
            level: 'error',
            code: code,
            ...data,
        });
    }

    /**
     * Log with level fatal
     *
     * @param {string} code Error code
     * @param {IIndexing<any>} data Error data
     * @returns {Promise<string>}
     */
    public async fatal(code: string, data: IIndexing<any>): Promise<string> {
        return this.send({
            level: 'fatal',
            code: code,
            ...data,
        });
    }

    /**
     * Get time from start script
     *
     * @returns {number}
     */
    private timeFromStart(): number {
        return (new Date().getTime() - this.params.startTime.getTime()) / 1000;
    }

    /**
     * Get hash for current device
     *
     * @returns {Promise<void>}
     */
    private async getHash(): Promise<void> {
        await window.Fingerprint2.getPromise(this.FP2Options).then((components: any) => {
            const values = components.map((component: any) => component.value.toString());
            this.fingerprint = window.Fingerprint2.x64hash128(values.join(''), 31);
        });
    }

    /**
     * Get data as JSOn string
     *
     * @param {IData} data Log data
     * @returns {string}
     */
    private getDataString(data: IData): string {
        if (!data || !data.code || !data.level) {
            return '';
        }
        if (this.fingerprint) {
            data.hash = this.fingerprint;
        }
        try {
            return JSON.stringify(data);
        } catch (e) {
            throw new Error('Error Flog data');
        }
    }

    /**
     * Send log
     *
     * @param {IData} data Log data
     * @returns {Promise<string>}
     */
    private async send(data: IData): Promise<string> {
        await this.isReady;
        const dataString = this.getDataString(data),
            abortController = new window['AbortController']();

        if (!dataString) {
            return Promise.reject('Wrong data object');
        }

        if (!this.enabled) {
            return Promise.reject(this.params.flogDisableMessage);
        }

        try {
            const response: Response = await fetch(this.params.url, {
                method: this.params.method,
                body: dataString,
                signal: abortController.signal,
            });
            abortController.abort();
            if (response?.ok) {
                return 'Done';
            } else {
                return Promise.reject('Response not 2xx');
            }
        } catch {
            return Promise.reject('Send error');
        }
    }
}

Object.assign(window, {WlcFlog: new WlcFlog()});
