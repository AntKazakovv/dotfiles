import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    IButtonCParams,
    ICheckboxCParams,
    IFormComponent,
    IFormWrapperCParams,
    IInputCParams,
    IRadioButtonsCParams,
    IWrapperCParams,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

const copyElem = (el: IFormComponent): IFormComponent => {
    return _cloneDeep(el);
};

const unlock = (el: IFormComponent): IFormComponent => {
    return _merge({}, el, {
        params: _merge(el.params, {locked: false}),
    });
};

const addRequired = (el: IFormComponent): IFormComponent => {
    return _merge({}, el, {
        params: _merge(el.params, {
            validators: [...el.params.validators, 'required'],
        }),
    });
};

const newTitleSecond = (title: string): IFormComponent => {
    return {
        name: 'core.wlc-title',
        params: {
            secondText: title,
        },
    };
};

const wrapBlock = (divider: boolean, components: IFormComponent[]): IFormComponent => {
    return {
        name: 'core.wlc-wrapper',
        params: {
            class: 'form-questionnaire__block ' + (divider ? 'form-questionnaire__block--divider' : ''),
            components,
        },
    };
};

const wrapForm = (components: IFormComponent[], validators?: ValidatorType[]): IFormWrapperCParams => {
    return {
        class: 'form-questionnaire',
        components,
        validators: validators,
    };
};

const btnBlock = (text: string = gettext('Next'), themeMod: string = 'secondary'): IFormComponent => {
    return {
        name: 'core.wlc-wrapper',
        params: <IWrapperCParams>{
            class: 'form-questionnaire__bottom',
            components: [
                {
                    name: 'core.wlc-button',
                    params: <IButtonCParams>{
                        themeMod: themeMod,
                        common: {
                            text: text,
                            typeAttr: 'submit',
                        },
                    },
                },
            ],
        },
    };
};

const newInput = (
    name: string,
    placeholder: string,
    hint?: string,
    validators: ValidatorType[] = ['required'],
): IFormComponent => {
    return {
        name: 'core.wlc-input',
        params: <IInputCParams>{
            theme: 'vertical',
            name: name,
            common: {placeholder: placeholder},
            locked: false,
            validators: validators,
            customMod: [name],
            bottomHint: hint,
        },
    };
};

const newCheckbox = (name: string, text: string): IFormComponent => {
    return {
        name: 'core.wlc-checkbox',
        params: <ICheckboxCParams> {
            name: name,
            themeMod: 'align-top',
            value: null,
            text: gettext(text),
        },
    };
};

export const kycQStepsConfig = {
    step1: wrapForm([
        wrapBlock(true, [
            newTitleSecond(gettext('Main info')),
            unlock(copyElem(FormElements.firstName)),
            unlock(copyElem(FormElements.lastName)),
            unlock(copyElem(FormElements.birthDate)),
            newInput('nationality', gettext('Nationality'), null, ['required', 'allowLettersOnly']),
        ]),
        wrapBlock(true, [
            newTitleSecond(gettext('Residential address')),
            unlock(copyElem(FormElements.country)),
            unlock(copyElem(FormElements.postalCode)),
            addRequired(unlock(copyElem(FormElements.city))),
            unlock(copyElem(FormElements.address)),
        ]),
        wrapBlock(false, [
            newTitleSecond(gettext('Please select your employment status:')),
            {
                name: 'core.wlc-radio-buttons',
                params: <IRadioButtonsCParams>{
                    name: 'employmentStatus',
                    theme: 'default',
                    themeMod: 'vertical',
                    defaultValue: null,
                    items: [
                        {value: 'Employed', title: gettext('Employed')},
                        {value: 'Self-Employed', title: gettext('Self-employed')},
                        {value: 'Other', title: gettext('Other')},
                    ],
                    validators: ['required'],
                    locked: false,
                    customMod: ['employmentStatus'],
                },
            },
        ]),
        btnBlock(),
    ]),
    step2employed: wrapForm([
        wrapBlock(false, [
            newTitleSecond(gettext('Place of employment')),
            newInput('employedCompanyName', gettext('Company name')),
            newInput('employedRegistrationNumber', gettext('Registration number')),
            newInput('employedRegisteredAddress', gettext('Registered address')),
        ]),
        btnBlock(),
    ]),
    step2selfEmployed: wrapForm([
        wrapBlock(true, [
            newTitleSecond(gettext('Employment status')),
            newInput('selfEmployedRegisteredName', gettext('Registered name')),
            newInput('selfEmployedRegistrationNumber', gettext('Registration number')),
            newInput('selfEmployedRegisteredAddress', gettext('Registered address')),
            newInput('selfEmployedIndustry', gettext('Field of activity'),
                gettext('(e.g. IT, healthcare, beauty, education, etc.)')),
        ]),
        wrapBlock(false, [
            newTitleSecond(gettext('Optional fields')),
            newInput('placeOfBusiness', gettext('Actual address'),
                gettext('(If it differs from the registered address)'), null),

        ]),
        btnBlock(),
    ]),
    step2other: wrapForm([
        wrapBlock(false, [
            newInput('employmentOtherDetails', gettext('Information'),
                gettext('e.g. maternity leave, unemployment, etc.')),
        ]),
        btnBlock(),
    ]),
    step3: wrapForm([
        wrapBlock(false, [
            newTitleSecond(gettext('The expected source of funds to be used:')),
            newCheckbox('fundsSourceSalary', 'Salary'),
            newCheckbox('fundsSourceDividends', 'Dividends'),
            newCheckbox('fundsSourceInheritance', 'Inheritance'),
            newCheckbox('fundsSourceBusinessProfits', 'Business profits'),
            newCheckbox('fundsSourceInvestmentActivities', 'Income from investment activities'),
            newCheckbox('fundsSourceDonation', 'Donation'),
            {
                name: 'core.wlc-checkbox-with-input',
                params: {
                    name: ['fundsSourceAssets','typeOfAssets'],
                    checkboxParams: {
                        name: 'fundsSourceAssets',
                        text: gettext('Sale of assets'),
                        value: null,
                    },
                    inputParams: {
                        name: 'typeOfAssets',
                        common: {
                            placeholder: gettext('Type of assets'),
                        },
                    },
                },
            },
            {
                name: 'core.wlc-checkbox-with-input',
                params: {
                    name: ['fundsSourceOther','otherFundsInfo'],
                    checkboxParams: {
                        name: 'fundsSourceAssets',
                        text: gettext('Other'),
                        value: null,
                    },
                    inputParams: {
                        name: 'otherFundsInfo',
                        common: {
                            placeholder: gettext('Add info'),
                        },
                    },
                },
            },
        ]),
        btnBlock(),
    ], ['oneOrMoreRequired']),
    step4: wrapForm([
        wrapBlock(false, [
            newTitleSecond(gettext('Gross annual income (euros):')),
            {
                name: 'core.wlc-radio-buttons',
                params: <IRadioButtonsCParams>{
                    name: 'grossAnnualIncome',
                    theme: 'default',
                    themeMod: 'vertical',
                    defaultValue: null,
                    items: [
                        {value: 'Less than 10,000', title: gettext('Less than 10,000')},
                        {value: '10,000-50,000', title: gettext('10,000-50,000')},
                        {value: '50,000-100,000', title: gettext('50,000-100,000')},
                        {value: 'More than 100,000', title: gettext('More than 100,000')},
                    ],
                    validators: ['required'],
                    locked: false,
                    customMod: ['grossAnnualIncome'],
                },
            },
        ]),
        wrapBlock(false, [
            newTitleSecond(gettext('Planned monthly deposit amounts (euros):')),
            {
                name: 'core.wlc-radio-buttons',
                params: <IRadioButtonsCParams>{
                    name: 'plannedMonthlyDeposit',
                    theme: 'default',
                    themeMod: 'vertical',
                    defaultValue: null,
                    items: [
                        {value: 'Less than 5,000', title: gettext('Less than 5,000')},
                        {value: '5,000-10,000', title: gettext('5,000-10,000')},
                        {value: '10,000-50,000', title: gettext('10,000-50,000')},
                        {value: '50,000-100,000', title: gettext('50,000-100,000')},
                        {value: 'More than 100,000', title: gettext('More than 100,000')},
                    ],
                    validators: ['required'],
                    locked: false,
                    customMod: ['plannedMonthlyDeposit'],
                },
            },
        ]),
        wrapBlock(false, [
            {
                name: 'core.wlc-checkbox',
                params: {
                    name: 'soleBeneficialOwner',
                    customMod: ['soleBeneficialOwner'],
                    themeMod: 'align-top',
                    value: false,
                    text: gettext('I am the sole beneficial owner of'
                        + ' this account, and I also do not act on behalf of a third party and I am ' +
                        'not its representative.'),
                },
            },
            {
                name: 'core.wlc-checkbox',
                params: {
                    name: 'pepOrItsFamily',
                    customMod: ['pepOrItsFamily'],
                    themeMod: 'align-top',
                    checkboxType: 'legal-modal',
                    value: false,
                    common: {
                        customModifiers: 'terms',
                    },
                    textWithLink: {
                        prefix: gettext('I am a'),
                        linkText: gettext('Politically Exposed Person'),
                        suffix: gettext('(or a family member or a close associate of a PEP)'),
                        slug: 'kyc-pep',
                    },
                },
            },
            {
                name: 'core.wlc-checkbox',
                params: {
                    name: 'trueInformation',
                    customMod: ['trueInformation'],
                    themeMod: 'align-top',
                    value: false,
                    text: gettext('I confirm that the provided information is accurate,'
                        + ' correct and complete. I undertake to inform the Company in writing'
                        + ' of any changes to the previously provided information, as well as to update the'
                        + ' information on KYC questionnaire at the request of the Company. '
                        + 'I am aware that intentionally providing knowingly false information'
                        + ' is a criminal offense under the article 33 of the Gaming Act.'),
                },
            },
        ]),
        btnBlock(gettext('Send'), 'primary'),
    ]),
} as const;
