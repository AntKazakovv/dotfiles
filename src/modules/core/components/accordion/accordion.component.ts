import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import _forEach from 'lodash-es/forEach';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {HeightToggleAnimation} from 'wlc-engine/modules/core/system/animations/height-toggle.animation';

import * as Params from './accordion.params';

@Component({
    selector: '[wlc-accordion]',
    templateUrl: './accordion.component.html',
    styleUrls: ['./styles/accordion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: HeightToggleAnimation,
})
export class AccordionComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IAccordionCParams;

    public items: Params.IAccordionData[];
    public ready: boolean = false;
    public $params: Params.IAccordionCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAccordionCParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.items = this.$params.items;
        this.ready = true;
        this.cdr.markForCheck();
    }

    /**
     * Open and close item
     * 
     * @param item {Params.IAccordionData}
     * @returns {void}
     */
    public expandToggle(item: Params.IAccordionData): void {
        if(this.$params.collapseAll) {
            const prevState = item.expand;
            this.foldAll();
            item.expand = !prevState;
        } else {
            item.expand = !item.expand;
        }
    }

    protected foldAll(): void {
        _forEach(this.items, (item: Params.IAccordionData): void => {
            item.expand = false;
        });
    }
}
