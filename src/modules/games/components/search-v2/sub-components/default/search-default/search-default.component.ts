import {
    Component,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {ISearchDefaultCParams} from './search-default.params';
import {
    SearchControllerDefault,
    SearchResultComponent,
    SearchControlComponent,
} from 'wlc-engine/modules/games/components/search-v2';

import * as Params from './search-default.params';

@Component({
    selector: '[wlc-search-default]',
    templateUrl: './search-default.component.html',
    styleUrls: ['./styles/search-default.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDefaultComponent extends AbstractComponent {
    protected controlPanelComponent: typeof SearchControlComponent = this.$searchControllerDefault.controlPanel;
    protected resultBlockComponent: typeof SearchResultComponent = this.$searchControllerDefault.searchResult;
    protected titleText: string = this.$searchControllerDefault.props.titleText;

    constructor(
        @Inject('injectParams') protected injectParams: ISearchDefaultCParams,
        @Inject (SearchControllerDefault) protected $searchControllerDefault: SearchControllerDefault,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        });
    }
}
