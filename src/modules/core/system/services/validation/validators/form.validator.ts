import {IValidatorSettings} from '../../validation/validation.service';

/**
 * Specific validators configs
 * Used for IFormComponent static configs
 */
export class FormValidators {
    static cpfPatternRegex = /^(?:\d{3}\.){2}\d{3}\-\d{2}$/;
    static regExpRegex = /(<\?)|(\?>)|(<\/?(.*)>)/gi;
    static readonly cnpPatternRegex = /\b[1-9]\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])/.source
        + /(?:0[1-9]|[1-3]\d|4[0-6]|51|52)\d{4}\b/.source;

    static get cpfPattern(): IValidatorSettings {
        return {
            name: 'pattern',
            text: gettext('CPF format is incorrect'),
            options: FormValidators.cpfPatternRegex,
        };
    }

    static get cityMinLength(): IValidatorSettings {
        return {
            name: 'minLength',
            text: gettext('The field must contain more than 2 characters'),
            options: 2,
        };
    };

    static get tagReg(): IValidatorSettings {
        return {
            name: 'regExp',
            text: gettext('Such constructions are prohibited'),
            options: FormValidators.regExpRegex,
        };
    };
    static get maxLength(): IValidatorSettings {
        return {
            name: 'maxLength',
            text: gettext('The field cannot contain more than 55 characters'),
            options: 55,
        };
    };
    static get emojiReg(): IValidatorSettings {
        return {
            name: 'regexpEmoji',
            text:  gettext('Such constructions are prohibited'),
            options: '',
        };
    };

    static get cnpPattern(): IValidatorSettings {
        return {
            name: 'pattern',
            options: FormValidators.cnpPatternRegex,
            text: gettext('CNP format is incorrect'),
        };
    }
}
