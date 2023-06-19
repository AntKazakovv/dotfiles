import {IValidatorSettings} from '../../validation/validation.service';

/**
 * Specific validators configs
 * Used for IFormComponent static configs
 */
export class FormValidators {
    static cpfPatternRegex = /^(?:\d{3}\.){2}\d{3}\-\d{2}$/;

    static get cpfPattern(): IValidatorSettings {
        return {
            name: 'pattern',
            options: FormValidators.cpfPatternRegex,
            text: gettext('CPF format is incorrect'),
        };
    }

    static get cityMinLength(): IValidatorSettings {
        return {
            name: 'minLength',
            text: gettext('Field length must be more than 2 characters'),
            options: 2,
        };
    };
}

/**
 * Validators functions
 */
export * from './email.validator';
export * from './letters.validator';
export * from './matchFields.validator';
export * from './new-password.validator';
export * from './regexp.validator';
export * from './required.validator';
export * from './loginEmail.validator';
export * from './email-or-phone.validator';
