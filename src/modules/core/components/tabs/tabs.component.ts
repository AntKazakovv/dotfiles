import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './tabs.params';

@Component({
    selector: '[wlc-tabs]',
    templateUrl: './tabs.component.html',
    styleUrls: ['./styles/tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams!: Params.ITabsCParams;

    public override $params!: Params.ITabsCParams;

    constructor(
        @Inject('injectParams') injectParams: Params.ITabsCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.$params.selectTab$.getValue() && this.$params.tabs?.length) {
            this.$params.selectTab$.next(this.$params.tabs[0].value);
        }
    }

    public isTabActive(value: string): boolean {
        return value === this.$params.selectTab$.value;
    }

    public select(value: string): void {
        if (this.$params.selectTab$.value !== value) {
            this.$params.selectTab$.next(value);
        }
    }

}
