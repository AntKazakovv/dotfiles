import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export interface IDepositParams extends IComponentParams<Theme, Type, ThemeMod> {
    common?: {
        themeMod?: ThemeMod;
    };
}

export const defaultParams: IDepositParams = {

};

export const depositForm: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            params: {
                common: {
                    placeholder: 'Amount',
                },
                locked: true,
                name: 'amount',
                validators: ['required', {
                    name: 'regExp',
                    options: new RegExp('^[0-9]+$'),
                }],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                name: 'submit',
                common: {
                    text: 'Deposit',
                },
            },
        },
    ],
};
