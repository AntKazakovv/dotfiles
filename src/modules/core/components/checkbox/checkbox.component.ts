import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './checkbox.params';

import {
    union as _union,
} from 'lodash-es';

@Component({
    selector: '[wlc-checkbox]',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./styles/checkbox.component.scss'],
})
export class CheckboxComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICheckboxCParams;
    public $params: Params.ICheckboxCParams;
    public control: FormControl;

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;
        this.prepareModifiers();
    }

    public showModal(name: string, slug: string): void {
        this.modalService.showModal(name, {slug});
    }

    protected onChange(event: Event): void {
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
