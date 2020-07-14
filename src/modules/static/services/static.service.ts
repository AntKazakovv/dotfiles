import {Injectable} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class StaticService {

    constructor(
        protected configService: ConfigService,
        private httpClient: HttpClient,
    ) {
    }

    public async getStaticData(params: any): Promise<any> {
        this.checkPlugin();

        // if (!slug) {
        //     return Promise.reject();
        // }

        // await this.configReady;
        //
        // lang = lang || this.LanguageService.getCurrentLanguage().code.split('-').shift();
        //
        // const slugPages = this.getSlugPages(isPageType),
        //     wpLink: string = this.getWPLink(slug, slugPages, isPageType),
        //     restURL: string = `${this.apiUrl}/${wpLink}`;
        //
        // const params = _merge({slug, lang}, this.params);
        //
        // const cacheKey = restURL + JSON.stringify(params);
        //
        // return new Promise(async (resolve, reject) => {
        //     if (useCache && this.SessionCacheService.get(cacheKey)) {
        //         resolve(new CacheTextData({data: this.SessionCacheService.get(cacheKey)}));
        //     } else {
        //         try {
        //             const result = await this.$http.get(restURL, {params});
        //             const data = this.prepareTextData(result);
        //
        //             if (!data) {
        //                 reject(new Error('No content data'));
        //                 return;
        //             }
        //
        //             if (useCache) {
        //                 this.SessionCacheService.set(cacheKey, data, {maxAge: this.cacheMaxAge});
        //             }
        //             resolve(data);
        //         } catch (error) {
        //             reject(error);
        //         }
        //     }
        // });
    }

    protected async checkPlugin(plugin?: string): Promise<boolean> {
        if (!this.configService.appConfig.$static?.wpPlugins?.wlcApi) {
            return false;
        }

        try {
            const result = await this.httpClient.request<string>('get', '/content/wp-json/wp-wlc-api/v1/active-plugins/');
            console.log(result);
            // this.wpPluginList = result.data;
            // if (plugin) {
            //     const rx = new RegExp(`^${plugin}\/`);
            //     return !!_find(result.data, (item) => rx.test(item));
            // }
            // this.useWpPlugin = true;
            return true;
        } catch (error) {
            return false;
        }
    }


}
