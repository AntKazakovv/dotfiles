import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {StoreService} from 'wlc-engine/modules/store/system/services';
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category';
import * as Params from './store-title.params';

@Component({
    selector: '[wlc-store-title]',
    templateUrl: './store-title.component.html',
    styleUrls: ['./styles/store-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class StoreTitleComponent extends AbstractComponent implements OnInit, OnDestroy {

    public override $params: Params.IStoreTitleCParams;
    public title: string;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreTitleCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected storeService: StoreService,
        protected translateService: TranslateService,
        protected uiRouter: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IStoreTitleCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    protected async init(): Promise<void> {
        if (this.$params.type === 'store-category') {
            this.setTitleByCategory();

            this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, () => {
                this.setTitleByCategory();
            }, this.$destroy);

        } else {
            this.title = this.$params.common?.text;
        }
    }

    /**
     * Set title by category parameter of current state
     *
     * @returns {Promise<void>}
     */
    protected async setTitleByCategory(): Promise<void> {
        const category: StoreCategory = await this.storeService.getCategoryByState();
        if (category) {
            this.title = category.name(this.translateService.currentLang);
        } else {
            this.title = this.$params.common?.text;
        }
        this.cdr.detectChanges();
    }
}
