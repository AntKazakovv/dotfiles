import {
    Injectable,
    OnDestroy,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    Subject,
    takeUntil,
} from 'rxjs';

import _cloneDeep from 'lodash-es/cloneDeep';

import {
    IPasswordValidationListComponent,
    TValidationRule,
} from 'wlc-engine/modules/core/components/password-validation-list/password-validation-list.params';
import {
    ruleHandlers,
    validationRules,
} from 'wlc-engine/modules/core/components/password-validation-list/params/rules';

@Injectable()
export class PasswordValidationListController implements OnDestroy {
    protected componentParams: IPasswordValidationListComponent;
    protected destroy$: Subject<void> = new Subject();

    public setParams(params: IPasswordValidationListComponent): PasswordValidationListController {
        this.componentParams = params;
        return this;
    }

    public registerRules(control: UntypedFormControl): void {
        if (!this.componentParams.validationRules && this.componentParams.passwordSecureLevel) {
            this.componentParams.validationRules = _cloneDeep(
                validationRules[this.componentParams.passwordSecureLevel],
            );
        }

        if (!this.componentParams.validationRules?.length) {
            return;
        }

        this.componentParams.validationRules.forEach((rule: TValidationRule) => {
            rule.valid = new BehaviorSubject(false);
        });

        this.checkRules(control.value);

        control.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroy$),
        ).subscribe((value) => {
            this.checkRules(value);
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected checkRules(value: string): void  {
        this.componentParams.validationRules.forEach((rule: TValidationRule) => {
            if (ruleHandlers[rule.handlerName]) {
                ruleHandlers[rule.handlerName](rule, value);
            }
        });
    }
}
