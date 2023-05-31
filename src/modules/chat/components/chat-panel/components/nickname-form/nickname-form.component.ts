import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormControl,
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import {KeyValue} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import {ChatHelper} from 'wlc-engine/modules/chat/system/classes/chat.helper';
import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {DialogModel} from 'wlc-engine/modules/chat/system/classes/dialog.model';
import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {TempAdapterService} from 'wlc-engine/modules/chat/system/services/temp-adapter.service';
export interface INicknameFormCParams {
    onSuccess?: () => void;
}

/**
 * TODO component is not required yet
 */
@Component({
    selector: '[wlc-nickname-form]',
    templateUrl: './nickname-form.component.html',
    styleUrls: ['./nickname-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NicknameFormComponent extends AbstractChatComponent implements OnInit {
    public form: UntypedFormGroup = new UntypedFormGroup({
        nickname: new UntypedFormControl('', [
            this.required(),
            this.hasEmoji(),
            this.hasForbiddenSymbols(),
            this.isCurrent(),
        ]),
    });

    public errors: ValidationErrors | null = null;

    constructor(
        @Inject('params') public params: INicknameFormCParams = {},
        @Inject('dialog') protected dialog: DialogModel<INicknameFormCParams>,
        protected chatService: ChatService,
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected tas: TempAdapterService,
    ) {
        super('wlc-nickname-form');
    }

    public ngOnInit(): void {
        this.form.controls['nickname'].statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((): void => {
                this.errors = this.form.controls['nickname'].errors;
                this.cdr.detectChanges();
            });
    }

    public trackByFn(i: number, val: KeyValue<string, string>): string {
        return val.key;
    }

    public async submitHandler(): Promise<void> {
        if (this.form.valid) {

            try {
                await this.tas.setNickname(this.form.controls['nickname'].value);
                this.tas.getNickname();

                if (this.params.onSuccess) {
                    this.params.onSuccess();
                }

                this.dialog.hide('component');
            } catch (error) {
                if (Array.isArray(error.errors)) {
                    this.form.controls['nickname'].setErrors(
                        error.errors.reduce((acc: Record<string, string>, v: string, i: string) => {
                            acc[i] = v;
                            return acc;
                        }, {}));
                } else {
                    this.errors = [gettext('Something went wrong. Please try again later.')];
                    this.cdr.detectChanges();
                }

            }
        }
    }

    protected required(): ValidatorFn {
        return (ctrl: AbstractControl): ValidationErrors | null => {
            return ctrl.value?.trim().length < 1 ? {
                'required': gettext('Value can\'t be empty'),
            } : null;
        };
    }

    protected hasEmoji(): ValidatorFn {
        return (ctrl: AbstractControl): ValidationErrors | null => {
            return ctrl.value && ChatHelper.emojiRegex.test(ctrl.value) ? {
                'hasEmoji': gettext('Value can\'t contain emoji'),
            } : null;
        };
    }

    protected hasForbiddenSymbols(): ValidatorFn {
        return (ctrl: AbstractControl): ValidationErrors | null => {
            return ctrl.value && ChatHelper.nicknameForbiddenSymbols.test(ctrl.value) ? {
                'hasForbiddenSymbols': this.translateService.instant('Value can\'t contain symbols:')
                    + ' \\t\\n\\r!"&\',./:<>?@',
            } : null;
        };
    }

    protected isCurrent(): ValidatorFn {
        return (ctrl: AbstractControl): ValidationErrors | null => {
            return ctrl.value && this.chatService.currentNickname && ctrl.value === this.chatService.currentNickname ? {
                'isCurrent': gettext('The new nickname cannot be the same as the current one'),
            } : null;
        };
    }
}
