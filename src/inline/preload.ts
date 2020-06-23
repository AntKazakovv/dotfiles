interface IPreloadConfig {
    url: string;
    flag: string;
}

interface IPreloadResult {
    [key: string]: Promise<unknown>;
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
            resolve(result);
        });
    });
    wlcPreload[request.flag] = req;
});
