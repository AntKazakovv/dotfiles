import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {BehaviorSubject} from 'rxjs';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type TPasswordSecureLevel = 'low' | 'medium' | 'strong';
export type TValidationRule = IMinLengthRule | IRegexpRule;
export type THandlerName = 'minLength' | 'regexp';
export type THandlerParams = number | RegExp;

export interface IPasswordValidationListComponent extends IComponentParams<Theme, Type, ThemeMod> {
    /**
     * Which set of rules from the validationRules constant to use.
     * It depends on the PasswordSecureLevel from the backend config.
     */
    passwordSecureLevel?: TPasswordSecureLevel,
    /**
     * Custom validation rules.
     */
    validationRules?: TValidationRule[],
}

export interface IRule {
    /**
     *  Name of rule handler.
     */
    handlerName: THandlerName,
    /**
     *  Params for handler.
     */
    handlerParams: THandlerParams,
    /**
     *  Text of the rule.
     */
    text: string,
    /**
     *  It changes after checking.
     */
    valid?: BehaviorSubject<boolean>,
}

export interface IMinLengthRule extends IRule {
    handlerName: 'minLength',
    handlerParams: number,
}

export interface IRegexpRule extends IRule {
    handlerName: 'regexp',
    handlerParams: RegExp,
}

export const defaultParams: IPasswordValidationListComponent = {
    moduleName: 'core',
    componentName: 'wlc-password-validation-list',
    class: 'wlc-password-validation-list',
    passwordSecureLevel: 'medium',
};
