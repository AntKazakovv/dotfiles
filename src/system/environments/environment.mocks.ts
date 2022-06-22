import _get from 'lodash-es/get';
import * as $config from 'wlc-config/index';

if (_get($config, '$base.autoMocks.use', false)) {
    (async () => {
        const {worker} = await import('../../mocks/browser');

        await worker.start({
            serviceWorker: {
                url: '/sw.js',
                options: {
                    scope: '/',
                },
            },
            onUnhandledRequest: 'bypass',
        });
    })();
}
