import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef,
    OnChanges,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './betradar-no-content.params';

@Component({
    selector: '[wlc-betradar-no-content]',
    templateUrl: './betradar-no-content.component.html',
    styleUrls: ['./styles/betradar-no-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BetradarNoContentComponent extends AbstractComponent implements OnInit, OnChanges {
    public override $params: Params.IBetradarNoContentCParams;

    @Input() public contentText: string;
    @Input() public contentImg: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBetradarNoContentCParams,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams: injectParams || {},
            defaultParams: Params.defaultParams,
        }, null, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }
}
