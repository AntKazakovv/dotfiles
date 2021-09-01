import {Renderer2} from '@angular/core';
import {SwiperOptions} from 'swiper';

import _forEach from 'lodash-es/forEach';
import _keys from 'lodash-es/keys';
import _isEmpty from 'lodash-es/isEmpty';
import _findLast from 'lodash-es/findLast';
import _isNil from 'lodash-es/isNil';

export interface ISliderCssProps {
    slidesPerView?: string;
    spaceBetween?: string;
}

export class SliderHelper {

    /**
     * Returns active breakpoint for swiper breakpoint options.
     * Allows to get active breakpoint before swiper initialization.
     * @param swiperOptions Swiper params
     * @returns active breakpoint if it exists in swiper options breakpoints list
     */
    public static getActiveBreakpoint(swiperOptions: SwiperOptions): string {
        if (!_isEmpty(swiperOptions.breakpoints)) {
            return _findLast(_keys(swiperOptions.breakpoints), (breakpoint: string) => {
                return window?.matchMedia(`(min-width: ${breakpoint}px)`).matches;
            });
        }
    }

    /**
     * Sets css custom properties to the element according to `swiperOptions` and `cssProps`
     * @param swiperOptions Swiper params
     * @param cssProps contains list of css custom properties
     * for swiper params `{swiperProperty: --custom-css-property}`
     * @param element the element to which the css custom properties will be applied
     * @param renderer renderer 2
     */
    public static setPropsByBreakpoints(
        swiperOptions: SwiperOptions,
        cssProps: ISliderCssProps,
        element: Element,
        renderer: Renderer2,
    ): void {
        _forEach(cssProps, (prop: string, key: string) => {

            let value = swiperOptions[key];

            if (!_isNil(value)) {

                if (key === 'slidesPerView' && value === 'auto') {
                    return;
                }

                if (key === 'spaceBetween') {
                    value += 'px';
                }

                renderer.setStyle(element, prop, value, 2);
            }
        });
    }

}
