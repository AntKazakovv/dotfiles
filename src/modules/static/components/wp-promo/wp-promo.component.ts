import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core';
import {WpPromoModel} from 'wlc-engine/modules/static/system/models/wp-promo.model';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';

import _map from 'lodash-es/map';
import _sortBy from 'lodash-es/sortBy';
import _assign from 'lodash-es/assign';

import * as Params from './wp-promo.params';

@Component({
    selector: '[wlc-wp-promo]',
    templateUrl: './wp-promo.component.html',
    styleUrls: ['./styles/wp-promo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WpPromoComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IWpPromoCParams;
    public $params: Params.IWpPromoCParams;
    public items: WpPromoModel[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWpPromoCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected staticService: StaticService,
        protected logService: LogService,
    ) {
        super(
            <IMixedParams<Params.IWpPromoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getItemsBySlug();
    }

    /**
     * Open modal with content from wordpress
     * @param {WpPromoModel} item - takes WpPromoModel
     * @returns {void} void
     */
    public openDescription(item: WpPromoModel): void {
        this.modalService.showModal(
            _assign({}, this.$params.modalSettings,
                {
                    modalTitle: item.title,
                    html: item.html,
                },
            ),
        );
    }

    /**
     * Sort items, large values are at the end of the list
     * @param {WpPromoModel[]} items - WpPromoModel array
     * @returns {WpPromoModel[]} items - returns sorted items
     */
    protected sortItemsBySortWeight(items: WpPromoModel[]): WpPromoModel[] {
        return _sortBy(items, 'sortWeight');
    }

    /**
     * Gets items from wordpress by passes category slug
     */
    protected async getItemsBySlug(): Promise<void> {
        try {
            const response = await this.staticService.getPostsListByCategorySlug(this.$params.categorySlug);
            this.items = this.sortItemsBySortWeight(this.prepareItems(response));
        } catch (error) {
            this.logService.sendLog({
                code: '5.0.4',
                from: {component: 'WpPromoComponent', method: 'getItemsBySlug'},
                data: error,
            });
        } finally {
            this.cdr.markForCheck();
        }
    }

    /**
     * Converts to WpPromoModel
     * @param {TextDataModel[]} items - takes TextDataModel array
     * @returns {WpPromoModel[]} items converted to WpPromoModel
     */
    protected prepareItems(items: TextDataModel[]): WpPromoModel[] {
        return _map(items, (item: TextDataModel) => {
            return new WpPromoModel(
                {component: 'WpPromoComponent', method: 'prepareItems'}, item, this.logService,
            );
        });
    }
}
