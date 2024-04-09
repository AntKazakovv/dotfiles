import {
    CustomType,
    IButtonCParams,
    IComponentParams,
    IInputCParams,
    ValidatorType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IAmountFieldComponent extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Input params */
    amount: IInputCParams,
    /** Validators for amount */
    validators: ValidatorType[],
    /** Decrement button params */
    decrementButton: IButtonCParams,
    /** Increment button params */
    incrementButton: IButtonCParams,
    /** Min value for decrement.
     *  If it is not defined, min value will be equal 'min' validator value or 0
     * */
    minValue?: number,
    /** Max value for increment.
     *  If it is not defined, max value will be equal 'max' validator value or Infinity
     * */
    maxValue?: number,
    /** Decrement and Increment step.
     *  If it is not defined, step value will be equal decrement min value or 1
     * */
    stepValue?: number,
}

export const defaultParams: Partial<IAmountFieldComponent> = {
    class: 'wlc-amount-field',
    componentName: 'wlc-amount-field',
    moduleName: 'extra-forms',
    decrementButton: {
        common: {
            iconPath: '/wlc/icons/withdraw-icon.svg',
        },
    },
    incrementButton: {
        common: {
            iconPath: '/wlc/icons/deposit-icon.svg',
        },
    },
};
