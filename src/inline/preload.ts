interface IPreloadConfig {
    url: string;
    flag: string;
}

interface IPreloadResult {
    [key: string]: {
        request: Promise<any>,
        result: any,
    };
}

const config: IPreloadConfig[] = [
    {
        url: '/api/v1/bootstrap',
        flag: 'bootstrap',
    },
    {
        url: '/api/v1/games',
        flag: 'games'
    },
];

const wlcPreload: IPreloadResult = {};

(window as any).wlcPreload = wlcPreload;
config.forEach((request) => {
    const req = new Promise((resolve, reject) => {
        fetch(request.url).then((res) => res.json()).then((result) => {
            wlcPreload[request.flag].result = result;
            resolve(result);
        });
    });
    wlcPreload[request.flag] = {
        request: req,
        result: null,
    };
});
