import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewEncapsulation,
    ElementRef,
    HostBinding,
    AfterViewChecked,
    ViewChild,
} from '@angular/core';

import {fromEvent} from 'rxjs';
import {
    debounceTime,
    takeUntil,
} from 'rxjs/operators';
import _concat from 'lodash-es/concat';

import {
    LogService,
    ActionService,
    InjectionService,
    ColorThemeService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';
import {IconListAbstract} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {
    ILazyLoadingIntersectionObserver,
} from 'wlc-engine/modules/core/system/interfaces/base-config/optimization.interface';

import * as Params from './icon-list.params';

/**
 *  Component to display an icon list.
 *  Take a look at [IconModel]{@link IconModel} to clarify data for items.
 */
@Component({
    selector: '[wlc-icon-list]',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./styles/icon-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class IconListComponent extends IconListAbstract<Params.IIconListCParams> implements OnInit, AfterViewChecked {
    /** List of items being rendered. */

    public showContent: boolean = !this.isUseIntersectionObserver();
    public override $params: Params.IIconListCParams;
    protected wrapper: HTMLElement;
    protected resized: boolean = false;
    protected gamesCatalogService: GamesCatalogService;

    @Input() public items: IconModel[] = [];
    @Input() protected inlineParams: Params.IIconListCParams;
    @HostBinding('class.scrollable--left') protected scrollableLeft: boolean = false;
    @HostBinding('class.scrollable--right') protected scrollableRight: boolean = false;
    @ViewChild('wrapper') wrapperElement: ElementRef;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListCParams,
        protected logService: LogService,
        colorThemeService: ColorThemeService,
        protected actionService: ActionService,
        protected injectionService: InjectionService,
        private hostElement: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, colorThemeService);
    }

    /** Calls method based on the component theme */
    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.setCustomList();
        this.cdr.markForCheck();
    }

    public ngAfterViewChecked(): void {
        if (this.$params.watchForScroll) {
            this.scrollingCheck();
        }
    }

    public intersectingHandler(isIntersecting: boolean): void {
        if (isIntersecting && this.isUseIntersectionObserver()) {
            this.showContent = true;
            this.cdr.markForCheck();
        }
    }

    protected scrollingCheck(): void {

        if (!this.resized) {
            this.resized = true;

            this.actionService.windowResize()
                .pipe(takeUntil(this.$destroy))
                .pipe(debounceTime(300))
                .subscribe(() => {
                    this.scrollingCheck();
                });
        }


        if (!this.wrapper) {
            this.wrapper = this.wrapperElement.nativeElement
                || this.hostElement.nativeElement.querySelector(`.${this.$params.class || 'wlc-icon-list'}__wrapper`);

            fromEvent(this.wrapperElement.nativeElement, 'scroll')
                .pipe(takeUntil(this.$destroy))
                .pipe(debounceTime(300))
                .subscribe(() => {
                    this.scrollingCheck();
                });
        }

        const {clientWidth, scrollWidth, scrollLeft} = this.wrapperElement.nativeElement;

        this.scrollableLeft = !!scrollLeft;
        this.scrollableRight = (scrollWidth - clientWidth) > scrollLeft;
        this.cdr.markForCheck();
    }

    protected isUseIntersectionObserver(): boolean {
        const config = this.configService.get<ILazyLoadingIntersectionObserver>(
            '$base.optimization.lazyLoadingIntersectionObserver',
        );
        return config && config.use && config.components?.includes('icon-list');
    }

    /**
     * Creates the icon list.
     * Calls if `theme` is `custom`.
     * Based on `icons` param.
     * It wont work if theme merchants or payments, it works only for custom list as separate component
     **/
    protected setCustomList(): void {
        if (this.$params.theme === 'custom') {
            if (this.$params.items?.length) {
                this.items = _concat(
                    this.items,
                    this.getConvertedCustomList({component: 'IconListComponent', method: 'setCustomList'}),
                );
            } else {
                console.error('[wlc-icon-list] component requires "items" param on the custom theme');
            }
        }
    }
}
