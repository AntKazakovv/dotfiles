import {InjectionToken} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {ResolveTypes} from '@uirouter/core';
import {shouldPolyfill as shouldPolyfillNumberFormat} from '@formatjs/intl-numberformat/should-polyfill';
import {shouldPolyfill as shouldPolyfillLocale} from '@formatjs/intl-locale/should-polyfill';
import {shouldPolyfill as shouldPolyfillPluralRules} from '@formatjs/intl-pluralrules/should-polyfill';
import {ConfigService} from 'wlc-engine/modules/core';

export const polyfillsResolver: ResolveTypes = {
    token: new InjectionToken('Polyfills resolver'),
    deps: [ConfigService, TranslateService, DOCUMENT],
    async resolveFn(
        configService: ConfigService,
        translateService: TranslateService,
        document: Document,
    ) {
        return new PolyfillsResolver(configService, translateService, document).resolve();
    },
};

class PolyfillsResolver {
    private static readonly shouldPolyfillNumberFormat: string = shouldPolyfillNumberFormat();

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private document: Document,
    ) {
    }

    public async resolve(): Promise<void> {
        await this.smoothScroll();
        await this.formatjs();
    }

    /**
     * load formatjs polyfills
     */
    private async formatjs(): Promise<void> {
        if (!PolyfillsResolver.shouldPolyfillNumberFormat) {
            return;
        }

        await this.configService.ready;
        const language = this.translateService.currentLang
            || await this.configService.get('appConfig.language');

        await import('@formatjs/intl-numberformat/polyfill');

        if (shouldPolyfillLocale()) {
            await import('@formatjs/intl-locale/polyfill');
        }

        if (shouldPolyfillPluralRules()) {
            await import('@formatjs/intl-pluralrules/polyfill');
        }

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
            default:
                await import('@formatjs/intl-numberformat/locale-data/en');
                break;
        }
    }

    /**
     * load smoothScroll polyfill
     */
    private async smoothScroll(): Promise<void> {
        if ('scrollBehavior' in this.document.documentElement.style) {
            return;
        }
        return await import('wlc-engine/system/polyfills/smoothscroll').then(m => {
            m.polyfill(this.document);
        });
    }
}
