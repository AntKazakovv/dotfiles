import {
    Inject,
    Injectable,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _uniq from 'lodash-es/uniq';
import _filter from 'lodash-es/filter';
import _concat from 'lodash-es/concat';
import _forEach from 'lodash-es/forEach';
import _isArray from 'lodash-es/isArray';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
import {IState} from 'wlc-engine/modules/core';
import {UserHelper} from 'wlc-engine/modules/user';

@Injectable({
    providedIn: 'root',
})
export class MerchantFieldsService {
    private profileFields = [
        'firstName',
        'lastName',
        'gender',
        'countryCode',
    ];
    private DateOfBirth = [
        'birthDay',
        'birthMonth',
        'birthYear',
    ];
    private fieldsByAlias = {
        DateOfBirth: this.DateOfBirth,
        Country: 'countryCode',
        City: 'city',
        Gender: 'gender',
        Name: 'firstName',
        LastName: 'lastName',
    };

    constructor(
        @Inject(CuracaoRequirement) protected enableRequirement: boolean,
        protected configService: ConfigService,
    ) {
        _concat(this.profileFields, this.DateOfBirth);
    }

    /**
     * Check required fields
     *
     * @param {number} merchantId
     * @returns {Promise<void>}
     */
    public checkRequiredFields(merchantId: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const requiredFields = this.getRequiredFields(merchantId);
            if (!this.configService.get<boolean>('$user.isAuthenticated') || !requiredFields.length) {
                resolve();
            } else {
                try {
                    const emptyFields: string[] = this.getEmptyFields(requiredFields, merchantId);
                    if (emptyFields.length) {
                        reject(emptyFields);
                    } else {
                        resolve();
                    }
                } catch {
                    resolve();
                }
            }
        });
    }

    /**
     * Get reuired fields of merchant
     *
     * @param {number} merchantId Merchant id
     * @returns {string[]} Fields names
     */
    public getRequiredFields(merchantId: number): string[] {
        const merchantFields: string[] = this.getMerchantRequiredFields(merchantId);
        const profileFields: string[] = this.getProfileRequiedFields();

        return _uniq<string>(profileFields.concat(merchantFields));
    }

    /**
     * Get merchant required fields
     *
     * @param {number} merchantId Merchant id
     * @returns {string[]} Fields names
     */
    public getMerchantRequiredFields(merchantId: number): string[] {
        const excludeFields = this.configService.get<string[]>(`$games.excludeRequiredFields.${merchantId}`) || [];

        const fields = _filter(
            this.configService.get<string[]>(`appConfig.siteconfig.systemsGamePlayInfo[${merchantId}].Fields`),
            (item) => {
                return !excludeFields.includes(item);
            },
        );

        let requiredFields: string[] = [];

        _forEach(fields, (field: string) => {
            const realField: string = _get(this.fieldsByAlias, field);
            if (realField) {
                if (_isArray(realField)) {
                    requiredFields = _concat(requiredFields, realField);
                } else {
                    requiredFields.push(realField);
                }
            }
        });
        return requiredFields;
    }

    /**
     * Get profile required fields
     *
     * @returns {string[]} Fields names
     */
    public getProfileRequiedFields(): string[] {
        if (this.enableRequirement) {
            return _concat(this.profileFields, UserHelper.requiredFieldsForCuracaoWlc);
        }

        return this.profileFields;
    }

    /**
     * Get empty required fields
     *
     * @param {string[]} requiredFields Required fields
     * @param {number} merchantId Merchant id
     * @returns {string[]} Empty fields
     */
    private getEmptyFields(requiredFields: string[], merchantId: number): string[] {
        const emptyFields: string[] = [];
        const profile: UserProfile = this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .getValue();
        _forEach(requiredFields, (field) => {
            if (!profile.hasField(field) && profile.fieldIsEmpty(field)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length) {
            const merchantFields: string[] = this.getMerchantRequiredFields(merchantId);
            if (this.enableRequirement) {
                return this.getEmptyFieldsWithCuracao(profile, emptyFields, merchantFields);
            }

            const checkFields = _filter(emptyFields, (field: string) => {
                return _includes(merchantFields, field);
            });

            if (!checkFields.length) {
                return [];
            }
        }
        return emptyFields;
    }

    private getEmptyFieldsWithCuracao(profile: UserProfile, emptyFields: string[], merchantFields: string[]) {
        let emptyFieldsWithCuracao: string[] = emptyFields;

        if (_includes(emptyFields, 'stateCode') && (_includes(emptyFields, 'countryCode')
            || (profile.countryCode
                && !this.configService.get<BehaviorSubject<IState[]>>('states')
                    .getValue()[profile.countryCode]))
        ) {
            emptyFieldsWithCuracao = _filter(emptyFieldsWithCuracao, (field) => field !== 'stateCode');
        }

        const merchantAndCuracaoField = _concat(UserHelper.requiredFieldsForCuracaoWlc, merchantFields);

        return _filter(emptyFieldsWithCuracao, ((field: string) => _includes(merchantAndCuracaoField, field))) ;
    }

}
