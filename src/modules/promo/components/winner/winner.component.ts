import {
    trigger,
    transition,
    style,
    animate,
} from '@angular/animations';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    HostBinding,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import * as Params from './winner.params';

export {IWinnerCParams} from './winner.params';

@Component({
    selector: '[wlc-winner]',
    templateUrl: './winner.component.html',
    styleUrls: ['./styles/winner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('enter', [
            transition(':enter', [
                style({opacity: 0}),
                animate('200ms', style({opacity: 1})),
            ]),
        ]),
    ],
})
export class WinnerComponent extends AbstractComponent implements OnInit {
    @HostBinding('@enter') protected animation = true;
    public $params: Params.IWinnerCParams;

    @Input() protected inlineParams: Params.IWinnerCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWinnerCParams,
        protected configService: ConfigService,
        protected translate: TranslateService,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super(
            {injectParams, defaultParams: Params.defaultParams},
            configService,
        );
    }

    public get gameImage(): string {
        return this.$params.winner.game.image;
    }

    public get gameName(): string {
        const lang = this.translate.currentLang;
        return this.$params.winner.game.name[lang] || this.$params.winner.game.name.en;
    }

    public get name(): string {
        return this.$params.winner.name;
    }

    public get amount(): number {
        return this.$params.winner.amount;
    }

    public get currency(): string {
        return this.$params.winner.currency;
    }

    public get countryIso2(): string {
        return this.$params.winner.countryIso2;
    }

    public get countryIso3(): string {
        return this.$params.winner.countryIso3;
    }

    public get countryUrl(): string {
        return `/gstatic/wlc/flags/4x3/${this.$params.winner.countryIso2}.svg`;
    }

    public get date(): DateTime {
        return this.$params.winner.date;
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public startGame($event: Event): void {
        $event.preventDefault();
        this.gamesCatalogService.startGame(
            this.$params.winner.game,
            {demo: false},
        );
    }

}
