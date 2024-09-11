import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    OnChanges,
    SimpleChanges,
    SimpleChange,
} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
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
export class AccordionComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() public inlineParams: Params.IAccordionCParams;
    @Input() public expand$: Subject<void | number>;

    public items: Params.IAccordionData[];
    public ready: boolean = false;
    public override $params: Params.IAccordionCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAccordionCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.items = this.$params.items;
        this.ready = true;
        this.cdr.markForCheck();
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        const expandChanges: SimpleChange = changes['expand$'];

        if (expandChanges && expandChanges.firstChange) {
            expandChanges.currentValue.pipe(
                takeUntil(this.$destroy),
            ).subscribe((index: number): void =>  {
                this.expand(index);
            });
        }
    }

    /**
     * Open and close item
     *
     * @param item {Params.IAccordionData}
     * @returns {void}
     */
    public expandToggle(item: Params.IAccordionData): void {
        if (this.$params.collapseAll) {
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

    protected expand(index: number): void {
        if (this.items?.length) {
            const item: Params.IAccordionData = this.items[index || 0];
            if (item && !item.expand) {
                item.expand = true;
                this.cdr.markForCheck();
            }
        }
    }
}
