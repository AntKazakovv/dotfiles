import {Injectable} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/services';
import {BannerModel} from 'wlc-engine/modules/promo/models/banner.model';

import {
    filter as _filter,
    intersection as _intersection,
    startsWith as _startsWith,
} from 'lodash';

declare type IPlatform = 'any' | 'desktop' | 'mobile';
declare type IVisibility = 'anyone' | 'anonymous' | 'authenticated';

export interface IBannersFilter {
    position?: string[];
    platform?: IPlatform[];
    visibility?: IVisibility[];
}

@Injectable()
export class BannersService {
    protected banners: BannerModel[] = [];

    // TODO: replace with UserService
    protected UserService = {
        isAuthenticated: true,
    }

    constructor(
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        this.prepareBanners();

        this.eventService.subscribe({
            name: 'LANGUAGE_CHANGED',
        }, () => {
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
                visibility = ['anyone', this.UserService.isAuthenticated ? 'authenticated' : 'anonymous'];
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
        const banners = this.configService.get<any>(`appConfig.banners[${this.configService
            .get<string>('appConfig.language')}]`);
        this.banners = banners.map((banner: BannerModel): BannerModel => new BannerModel(banner));
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
