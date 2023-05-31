import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {IBanner} from 'wlc-engine/modules/core/system/interfaces/promo.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {BannerModel} from 'wlc-engine/modules/promo/system/models/banner.model';

import _filter from 'lodash-es/filter';
import _intersection from 'lodash-es/intersection';
import _map from 'lodash-es/map';
import _startsWith from 'lodash-es/startsWith';

declare type IPlatform = 'any' | 'desktop' | 'mobile';
declare type IVisibility = 'anyone' | 'anonymous' | 'authenticated';

export interface IBannersFilter {
    position?: string[];
    platform?: IPlatform[];
    visibility?: IVisibility[];
}

@Injectable({
    providedIn: 'root',
})
export class BannersService {
    protected banners: BannerModel[] = [];
    protected defaultBanners: BannerModel[] = [];

    constructor(
        protected configService: ConfigService,
        translateService: TranslateService,
    ) {
        this.defaultBanners = this.prepareBanners();
        this.banners = this.prepareBanners(translateService.currentLang);

        translateService.onLangChange.subscribe(() => {
            this.banners = this.prepareBanners(translateService.currentLang);
        });
    }

    /**
     * Get banners. If not in the current language, takes from the English version.
     *
     * @method getBanners
     * @param {IBannersFilter} filter - filter for banners
     * @returns {BannerModel}
     *
     */
    public getBanners(filter?: IBannersFilter): BannerModel[] {
        if (!filter) {
            return this.banners || this.defaultBanners;
        }

        let banners = this.filterBanners(this.banners, filter);

        if (!banners.length) {
            banners = this.filterBanners(this.defaultBanners, filter);
        }

        return banners;
    }

    /**
     * Filter banners by geo
     *
     * @method filterByGeo
     * @param {BannerModel[]} banners - banners
     * @param {string} prefix - geo prefix
     * @returns {BannerModel}
     *
     */
    protected filterByGeo(banners: BannerModel[], prefix: string): BannerModel[] {
        return _filter(banners, (banner: BannerModel) => {
            const bannerGeo = _filter(banner.geo, (item) => _startsWith(item, prefix));
            const lastFlag = prefix === '-'
                ? !(bannerGeo.indexOf(prefix + this.configService.get<string>('appConfig.country')) !== -1)
                : bannerGeo.indexOf(prefix + this.configService.get<string>('appConfig.country')) !== -1;

            return !bannerGeo.length
                || bannerGeo.length
                && lastFlag;
        });
    }

    /**
     * Get banners from bootstrap
     *
     * @method setBanners
     * @param {string} lang - language - default `en`
     * @returns {BannerModel}
     *
     */
    protected prepareBanners(lang: string = 'en'): BannerModel[] {
        let banners = _map(
            _filter(
                this.configService.get<IBanner[]>(`appConfig.banners[${lang}]`),
                banner => banner.html,
            ),
            (banner: IBanner): BannerModel => new BannerModel(
                {
                    service: 'BannersService',
                    method: 'prepareBanners',
                },
                banner,
            ),
        );

        banners = this.filterByGeo(banners, '-');
        banners = this.filterByGeo(banners, '+');

        return banners;
    }

    /**
     * Selects banners by filters
     *
     * @method filterBanners
     * @param {BannerModel[]} banners - banners
     * @param {IBannersFilter} filter - filter
     * @returns {BannerModel}
     *
     */
    protected filterBanners(banners: BannerModel[], filter: IBannersFilter): BannerModel[] {
        let {position, platform, visibility} = filter;

        if (!platform?.length) {
            platform = ['any', this.configService.get<boolean>('appConfig.mobile') ? 'mobile' : 'desktop'];
        }

        if (!visibility?.length) {
            visibility = [
                'anyone',
                this.configService.get<boolean>('$user.isAuthenticated')
                    ? 'authenticated'
                    : 'anonymous',
            ];
        }

        return _filter(banners, (banner): boolean => {
            let result = true;

            if (position?.length) {
                result = !!_intersection(banner.tags, position).length;
            }

            result = result
                && !!_intersection(banner.platform, platform).length
                && !!_intersection(banner.visibility, visibility).length;

            return result;
        });
    }
}
