import _assign from 'lodash-es/assign';
import _get from 'lodash-es/get';
import _toString from 'lodash-es/toString';
import _isString from 'lodash-es/isString';
import _isNil from 'lodash-es/isNil';

import {
    PepStatus,
    TUserType,
    IExtProfile,
    IUserProfile,
} from 'wlc-engine/modules/core';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core';
import {ICurrencyFilter} from 'wlc-engine/modules/multi-wallet';

import {IWebSocketConfig} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';
export class UserProfile extends AbstractModel<IUserProfile> {

    constructor(
        from: IFromLog,
    ) {
        super({from: _assign({model: 'UserProfile'}, from)});
        this.init();
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

    public get stateCode(): string {
        return this.data.stateCode;
    }

    public get originalCurrency(): string {
        return this.data.currency || 'EUR';
    }

    public get bonusCurrency(): string {
        return this.isConversionInFiat ? this.conversionCurrency : this.originalCurrency;
    }

    public get currency(): string {
        return this.isConversionInFiat ? this.conversionCurrency : this.selectedCurrency;
    }

    public get conversionCurrency(): string {
        return this.extProfile?.conversionCurrency?.currency;
    }

    public get isConversionInFiat(): boolean {
        return !!this.extProfile?.conversionCurrency?.conversionInFiat;
    }

    public get hideWalletsWithZeroBalance(): boolean {
        return this.extProfile?.conversionCurrency?.hideWalletsWithZeroBalance;
    }

    public get selectedCurrency(): string {
        return this.extProfile.currentWallet?.walletCurrency ?? this.originalCurrency;
    }

    public get unusedCurrencies(): ICurrencyFilter [] {
        return this.extProfile.unusedCurrencies;
    }

    public get email(): string {
        return this.data.email;
    }

    public get emailVerified(): boolean {
        return !!(+this.data.emailVerified);
    }

    public get emailAgree(): boolean {
        return this.data.emailAgree;
    }

    public get extProfile(): IExtProfile {
        if (Array.isArray(this.data.extProfile)) {
            return {};
        }

        return this.data.extProfile || {};
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
        return _toString(this.data.phoneNumber);
    }

    public get phoneVerified(): boolean {
        return !!(+this.data.phoneVerified);
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

    public get smsAgree(): boolean {
        return this.data.smsAgree;
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

    public get cpf(): string {
        return this.data.cpf;
    }

    public get oddsStyle(): string {
        return this.data.oddsStyle;
    }

    public get socketData(): IWebSocketConfig {
        return _isString(this.data.socketsData) ? null : this.data.socketsData;
    }

    public get logoutTime(): number {
        if (Array.isArray(this.data.extProfile)) {
            return null;
        }

        return this.data.extProfile?.logoutTime || null;
    }

    public get pep(): boolean | null {
        if (Array.isArray(this.data.extProfile)) {
            return null;
        }

        const value: PepStatus = this.data.extProfile?.pep;

        return _isNil(value)
            ? null
            : value === 'true' || value === true;
    }

    public get nick(): string {
        if (Array.isArray(this.data.extProfile)) {
            return '';
        }

        return this.data.extProfile.nick;
    }

    public get type(): TUserType {
        return this.data.type;
    }

    public hasField(field: string): boolean {
        return !!_get(this.data, field);
    }

    public fieldIsEmpty(field: string): boolean {
        return !_get(this.data, field);
    }

    protected init(): void {
        this.data = {
            address: '',
            bankName: '',
            bankNameText: '',
            birthDay: '',
            birthMonth: '',
            birthYear: '',
            branchCode: '',
            city: '',
            countryCode: '',
            currency: '',
            email: '',
            emailVerified: '',
            extProfile: {},
            firstName: '',
            gender: '',
            ibanNumber: '',
            idNumber: '',
            idUser: '',
            lastName: '',
            login: '',
            newEmail: '',
            phoneAltCode: '',
            phoneAltNumber: '',
            phoneCode: '',
            phoneNumber: '',
            phoneVerified: '',
            postalCode: '',
            registrationBonus: '',
            swift: '',
            VerificationJobID: '',
            VerificationSessionID: '',
            birthDate: '',
            oddsStyle: '',
        };
    }
}
