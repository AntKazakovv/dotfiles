import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export type ComponentTheme = 'default';
export type ComponentType = 'default';

export interface ISlides {
    component: string;
    params: any;
}

export interface ISliderParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    slides?: ISlides[];
    swiper?: SwiperConfigInterface;
    class?: string;
}

export const defaultParams: ISliderParams = {
    class: 'wlc-slider',
};
