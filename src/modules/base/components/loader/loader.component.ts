import {
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import * as Params from './loader.params';

@Component({
    selector: '[wlc-loader]',
    templateUrl: './loader.component.html',
    styleUrls: ['./styles/loader.component.scss'],
})
export class LoaderComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILoaderComponentParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoaderComponentParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

}
