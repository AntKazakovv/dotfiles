import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './achievement-tag.params';

@Component({
    selector: '[wlc-achievement-tag]',
    templateUrl: './achievement-tag.component.html',
    styleUrls: ['./styles/achievement-tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AchievementTagComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAchievementTagCParams;
    @Input() public text: string;

    public override $params: Params.IAchievementTagCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAchievementTagCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.text ??= this.$params.text || '';
    }
}
