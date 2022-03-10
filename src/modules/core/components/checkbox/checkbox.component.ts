import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';


import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';

import * as Params from './checkbox.params';

import _union from 'lodash-es/union';
import _kebabCase from 'lodash-es/kebabCase';

export interface ILegalAge {
    age: number;
}

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
    public legalAge: ILegalAge;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICheckboxCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
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
        this.legalAge = {
            age: this.configService.get('$base.profile.legalAge') || 18,
        };
    }

    public showModal(name: string, slug: string): void {
        this.modalService.showModal(name, {slug, parseAsPlainHTML: true});
    }

    public onChange(event: Event): void {
        this.control?.markAllAsTouched();
        const checked: boolean = (event.target as HTMLInputElement).checked;
        if (this.$params.onChange) {
            this.$params.onChange(checked);
        }
    }

    // TODO move to abstract class
    private prepareModifiers(): void {

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
