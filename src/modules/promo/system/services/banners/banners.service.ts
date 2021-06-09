import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {
    ConfigService,
    IBanner,
} from 'wlc-engine/modules/core';
import {EventService} from 'wlc-engine/modules/core';
import {BannerModel} from 'wlc-engine/modules/promo';

import _every from 'lodash-es/every';
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

    constructor(
        protected eventService: EventService,
        protected configService: ConfigService,
        protected translate: TranslateService,
    ) {
        this.prepareBanners();

        this.translate.onLangChange.subscribe(() => {
            this.prepareBanners();
        });
    }

    public getBanners(filter?: IBannersFilter): BannerModel[] {
        let banners = this.banners;

        if (filter) {

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

            banners = _filter(banners, (banner): boolean => {
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

        return banners;
    }

    protected prepareBanners(): void {
        const banners = this.configService.get<IBanner[]>(`appConfig.banners[${this.translate.currentLang}]`);
        const defaultBanners = this.configService.get<IBanner[]>('appConfig.banners[en]');

        this.banners = _map(banners, (banner: IBanner): BannerModel => new BannerModel(banner));

        _every(this.banners, banner => banner.html === '')
            ? this.banners = _map(defaultBanners,
                (banner: IBanner): BannerModel => banner.html !== '' && new BannerModel(banner))
            : this.banners;

        this.banners = this.filterByGeo(this.banners, '-');
        this.banners = this.filterByGeo(this.banners, '+');
    }

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
}
