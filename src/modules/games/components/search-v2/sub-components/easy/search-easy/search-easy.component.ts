import {
    Component,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {ISearchEasyCParams} from './search-easy.params';
import {
    SearchControllerEasy,
    SearchResultEasyComponent,
    SearchControlEasyComponent,
    SearchLastQueriesComponent,
} from 'wlc-engine/modules/games/components/search-v2';

import * as Params from './search-easy.params';

@Component({
    selector: '[wlc-search-easy]',
    templateUrl: './search-easy.component.html',
    styleUrls: ['./styles/search-easy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchEasyComponent extends AbstractComponent {
    protected controlPanelComponent: typeof SearchControlEasyComponent = this.$searchControllerEasy.controlPanel;
    protected resultBlockComponent: typeof SearchResultEasyComponent = this.$searchControllerEasy.searchResult;
    protected lastQueriesComponent: typeof SearchLastQueriesComponent = this.$searchControllerEasy.lastQueryList;
    protected titleText: string = this.$searchControllerEasy.props.titleText;
    protected recommendedText: string = this.$searchControllerEasy.props.recommendedText;

    constructor(
        @Inject('injectParams') protected injectParams: ISearchEasyCParams,
        @Inject (SearchControllerEasy) protected $searchControllerEasy: SearchControllerEasy,
        configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }
}
