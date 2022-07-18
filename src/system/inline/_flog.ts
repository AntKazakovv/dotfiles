/* eslint-disable no-restricted-globals */
export interface IFlogData {
    code: string;
    level?: string;

    [key: string]: any;
}

export class WlcFlog {
    public readonly enabled: boolean = false;
    public readonly startTime: Date = new Date();

    private isReadyResolve: () => void;
    private isReady: Promise<void> = new Promise((resolve: () => void) => {
        this.isReadyResolve = resolve;
    });
    private eventListeners = {
        beforeunload: () => {},
    };

    constructor() {
        this.enabled = !window['WLC_ENV'] || document.cookie.indexOf('flog=') !== -1;
        if (!this.enabled) {
            return;
        }
        this.addListeners();
        this.sendInitLog().finally();
        this.isReadyResolve();
    }

    /**
     * Set сompileSuccess and remove beforeunload listener
     *
     * @param {boolean} value Value
     * @returns {void}
     */
    public setCompileSuccess(): void {
        window.removeEventListener('beforeunload', this.eventListeners.beforeunload);
    }

    /**
     * Send log
     *
     * @param {IFlogData} data Log data
     * @returns {Promise<string>}
     */
    public async send(data: IFlogData): Promise<string> {
        if (!this.enabled) {
            return Promise.reject('Flog disabled');
        }

        await this.isReady;
        data.level = data.level || 'log';
        this.setVersion(data);
        const dataString = this.getDataString(data),
            abortController = window.AbortController && new window.AbortController();

        if (!dataString) {
            return Promise.reject('Wrong data object');
        }

        try {
            const apiUrl: string = window.WlcHelper.mobileAppApiUrl || '';
            const response: Response = await fetch(`${apiUrl}/flog`, {
                method: 'POST',
                body: dataString,
                signal: abortController?.signal,
            });
            abortController?.abort();
            if (response?.ok) {
                return Promise.resolve('Done');
            } else {
                return Promise.reject('Response not 2xx');
            }
        } catch {
            return Promise.reject('Sending error');
        }
    }

    private addListeners(): void {
        this.eventListeners.beforeunload = () => {
            this.send({
                code: '0.0.10',
                duration: (new Date().getTime() - this.startTime.getTime()) / 1000,
            }).finally();
        };
        window.addEventListener('beforeunload', this.eventListeners.beforeunload);
    }

    /**
     * Send init log
     *
     * @returns {Promise<void>}
     */
    private async sendInitLog(): Promise<void> {
        await this.send({
            code: !window['WLC_FORBIDDEN'] ? '0.0.0' : '0.0.11',
            referrer: document.referrer,
        });
    }

    /**
     * Get data as JSOn string
     *
     * @param {IFlogData} data Log data
     * @returns {string}
     */
    private getDataString(data: IFlogData): string {
        if (!data || !data.code || !data.level) {
            return '';
        }
        try {
            return JSON.stringify(data);
        } catch (e) {
            throw new Error('Error Flog data');
        }
    }

    /**
     *
     * Set type of project base ('theme' | 'engine')
     *
     * @param {IFlogData} data Log data
     */
    private setVersion(data: IFlogData): void {
        if (!data.from) {
            data.from = {};
        }
        data.from.version = 'engine';
    }
}

(() => {
    Object.assign(window, {WlcFlog: new WlcFlog()});
})();
