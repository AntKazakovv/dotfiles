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
    private static locales: IIndexing<string> = {
        'pt-br': 'pt',
        'sr-latn': 'sr-Latn',
        'sr-cyrl': 'sr-Cyrl',
        'kg': 'ky',
        'sp': 'es',
        'ua': 'uk',
        'zh-hans': 'zh-Hans',
        'zh-hant': 'zh-Hant',
        'cn': 'zh',
        'zh-cn': 'zh',
        'es-mx': 'es-MX',
        'ie': 'gl',
        'au': 'en-AU',
        'ph': 'es-PH',
    };

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
    ) {}

    public async resolve(): Promise<void> {
        if (!PolyfillsResolver.shouldPolyfillNumberFormat) {
            return;
        }

        await this.configService.ready;
        const language = this.translateService.currentLang
            || await this.configService.get('appConfig.language');

        await import('@formatjs/intl-numberformat/polyfill');
        await import(`@formatjs/intl-numberformat/locale-data/${_get(PolyfillsResolver.locales, language, language)}`);
    }
}
