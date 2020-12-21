import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

interface IPreloadConfig {
    url: string;
    flag: string;
    system: string;
}

interface IPreloadResult {
    [key: string]: Promise<IData>;
}

const config: IPreloadConfig[] = [
    {
        url: '/api/v1/bootstrap',
        flag: 'bootstrap',
        system: 'config',
    },
    // {
    //     url: '/api/v1/games',
    //     flag: 'games'
    //     system: 'games',
    // },
];

const wlcPreload: IPreloadResult = {};

(window as any).wlcPreload = wlcPreload;
config.forEach((request) => {

    const req: Promise<IData> = fetch(request.url)
        .then((res) => res.json())
        .then((result) => {
            result.system = request.system;
            result.name = request.flag;
            result.source = 'inline';
            return result;
        });

    wlcPreload[request.flag] = req;
});
