import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import _uniq from 'lodash-es/uniq';
import _filter from 'lodash-es/filter';

import {
    ConfigService,
    IState,
    fieldNameByDbName,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';

@Injectable({
    providedIn: 'root',
})
export class MerchantFieldsService {

    private fieldsByAlias = {
        Country: 'countryCode',
    } as const;

    constructor(
        private configService: ConfigService,
    ) {}

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
                    const emptyFields: string[] = this.getEmptyFields(requiredFields);
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
     * Get required fields of merchant
     *
     * @param {number} merchantId Merchant id
     * @returns {string[]} Fields names
     */
    private getRequiredFields(merchantId: number): string[] {
        const merchantFields: string[] = this.getMerchantRequiredFields(merchantId);

        return _uniq<string>(merchantFields);
    }

    /**
     * Get merchant required fields
     *
     * @param {number} merchantId Merchant id
     * @returns {string[]} Fields names
     */
    private getMerchantRequiredFields(merchantId: number): string[] {
        const excludeFields = this.configService.get<string[]>(`$games.excludeRequiredFields.${merchantId}`) || [];

        const fields = _filter(
            this.configService.get<string[]>(`appConfig.siteconfig.systemsGamePlayInfo[${merchantId}].Fields`),
            (item) => {
                return !excludeFields.includes(item);
            },
        );

        let requiredFields: string[] = [];

        fields.forEach((field : string) => {
            const realField: string = fieldNameByDbName[field] || this.fieldsByAlias[field];
            if (realField) {
                requiredFields.push(realField);
            }
        });

        return requiredFields;
    }

    /**
     * Get empty required fields
     *
     * @param {string[]} requiredFields Required fields
     * @returns {string[]} Empty fields
     */
    private getEmptyFields(requiredFields: string[]): string[] {
        const profile: UserProfile = this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .getValue();

        let emptyFields: string[] = requiredFields.filter((field) => {
            return !profile.hasField(field) && profile.fieldIsEmpty(field);
        });

        if (emptyFields.includes('stateCode')
            && (emptyFields.includes('countryCode') || (profile.countryCode
                && !this.configService.get<BehaviorSubject<IState[]>>('states').getValue()[profile.countryCode]))
        ) {
            emptyFields = emptyFields.filter((field) => field !== 'stateCode');
        }

        return emptyFields;
    }
}
