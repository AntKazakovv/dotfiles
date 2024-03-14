import {
    IMinLengthRule,
    IRegexpRule,
    THandlerName,
    TPasswordSecureLevel,
    TValidationRule,
} from 'wlc-engine/modules/core/components/password-validation-list/password-validation-list.params';

type IRuleHandlers = {
    [key in THandlerName]: (rule: TValidationRule, value: string) => void;
};

export const ruleHandlers: IRuleHandlers = {
    minLength: (rule: IMinLengthRule, value: string) => {
        rule.valid.next(value.length >= rule.handlerParams);
    },
    regexp: (rule: IRegexpRule, value: string) => {
        rule.valid.next(rule.handlerParams.test(value));
    },
};

export const validationRules: Partial<Record<TPasswordSecureLevel, TValidationRule[]>> = {
    'medium': [
        {
            handlerName: 'minLength',
            handlerParams: 6,
            text: gettext('The password length is at least 6 characters'),
        },
        {
            handlerName: 'regexp',
            handlerParams: /[A-Za-z]/,
            text: gettext('The password contains Latin letters'),
        },
        {
            handlerName: 'regexp',
            handlerParams: /\d/,
            text: gettext('The password contains digits'),
        },
        {
            handlerName: 'regexp',
            handlerParams: /^[\w!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~\-]+$/,
            text: gettext('The password contains only the letters of the Latin alphabet and digits'),
        },
    ],
};
