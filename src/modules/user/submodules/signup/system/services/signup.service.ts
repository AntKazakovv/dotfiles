import {Injectable} from '@angular/core';

import _findLastIndex from 'lodash-es/findLastIndex';
import _keys from 'lodash-es/keys';

import {
    FormElements,
    IUserProfile,
    IValidateData,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';

import {IDataForModification} from 'wlc-engine/modules/user/submodules/signup/system/interfaces/signup.interface';

@Injectable({
    providedIn: 'root',
})
export class SignUpService {
    constructor(
        private configService: ConfigService,
    ){}

    /**
     * Set a registration form elements for license
     *
     * @param {IDataForModification} data
     * @returns void
     */
    public static modifyFormByLicense(data: IDataForModification): void {
        if (data.enableRequirement) {

            const components = data.config.components.slice();

            const getInsertIndex = (): number => {
                const lastCheckbox = _findLastIndex(
                    data.config.components,
                    (item) => item.name === 'core.wlc-checkbox',
                );
                return lastCheckbox === -1
                    ? data.config.components.length
                    : lastCheckbox + data.shift;
            };

            if (_findLastIndex(components, (item) => item.params.name === 'agreeWithSelfExcluded') === -1) {
                components.splice(
                    getInsertIndex(),
                    0,
                    {
                        name: 'core.wlc-checkbox',
                        params: {
                            name: 'agreeWithSelfExcluded',
                            text: data.selfExcludedText
                                || gettext('I have not self-excluded from any gambling website in the past 12 months'),
                            wlcElement: 'block_self_excluded',
                            common: {
                                customModifiers: 'self-exclude',
                            },
                            validators: ['requiredTrue'],
                        },
                    },
                );
            }

            if (_findLastIndex(components, (item) => item.params.name === 'agreedWithTermsAndConditions') === -1) {
                components.splice(getInsertIndex(), 0, FormElements.terms);
            }

            if (_findLastIndex(components, (item) => item.params.name === 'ageConfirmed') === -1) {
                components.splice(getInsertIndex(), 0, FormElements.age);
            }

            data.config.components = components;
        }
    }

    public prepareRegData(data: Partial<IUserProfile>): IValidateData {
        const formData: IValidateData = {
            'TYPE': 'user-register',
            data,
            fields: _keys(data),
        };

        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

        if (chosenBonus?.id) {
            formData.data.registrationBonus = String(chosenBonus.id);
            formData.fields.push('registrationBonus');
        }

        return formData;
    }
}
