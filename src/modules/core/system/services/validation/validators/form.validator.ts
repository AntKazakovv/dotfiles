import {IValidatorSettings} from '../../validation/validation.service';

/**
 * Specific validators configs
 * Used for IFormComponent static configs
 */
export class FormValidators {
    static cpfPatternRegex = /^(?:\d{3}\.){2}\d{3}\-\d{2}$/;
    static regExpRegex = /(<\?)|(\?>)|(<\/?(.*)>)/gi;

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
            text: gettext('Field length must be more than 2 characters'),
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
            text: gettext('The field must be no more than 55 characters long'),
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
}
