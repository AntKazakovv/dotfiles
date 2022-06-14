/* eslint-disable no-restricted-globals */
import _trim from 'lodash-es/trim';

interface IData {
    status: 'success' | 'error';
    name: string;
    system: string;
    code?: number | string;
    errors?: string[];
    source?: string;
    data?: any;
}

interface IPreloadConfig {
    url: string;
    flag: string;
    system: string;
}

interface IPromiseStatus {
    fulfilled?: boolean;
}

interface IPreloadResult {
    [key: string]: Promise<IData> & IPromiseStatus;
}

const config: IPreloadConfig[] = [
    {
        url: '/api/v1/bootstrap',
        flag: 'bootstrap',
        system: 'config',
    },
    {
        url: '/api/v1/games?slim=true',
        flag: 'games',
        system: 'games',
    },
];

const lang = _trim(window.location?.pathname, '/').split('/')[0] || 'en';
const wlcPreload: IPreloadResult = {};
const checkCache = (url: string): boolean => {
    if (!window.localStorage) {
        return false;
    }

    return !!window.localStorage.getItem(`ngx-webstorage|${url.split('?')[0]}|${lang}`);
};

window.wlcPreload = wlcPreload;

if (window.WlcHelper.usedPcEmulation()) {
    window.WlcCookie.set('PC_EMULATION', '1', 360);
} else {
    window.WlcCookie.delete('PC_EMULATION');
}

config.forEach((request) => {
    if (checkCache(request.url)) {
        return;
    }

    wlcPreload[request.flag] = fetch(request.url)
        .then((res) => res.json())
        .then((result) => {
            result.system = request.system;
            result.name = request.flag;
            result.source = 'inline';

            if (request.flag === 'bootstrap') {
                window.WlcPreloaderLogo.setSuccess();
            }

            return result;
        }).catch(() => {
            if (request.flag === 'bootstrap') {
                window.WlcPreloaderLogo.error = true;
            }

            wlcPreload[request.flag]['fulfilled'] = false;
        });
});
