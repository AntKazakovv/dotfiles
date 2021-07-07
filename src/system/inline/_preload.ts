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
    //     url: '/api/v1/games?slim=true',
    //     flag: 'games',
    //     system: 'games',
    // },
];

const wlcPreload: IPreloadResult = {};

window.wlcPreload = wlcPreload;
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
