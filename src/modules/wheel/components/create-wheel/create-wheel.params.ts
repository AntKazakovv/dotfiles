import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    IInputCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ICreateWheelCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    pathIllustration?: string;
    titleModal?: string;
}

export const formConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        {
            name: 'core.wlc-input',
            alwaysNew: {
                saveValue: true,
            },
            params: <IInputCParams>{
                common: {
                    placeholder: gettext('Winning amount'),
                    customModifiers: 'right-shift',
                    maxLength: 55,
                },
                exampleValue: gettext('Enter amount'),
                theme: 'vertical',
                name: 'amount',
                showCurrency: true,
                prohibitedPattern: ProhibitedPatterns.notAmountSymbols,
                trimStartZeroes: true,
                customMod: ['amount'],
                numeric: {
                    use: true,
                    scale: 2,
                    unsignedOnly: true,
                    prohibitRadixAsFirst: true,
                },
                validators: [
                    'required',
                    'numberDecimal',
                ],
            },
        },
        {
            name: 'core.wlc-select',
            params: <ISelectCParams>{
                labelText: gettext('Duration'),
                theme: 'vertical',
                common: {
                    placeholder: gettext('Duration'),
                },
                locked: true,
                name: 'duration',
                validators: ['required'],
                items: [
                    {
                        title: gettext('0:20 sec'),
                        value: '0:20',
                    },
                    {
                        title: gettext('0:45 sec'),
                        value: '0:45',
                    },
                    {
                        title: gettext('1:30 min'),
                        value: '1:30',
                    },
                    {
                        title: gettext('3:00 min'),
                        value: '3:00',
                    },
                    {
                        title: gettext('6:00 min'),
                        value: '6:00',
                    },
                ],
            },
        },
        {
            name: 'core.wlc-select',
            params: <ISelectCParams>{
                labelText: gettext('Winners'),
                common: {
                    placeholder: gettext('Winners'),
                },
                locked: true,
                theme: 'vertical',
                name: 'winners',
                validators: ['required'],
                items: [
                    {
                        title: '1',
                        value: '1',
                    },
                    {
                        title: '2',
                        value: '2',
                    },
                    {
                        title: '3',
                        value: '3',
                    },
                    {
                        title: '4',
                        value: '4',
                    },
                    {
                        title: '5',
                        value: '5',
                    },
                    {
                        title: '6',
                        value: '6',
                    },
                    {
                        title: '7',
                        value: '7',
                    },
                    {
                        title: '8',
                        value: '8',
                    },
                    {
                        title: '9',
                        value: '9',
                    },
                    {
                        title: '10',
                        value: '10',
                    },
                ],
            },
        },
        {
            name: 'core.wlc-button',
            params: {
                wlcElement: 'button_submit',
                common: {
                    typeAttr: 'submit',
                    text: gettext('Start'),
                },
            },
        },
    ],
};

export const defaultParams: ICreateWheelCParams = {
    moduleName: 'wheel',
    componentName: 'wlc-create-wheel',
    class: 'wlc-create-wheel',
    pathIllustration: '/wlc/prize-wheel/roulette_rabbit.png',
    titleModal: gettext('Raffle settings'),
};
