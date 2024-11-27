import {UntypedFormControl} from '@angular/forms';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    IComponentParams,
    CustomType,
    GlobalHelper,
    FormElements,
} from 'wlc-engine/modules/core';
import {Marathon} from 'wlc-engine/modules/tournaments/system/models/marathon.model';
import {IPromoCodeLinkCParams} from 'wlc-engine/modules/core/components/promocode-link/promocode-link.params';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IMarathonBannerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    marathon?: Marathon,
    imagePathMain?: string,
    timerText?: string,
    promoCodeLinkParams?: IPromoCodeLinkCParams,
    updateMarathonFn?: Function,
}

export const defaultParams: IMarathonBannerCParams = {
    moduleName: 'tournaments',
    componentName: 'wlc-marathon-banner',
    class: 'wlc-marathon-banner',
    imagePathMain: GlobalHelper.gstaticUrl + '/wlc/tournaments/marathon/banner-main.jpg',
    timerText: gettext('Time remaining:'),
    promoCodeLinkParams: {
        registrationPromoCode: {
            name: 'registrationPromoCode',
            theme: 'default',
            wlcElement: 'block_promocode',
            common: {
                placeholder: gettext('Enter promo code'),
                customModifiers: 'promocode',
                useLabel: false,
            },
            control: new UntypedFormControl(''),
        },
        linkPromoCode: {
            btnWithArrow: false,
        },
        ..._cloneDeep(FormElements.promocodeWithLink.params),
    },
};
