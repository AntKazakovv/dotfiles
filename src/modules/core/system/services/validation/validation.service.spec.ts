import {
    FormControl,
    FormGroup,
} from '@angular/forms';
import {
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ValidationService} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    emailValidator,
    matchingFieldsValidator,
    newPasswordValidator,
    onlyLettersValidator,
    requiredFieldValidator,
} from 'wlc-engine/modules/core/system/services/validation/validators';

describe('ValidationService', () => {
    let validationService: ValidationService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    let formControlEmail: FormControl;
    let formControlLogin: FormControl;
    let formControlPassword: FormControl;
    let formControlEmpty: FormControl;

    const validatorsNames: string[] = [
        'emailUnique', 'emailExist', 'loginUnique', 'password', 'requiredTrue',
        'minLength', 'maxLength', 'max', 'min', 'numberDecimal', 'pattern', 'allowLettersOnly', 'matchingFields',
        'email', 'onlyLetters', 'regExp', 'regexpEmoji', 'newPassword', 'required', 'loginEmail', 'login',
        'passwordLength', 'emailOrPhone',
    ];

    beforeEach(() => {
        dataServiceSpy = jasmine.createSpyObj(
            'DataService',
            ['request'],
        );
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['get'],
        );

        TestBed.configureTestingModule({
            providers: [
                ValidationService,
                {
                    provide: DataService,
                    useValue: dataServiceSpy,
                },
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
            ],
        });
        validationService = TestBed.inject(ValidationService);

        formControlEmail = new FormControl('mr.dmitry98@gmail.com');
        formControlLogin = new FormControl('login');
        formControlPassword = new FormControl('password');
        formControlEmpty = new FormControl();
    });

    it('-> should be created', () => {
        expect(validationService).toBeDefined();
    });

    it(' -> validatorList should have all this validators', () => {
        const validatorsList = Object.keys(validationService['validatorList']);

        validatorsNames.forEach(item => {
            expect(validatorsList.find(validator => item === validator)).toBe(item);
        });
        validatorsList.forEach(item => {
            expect(validatorsNames.find(validator => item === validator)).toBe(item);
        });
    });

    it('-> getValidator should return validator by passed name', () => {
        expect(validationService.getValidator('_no_existing_validator_')).toBeUndefined();

        validatorsNames.forEach(item => {
            expect(validationService.getValidator(item)).toEqual(validationService['validatorList'][item]);
        });
    });

    it('-> emailUnique should return null on uniq email and otherwise error', fakeAsync(() => {
        dataServiceSpy.request.and.resolveTo({
            data: {result: true},
        });
        validationService.emailUnique(formControlEmail)
            .subscribe((val) => {
                expect(val).toBeNull();
            });
        tick(validationService['delay']);
        dataServiceSpy.request.calls.reset();

        dataServiceSpy.request.and.resolveTo({
            data: {result: false},
        });
        validationService.emailUnique(formControlEmail)
            .subscribe((val) => {
                expect(val).toEqual({'email-not-unique': true});
            });
        tick(validationService['delay']);
        dataServiceSpy.request.calls.reset();

        configServiceSpy.get.withArgs('appConfig.hideEmailExistence').and.returnValue(true);
        validationService.emailUnique(formControlEmail)
            .subscribe((val) => {
                expect(val).toBeNull();
            });
        expect(dataServiceSpy.request).not.toHaveBeenCalled();
        tick(validationService['delay']);
        dataServiceSpy.request.calls.reset();
    }));

    it('-> emailExist should return error if response true and otherwise null', fakeAsync(() => {
        dataServiceSpy.request.and.resolveTo({
            data: {result: true},
        });
        validationService.emailExist(formControlEmail)
            .subscribe((val) => {
                expect(val).toEqual({'email-not-exist': true});
            });
        tick(validationService['delay']);
        dataServiceSpy.request.calls.reset();

        dataServiceSpy.request.and.resolveTo({
            data: {result: false},
        });
        validationService.emailExist(formControlEmail)
            .subscribe((val) => {
                expect(val).toEqual(null);
            });
        tick(validationService['delay']);
        dataServiceSpy.request.calls.reset();
    }));

    it('-> loginUnique should return null if response true and otherwise error', () => {
        dataServiceSpy.request.and.resolveTo({
            data: {result: true},
        });
        validationService.loginUnique(formControlLogin).then((data) => {
            expect(data).toBe(null);
        });
        dataServiceSpy.request.calls.reset();

        dataServiceSpy.request.and.resolveTo({
            data: {result: false},
        });
        validationService.loginUnique(formControlLogin).then((data) => {
            expect(data).toEqual({'login-not-unique': true});
        });
        dataServiceSpy.request.calls.reset();
    });

    it('-> passwordRule should return null if value is empty/response is true and otherwise error', () => {
        validationService.passwordRule(formControlEmpty).then((data) => {
            expect(data).toBeNull();
        });

        dataServiceSpy.request.and.resolveTo({
            data: {result: true},
        });
        validationService.passwordRule(formControlPassword).then((data) => {
            expect(data).toBeNull();
        });

        dataServiceSpy.request.and.resolveTo({
            data: {result: false},
        });
        validationService.passwordRule(formControlPassword).then((data) => {
            expect(data).toEqual({'password': true});
        });
    });

    it('-> emailValidator should return null if value is empty/correctEmail and otherwise error', () => {
        expect(emailValidator(formControlEmpty)).toBeNull();
        expect(emailValidator(formControlEmail)).toBeNull();

        formControlEmail.setValue('incorrect~email/.,123_-!.,');
        expect(emailValidator(formControlEmail)).toEqual({'email': true});
    });

    it('-> onlyLettersValidator should return null on containing only letters and otherwise error', () => {
        formControlEmpty.setValue('not_only_letters_1');
        expect(onlyLettersValidator(formControlEmpty)).toEqual({'onlyLetters': true});

        formControlEmpty.setValue('onlyLetters');
        expect(onlyLettersValidator(formControlEmpty)).toBeNull();
    });

    it('-> newPasswordValidator should return null on correct value and otherwise error', () => {
        const incorrectValues: string[] = [
            'test',
            'TEST',
            '123',
        ];

        incorrectValues.forEach(item => {
            formControlEmpty.setValue(item);
            expect(newPasswordValidator(formControlEmpty)).toEqual({newPasswordReg: null});
        });

        const correctValues: string[] = [
            'Test1!',
            'tesT2@',
            'tEst3&',
        ];

        correctValues.forEach(item => {
            formControlEmpty.setValue(item);
            expect(newPasswordValidator(formControlEmpty)).toBeNull();
        });
    });

    it('-> requiredFieldValidator should return error if it touched and has no value and otherwise null', () => {
        formControlEmpty.markAsTouched();
        expect(requiredFieldValidator(formControlEmpty)).toEqual({'required': true});

        formControlEmpty.setValue('some_value');
        expect(requiredFieldValidator(formControlEmpty)).toBeNull();
    });

    it('-> matchingFieldsValidator should set error on second passed field and otherwise null', () => {
        const sameText: string = 'value';

        const firstControl: FormControl = new FormControl(sameText);
        const secondControl: FormControl = new FormControl('value_not_same');
        const formGroup: FormGroup = new FormGroup({firstControl, secondControl});
        matchingFieldsValidator(['firstControl', 'secondControl'])(formGroup);
        expect(secondControl.errors).toEqual({'mustMatch': true});

        secondControl.setValue(sameText);
        matchingFieldsValidator(['firstControl', 'secondControl'])(formGroup);
        expect(secondControl.errors).toBeNull();
    });

    it('-> allowLettersOnly should return error on incorrect string pattern', () => {
        const incorrectValues: string[] = [
            'name[^d!"#$%&()*+,./:;<=>?@[]^_{|}~¡¿÷ˆ№]',
            '-name',
            'name--',
            'name_1234',
            '1234567890',
        ];

        incorrectValues.forEach(item => {
            const control = new FormControl(
                item,
                [validationService['validatorList'].allowLettersOnly.validator],
            );
            control.updateValueAndValidity();
            expect(control.errors.pattern.requiredPattern).toBeDefined();
        });

        const correctValues: string[] = [
            'only letters and spaces',
            'name-name',
            'name - name',
        ];

        correctValues.forEach(item => {
            const control2 = new FormControl(
                item,
                [validationService['validatorList'].allowLettersOnly.validator],
            );
            control2.updateValueAndValidity();
            expect(control2.errors).toBeNull();
        });
    });

    it('-> numberDecimal should return null on correct pattern', () => {
        const trueCases = ['4.20', '1545.1', '0.88', '4.1', '1'];
        trueCases.forEach(item => {
            const control = new FormControl(item, [validationService['validatorList'].numberDecimal.validator]);
            control.updateValueAndValidity();
            expect(control.errors).toBeNull();
        });

        const falseCases = ['t.e', '1,34', '1232,', '1.333', '3_fd', '5_5', '.', ','];
        falseCases.forEach(item => {
            const control2 = new FormControl(item, [validationService['validatorList'].numberDecimal.validator]);
            control2.updateValueAndValidity();
            expect(control2.errors.pattern.requiredPattern).toBeDefined();
        });
    });
});
