import {
    Component,
    OnInit,
    Inject,
    Input,
    Renderer2,
    AfterViewInit,
    ElementRef,
    ViewChildren,
    QueryList,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {
    debounceTime,
    takeUntil,
} from 'rxjs';

import _each from 'lodash-es/each';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isEmpty from 'lodash-es/isEmpty';

import {
    ActionService,
    LayoutService,
} from 'wlc-engine/modules/core/system/services';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import * as Params from './preloader.params';

@Component({
    selector: '[wlc-preloader]',
    templateUrl: './preloader.component.html',
    styleUrls: ['./styles/preloader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreloaderComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @ViewChildren('element') elements: QueryList<ElementRef<HTMLElement>>;

    @Input() public inlineParams: Params.IPreloaderCParams;

    public override $params: Params.IPreloaderCParams;
    public block: Params.IPreloaderBlock;

    protected deepOfElements: number = 0;
    protected isEqualSize: boolean = false;
    protected isDisplay: boolean = false;

    constructor(
        @Inject('injectParams')
        protected injectParams: Params.IPreloaderCParams,
        protected actionService: ActionService,
        protected layoutService: LayoutService,
        protected renderer: Renderer2,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareBlock();
    }

    public ngAfterViewInit(): void {
        if (this.isEqualSize) {
            this.elements.changes.subscribe((items: QueryList<ElementRef<HTMLElement>>): void => {
                for (let elem of items.toArray()) {
                    this.setEqualSize(elem);
                }
            });
        }

        if (this.isDisplay) {
            this.actionService.windowResize()
                .pipe(
                    debounceTime(100),
                    takeUntil(this.$destroy),
                )
                .subscribe(() => {
                    this.deepOfElements = 0;
                    this.prepareBlock();
                    this.cdr.markForCheck();
                });
        }

        if (this.isDisplay || this.isEqualSize) {
            this.elements.notifyOnChanges();
        }
    }

    protected prepareBlock(): void {
        this.block = _cloneDeep(this.$params.block);
        this.block.elements = this.prepareElements(this.block.elements);
    }

    protected prepareElements(items: Params.IPreloaderElement[]): Params.IPreloaderElement[] {
        const mainClass: string = `${this.$params.class}__element`;
        const elementsCloned: IIndexing<Params.IPreloaderElement[]> = {};
        const elementsFiltered: Params.IPreloaderElement[] = this.layoutService.filterDisplayElements(items);
        let indexForCloned: number = 0;

        _each(elementsFiltered, (element: Params.IPreloaderElement, index) => {
            if (element.equalSize) {
                this.isEqualSize = true;
            }

            if (!_isEmpty(element.display)) {
                this.isDisplay = true;
            }

            element.customClass = `${mainClass} `
                                + `${mainClass}--${element.type} `
                                + `${element?.customClass || ''} `;

            if (this.deepOfElements === 0 && this.block.noContainer) {
                element.customClass += `${mainClass}--color-second `;
            }
            else {
                element.customClass += (this.deepOfElements % 2 > 0)
                    ? `${mainClass}--color-first `
                    : `${mainClass}--color-third `;
            }

            if (element.amount > 1) {
                elementsCloned[indexForCloned] = [];
                for (let i = 1; i < element.amount; i++) {
                    elementsCloned[indexForCloned].push(element);
                }
                indexForCloned += element.amount;
            } else {
                indexForCloned++;
            }

            if (element?.elements?.length) {
                this.deepOfElements++;
                element.elements = this.prepareElements(element.elements);
                if (index !== items.length - 1) {
                    this.deepOfElements--;
                }
            }
        });

        _each(elementsCloned, (value, index) => {
            elementsFiltered.splice(+index, 0, ...value);
        });

        return elementsFiltered;
    }

    protected setEqualSize(item: ElementRef<HTMLElement>): void {
        const equalSize: string = item.nativeElement.getAttribute('equalsize');
        if (equalSize) {
            const property = equalSize === 'width'
                ? item.nativeElement.clientHeight
                : item.nativeElement.clientWidth;

            this.renderer.setStyle(
                item.nativeElement,
                equalSize,
                `${property}px`,
            );
        }
    }
}
