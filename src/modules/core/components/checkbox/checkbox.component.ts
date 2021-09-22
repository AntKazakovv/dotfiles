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
        this.control = this.$params?.control;
        this.prepareModifiers();
        this.fieldWlcElement = 'checkbox_' + _kebabCase(this.$params.name);
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
