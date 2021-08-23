import {WlcFlog} from './_flog';

const regExp = {
    require: new RegExp('.*/static/dist/.*\.js'),
};

class UnhandledErrors {
    private wlcFlog: WlcFlog = window.WlcFlog;

    constructor() {
        this.subscribeErrors();
    }

    private subscribeErrors(): void {
        window.addEventListener('error', (error: Event) => {
            this.isRequireError(error);
        }, true);
    }

    private isRequireError(error: Event): void {
        if (regExp.require.test((error.target as HTMLScriptElement)?.src)) {
            this.wlcFlog.send({
                code: '0.0.5',
                level: 'fatal',
                data: {
                    src: (error.target as HTMLScriptElement).src,
                },
            }).finally();
        }
    }
}

new UnhandledErrors();
