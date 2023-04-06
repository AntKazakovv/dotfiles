import {IFinancesConfig} from '../interfaces/finances.interface';

export const financesConfig: IFinancesConfig = {
    fastDeposit: {
        use: false,
    },
    paymentInfo: {
        autoScroll: false,
        hiddenPaymentInfo: false,
    },
    paySystemCategories: {
        dropdownBefore: '(max-width: 479px)',
        categoriesConfig: {
            recommended: {
                name: gettext('Recommended'),
                order: 20,
            },
            card_method: {
                name: gettext('Bank Cards'),
                order: 16,
            },
            e_wallet: {
                name: gettext('E-Wallets'),
                order: 12,
            },
            crypto: {
                name: gettext('Cryptocurrencies'),
                order: 8,
            },
            direct_banking: {
                name: gettext('Bank Transfer'),
                order: 4,
            },
            other: {
                name: gettext('Other'),
                order: 0,
            },
        },
    },
    fieldsSettings: {
        additional: {
            withdraw_account: {
                default: {
                    validators: [
                        {
                            name: 'pattern',
                            options: '^[a-zA-Z0-9:]*$',
                            text: gettext('Cryptocurrency wallet address is incorrect'),
                        },
                        {
                            name: 'minLength',
                            options: 8,
                        },
                        {
                            name: 'maxLength',
                            text: gettext('The field must be no more than 255 characters long'),
                            options: 255,
                        },
                    ],
                },
            },
            accountNumber: {
                settings: [
                    {
                        tooltip: gettext('Please combine the 5 digit Branch number e.g.' +
                        ' “27370” with the 3 digit Financial institution number e.g. “001” ;' +
                        ' and the account number digit Account number e.g. “91011112”,' +
                        ' then you send to Inpay “273700019101112”. Please do not use Dash.'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 15,
                            },
                            {
                                name: 'maxLength',
                                options: 15,
                            },
                        ],
                        countries: ['can'],
                        systems:['inpay_withdraw'],
                    },
                    {
                        tooltip: gettext('Please combine branch code/BSB with the 7 account number and' +
                        ' 3 digit suffix. E.g. 6 digit BSB e.g. “020432”, Account number “6781299”,' +
                        ' Suffix “001” then you send to Inpay “0204326781299001”. Please do not use Dash.'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 15,
                            },
                            {
                                name: 'maxLength',
                                options: 16,
                            },
                        ],
                        countries: ['nzl'],
                        systems:['inpay_withdraw'],
                    },
                    {
                        tooltip: gettext('Please enter 11 digit numbers of CPF from RG ID card.' +
                        ' Please do not use Dash.'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 11,
                            },
                            {
                                name: 'maxLength',
                                options: 11,
                            },
                        ],
                        countries: ['bra'],
                        systems:['pagsmile_brazil'],
                    },
                ],
            },
            phone: {
                settings: [
                    {
                        tooltip: gettext('Phone number format: 79111111111'),
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                            {
                                name: 'minLength',
                                options: 11,
                            },
                            {
                                name: 'maxLength',
                                options: 11,
                            },
                        ],
                        systems:['paycos_k3_mobile_commerce'],
                    },
                ],
            },
            otp: {
                settings: [
                    {
                        validators: [
                            {
                                name: 'pattern',
                                options: '^[0-9:]*$',
                            },
                        ],
                        systems:['paycos_k3_mobile_commerce'],
                    },
                ],
            },
            ifsc: {
                settings: [
                    {
                        validators: [
                            {
                                name: 'minLength',
                                options: 11,
                            },
                            {
                                name: 'maxLength',
                                options: 11,
                            },
                        ],
                        systems:['runpay'],
                    },
                ],
            },
        },
    },
    fieldTemplatesNames: {
        firstName: {
            template: 'firstName',
            dbName: 'Name',
            label: 'First name',
        },
        lastName: {
            template: 'lastName',
            dbName: 'LastName',
            label: 'Last name',
        },
        birthDay: {
            template: 'birthDate',
            dbName: 'DateOfBirth',
            label: 'Date of birth',
        },
        gender: {
            template: 'gender',
            dbName: 'Gender',
            label: 'Gender',
        },
        idNumber: {
            template: 'idNumber',
            dbName: 'IDNumber',
            label: 'ID number',
        },
        countryCode: {
            template: 'country',
            dbName: 'IDCountry',
            label: 'Country',
        },
        stateCode: {
            template: 'state',
            dbName: 'IDState',
            label: 'State',
        },
        postalCode: {
            template: 'postalCode',
            dbName: 'PostalCode',
            label: 'Postal code',
        },
        city: {
            template: 'city',
            dbName: 'City',
            label: 'City',
        },
        address: {
            template: 'address',
            dbName: 'Address',
            label: 'Address',
        },
        bankName: {
            template: 'bankNameText',
            dbName: 'BankName',
            label: 'Bank name',
        },
        branchCode: {
            template: 'branchCode',
            dbName: 'BranchCode',
            label: 'Branch code',
        },
        swift: {
            template: 'swift',
            dbName: 'Swift',
            label: 'SWIFT',
        },
        ibanNumber: {
            template: 'ibanNumber',
            dbName: 'Iban',
            label: 'Iban number',
        },
        phoneNumber: {
            template: 'mobilePhone',
            dbName: 'Phone',
            label: 'Mobile phone',
        },
    },
};
