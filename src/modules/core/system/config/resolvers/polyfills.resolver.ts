import {InjectionToken} from "@angular/core";
import {shouldPolyfill as shouldPolyfillNumberFormat} from '@formatjs/intl-numberformat/should-polyfill';
import {TranslateService} from "@ngx-translate/core";
import {ResolveTypes} from "@uirouter/core";
import {ConfigService} from "wlc-engine/modules/core";
import {IIndexing} from "wlc-engine/modules/core/system/interfaces";

import {
    get as _get,
} from 'lodash-es';

export const polyfillsResolver: ResolveTypes = {
    token: new InjectionToken('Empty token'),
    deps: [ConfigService, TranslateService],
    async resolveFn(configService: ConfigService, translateService: TranslateService) {
        return new PolyfillsResolver(configService, translateService).resolve();
    },
};

class PolyfillsResolver {
    private static readonly shouldPolyfillNumberFormat: boolean = shouldPolyfillNumberFormat();

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
    ) {
    }

    public async resolve(): Promise<void> {
        if (!PolyfillsResolver.shouldPolyfillNumberFormat) {
            return;
        }

        await this.configService.ready;
        const language = this.translateService.currentLang
            || await this.configService.get('appConfig.language');

        await import('@formatjs/intl-numberformat/polyfill');
        switch (language) {
            case 'pt-br':
                await import('@formatjs/intl-numberformat/locale-data/pt');
                break;
            case 'sr-latn':
                await import('@formatjs/intl-numberformat/locale-data/sr-Latn');
                break;
            case 'sr-cyrl':
                await import('@formatjs/intl-numberformat/locale-data/sr-Cyrl');
                break;
            case 'kg':
                await import('@formatjs/intl-numberformat/locale-data/ky');
                break;
            case 'sp':
                await import('@formatjs/intl-numberformat/locale-data/es');
                break;
            case 'ua':
                await import('@formatjs/intl-numberformat/locale-data/uk');
                break;
            case 'zh-hans':
                await import('@formatjs/intl-numberformat/locale-data/zh-Hans');
                break;
            case 'zh-hant':
                await import('@formatjs/intl-numberformat/locale-data/zh-Hant');
                break;
            case 'cn':
                await import('@formatjs/intl-numberformat/locale-data/zh');
                break;
            case 'zh-cn':
                await import('@formatjs/intl-numberformat/locale-data/zh');
                break;
            case 'es-mx':
                await import('@formatjs/intl-numberformat/locale-data/es-MX');
                break;
            case 'ie':
                await import('@formatjs/intl-numberformat/locale-data/gl');
                break;
            case 'au':
                await import('@formatjs/intl-numberformat/locale-data/en-AU');
                break;
            case 'ph':
                await import('@formatjs/intl-numberformat/locale-data/es-PH');
                break;
        }
    }
}
