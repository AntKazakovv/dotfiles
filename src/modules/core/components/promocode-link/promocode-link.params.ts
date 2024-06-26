import _cloneDeep from 'lodash-es/cloneDeep';

import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {ILinkBlockCParams} from 'wlc-engine/modules/core/components/link-block/link-block.params';
import {TFormCompositeComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IPromoCodeLinkCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod>,
    TFormCompositeComponent<'registrationPromoCode'> {
        linkPromoCode: ILinkBlockCParams;
        registrationPromoCode: IInputCParams;
};

export const defaultParams: Partial<IPromoCodeLinkCParams> = {
    class: 'wlc-promocode-link',
    componentName: 'wlc-promocode-link',
    moduleName: 'core',
    linkPromoCode: {
        wlcElement: 'block_link_promocode',
        themeMod: 'custom',
        common: {
            link: gettext('Have a promo code?'),
        },
    },
    registrationPromoCode: _cloneDeep(FormElements.promocode.params),
};
