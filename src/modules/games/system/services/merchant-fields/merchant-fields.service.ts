import {Injectable} from '@angular/core';

import {UserService} from 'wlc-engine/modules/user/system/services';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import {
    get as _get,
    concat as _concat,
    isArray as _isArray,
    sortedUniq as _sortedUniq,
    forEach as _forEach,
    includes as _includes,
    filter as _filter,
} from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class MerchantFieldsService {
    private profileFields = [
        'countryCode',
        'gender',
        'firstName',
        'lastName',
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
        protected configService: ConfigService,
        protected userService: UserService,
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
            if (!this.userService.isAuthenticated || !requiredFields.length) {
                resolve();
            } else {
                try {
                    const profile: UserProfile = this.userService.userProfile;
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

        const res = _sortedUniq<string>(merchantFields.concat(profileFields).sort());
        return _sortedUniq<string>(merchantFields.concat(profileFields).sort());
    }

    /**
     * Get merchant required fields
     *
     * @param {number} merchantId Merchant id
     * @returns {string[]} Fields names
     */
    public getMerchantRequiredFields(merchantId: number): string[] {
        const fields = this.configService.get<string[]>(`appConfig.siteconfig.systemsGamePlayInfo[${merchantId}].Fields`) || [];
        const requiredFields: string[] = [];

        _forEach(fields, (field: string) => {
            const realField: string = _get(this.fieldsByAlias, field);
            if (realField) {
                requiredFields.push(realField);
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
        const profile: UserProfile = this.userService.userProfile;
        _forEach(requiredFields, (field) => {
            if (!profile.hasField(field) && profile.fieldIsEmpty(field)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length) {
            const merchantFields: string[] = this.getMerchantRequiredFields(merchantId);
            const checkFields = _filter(emptyFields, (field: string) => {
                return _includes(merchantFields, field);
            });
            if (!checkFields.length) {
                return [];
            }
        }
        return emptyFields;
    }

}
