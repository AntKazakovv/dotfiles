import {Component, OnInit, ChangeDetectorRef, Inject, Input} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';


@Component({
    selector: '[wlc-dummy]',
    templateUrl: './dummy.component.html',
    styleUrls: ['./dummy.component.scss'],
})
export class DummyComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: any;
    public $params: any;

    constructor(
        @Inject('injectParams') protected params: any,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<any>>{
                injectParams: params,
                defaultParams: {},
            });
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
