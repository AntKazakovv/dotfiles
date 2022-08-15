import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import _union from 'lodash-es/union';
import _kebabCase from 'lodash-es/kebabCase';
import _assign from 'lodash-es/assign';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {CheckBoxTexts} from 'wlc-engine/modules/core/system/classes/checkbox-text.class';
import {IBaseConfig} from 'wlc-engine/modules/core/system/interfaces';
import {IPostCParams} from 'wlc-engine/modules/static/components';

import * as Params from './checkbox.params';

@Component({
    selector: '[wlc-checkbox]',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./styles/checkbox.component.scss'],
})
export class CheckboxComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICheckboxCParams;
    public $params: Params.ICheckboxCParams;
    public control: FormControl;
    public fieldWlcElement: string;
    public textContext: Params.ICheckboxCParams['textContext'];
    public textWithLink: Params.ILegalCheckboxWithLink = {
        prefix: '',
        suffix: '',
        linkText: '',
        slug: '',
    };
    public checkboxType: 'default' | 'legal-modal' | 'legal-link' = 'default';

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICheckboxCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected checkBoxTexts: CheckBoxTexts,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.common?.checkedDefault) {
            this.$params.control?.setValue(true);
        }
        this.control = this.$params.control;
        this.prepareModifiers();
        this.fieldWlcElement = 'checkbox_' + _kebabCase(this.$params.name);
        this.textContext = this.$params.textContext;

        switch (this.$params.checkboxType) {
            case 'age':
                this.textContext = {
                    age: this.configService.get('$base.profile.legalAge') || 18,
                };
                this.$params.text ??= this.checkBoxTexts.get('ageCheckboxText') as string;
                break;

            case 'terms':
            case 'privacy-policy':
            case 'payment-rules':
                this.setLegalCheckboxParams(this.$params.checkboxType);
                break;

            case 'legal-link':
            case 'legal-modal':
                this.checkboxType = this.$params.checkboxType;
                break;
        }
    }

    public showModal(name: string, slug: string): void {
        this.modalService.showModal<IPostCParams>(name, {
            slug,
            parseAsPlainHTML: true,
            useDownloadButton: this.configService.get<string[]>('$base.postWithDownloadPDF')
                ?.includes(slug),
        });
    }

    public onChange(event: Event): void {
        this.control?.markAllAsTouched();
        const checked: boolean = (event.target as HTMLInputElement).checked;
        if (this.$params.onChange) {
            this.$params.onChange(checked);
        }
    }

    protected setLegalCheckboxParams(type: Exclude<Params.CheckboxType, 'age'>): void {
        let configKey: keyof IBaseConfig['legal'];

        switch (type) {
            case 'terms':
                configKey = 'termsCheckboxText';
                this.checkboxType = 'legal-modal';
                break;

            case 'payment-rules':
                configKey = 'paymentRulesText';
                this.checkboxType = 'legal-link';
                break;

            case 'privacy-policy':
                configKey = 'privacyPolicyText';
                this.checkboxType = 'legal-modal';
                break;
        }

        if (!configKey) {
            return;
        }

        this.textWithLink = _assign(
            {},
            this.checkBoxTexts.get(configKey) as Params.ILegalCheckboxWithLink,
            this.$params.textWithLink,
        );
    }

    // TODO move to abstract class
    protected prepareModifiers(): void {

        let modifiers: Params.Modifiers[] = [];
        if (this.$params.textSide) {
            modifiers.push(`text-${this.$params.textSide}`);
        }

        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }

        this.addModifiers(modifiers);
        this.cdr.markForCheck();
    }
}
