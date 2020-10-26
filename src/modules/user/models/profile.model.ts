import {IExtProfile, IUserProfile} from 'wlc-engine/interfaces';
import {AbstractUserModel} from 'wlc-engine/modules/user/models/abstarct.model';

import {
    get as _get,
    reduce as _reduce,
    toString as _toString,
} from 'lodash';

export class UserProfile extends AbstractUserModel<IUserProfile> {

    constructor() {
        super();
    }

    public get address(): string {
        return this.data.address;
    }

    public get bankName(): string {
        return this.data.bankName;
    }

    public get bankNameText(): string {
        return this.data.bankNameText;
    }

    public get birthDay(): string {
        return this.data.birthDay;
    }

    public get birthMonth(): string {
        return this.data.birthMonth;
    }

    public get birthYear(): string {
        return this.data.birthYear;
    }

    public get branchCode(): string {
        return this.data.branchCode;
    }

    public get city(): string {
        return this.data.city;
    }

    public get countryCode(): string {
        return this.data.countryCode;
    }

    public get currency(): string {
        return this.data.currency || 'EUR';
    }

    public get currentPassword(): string {
        return this.data.currentPassword;
    }

    public get email(): string {
        return this.data.email;
    }

    public get emailVerified(): string {
        return this.data.emailVerified;
    }

    public get extProfile(): IExtProfile {
        return this.data.extProfile;
    }

    public get firstName(): string {
        return this.data.firstName;
    }

    public get gender(): string {
        return this.data.gender;
    }

    public get ibanNumber(): string {
        return this.data.ibanNumber;
    }

    public get idNumber(): string {
        return this.data.idNumber;
    }

    public get idUser(): string {
        return this.data.idUser;
    }

    public get lastName(): string {
        return this.data.lastName;
    }

    public get login(): string {
        return this.data.login;
    }

    public get newEmail(): string {
        return this.data.newEmail;
    }

    public get phoneAltCode(): string {
        return this.data.phoneAltCode;
    }

    public get phoneAltNumber(): string {
        return this.data.phoneAltNumber;
    }

    public get phoneCode(): string {
        return this.data.phoneCode;
    }

    public get phoneNumber(): string {
        return this.data.phoneNumber;
    }

    public get phoneVerified(): string {
        return this.data.phoneVerified;
    }

    public get postalCode(): string {
        return this.data.postalCode;
    }

    public get registrationBonus(): string {
        return this.data.registrationBonus;
    }

    public get swift(): string {
        return this.data.swift;
    }

    public get VerificationJobID(): string {
        return this.data.VerificationJobID;
    }

    public get VerificationSessionID(): string {
        return this.data.VerificationSessionID;
    }

    public get birthDate(): string {
        return this.data.birthDate;
    }

    public get newPassword(): string {
        return this.data.newPassword;
    }

    public get newPasswordRepeat(): string {
        return this.data.newPasswordRepeat;
    }

    public get password(): string {
        return this.data.password;
    }

    public get oddsStyle(): string {
        return this.data.oddsStyle;
    }
}
