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

let jwtAuthToken = window.localStorage.getItem('ngx-webstorage|jwtauthtoken');
if (jwtAuthToken) {
    jwtAuthToken = jwtAuthToken.replace(/"/g, '');
}

config.forEach((request) => {
    if (checkCache(request.url)) {
        return;
    }

    const requestParams = {
        headers: {},
    };

    if (jwtAuthToken) {
        // @ts-ignore
        requestParams.headers['Authorization'] = `Bearer ${jwtAuthToken}`;
    }

    const url: string = `${window.WlcHelper.mobileAppApiUrl || ''}${request.url}`;

    wlcPreload[request.flag] = fetch(url, requestParams)
        .then((res) => res.json())
        .then((result) => {
            result.system = request.system;
            result.name = request.flag;
            result.source = 'inline';
            return result;
        }).catch(() => {
            wlcPreload[request.flag]['fulfilled'] = false;
        });
});
