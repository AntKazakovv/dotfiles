import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    AfterViewInit,
    inject,
    DestroyRef,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {
    distinctUntilChanged,
    tap,
} from 'rxjs/operators';
import _kebabCase from 'lodash-es/kebabCase';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './textarea.params';

/**
 * Component textarea
 *
 * @example
 *
 * {
 *     name: 'core.wlc-textarea',
 * }
 *
 */

@Component({
    selector: '[wlc-textarea]',
    templateUrl: './textarea.component.html',
    styleUrls: ['./styles/textarea.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.ITextareaCParams;
    public override $params: Params.ITextareaCParams;
    public control: UntypedFormControl;
    public fieldWlcElement: string;
    protected destroyRef = inject(DestroyRef);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITextareaCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
        this.fieldWlcElement = 'textarea_' + _kebabCase(this.$params.name);
    }

    public ngAfterViewInit(): void {
        this.control.valueChanges
            .pipe(
                distinctUntilChanged(),
                tap((v: string) =>  {
                    this.control.setValue(v.trimStart());
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    public isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }

    /**
     * Handler for input event
     */
    public onInput(): void {
        this.control.markAsTouched();
    }

    /**
     * Handler for blur event
     */
    public onBlur(): void {
        this.control.patchValue(this.control.value, {emitEvent: false, emitModelToViewChange: true});

        if (!this.control.touched || !this.control.valid) {
            this.control.updateValueAndValidity();
            this.cdr.markForCheck();
        }
    }
}
