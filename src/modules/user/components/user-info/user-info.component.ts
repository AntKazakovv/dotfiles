import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {StateService} from '@uirouter/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {
    AppType,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import * as Params from './user-info.params';

@Component({
    selector: '[wlc-user-info]',
    templateUrl: './user-info.component.html',
    styleUrls: ['./styles/user-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('toggle', [
            state('opened', style({
                opacity: 1,
                visibility: 'visible',
            })),
            state('closed', style({
                opacity: 0,
                visibility: 'hidden',
            })),
            transition('void => *', [
                animate(0),
            ]),
            transition('* => *', [
                animate('0.3s'),
            ]),
        ]),
    ],
})
export class UserInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IUserInfoCParams;
    public override $params: Params.IUserInfoCParams;
    public isOpened: boolean;
    public dropdownBtnActive: boolean;
    public hasNotifier: boolean;
    public notifierConfig: IWrapperCParams;

    public internalMailsNotifierConfig: IWrapperCParams = Params.internalMailsNotifierConfig;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IUserInfoCParams,
        configService: ConfigService,
        protected elementRef: ElementRef,
        protected stateService: StateService,
        protected eventService: EventService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.hasNotifier = this.configService.get<boolean>('$base.profile.messages.use');

        this.notifierConfig = {
            components: [
                {
                    name: 'internal-mails.wlc-internal-mails-notifier',
                },
            ],
        };

        if (this.configService.get<boolean>('$base.stickyHeader.use') &&
            !this.configService.get<boolean>('$base.stickyHeader.useCustomUserInfo')) {
            this.$params = Params.stickyThemeParams;
        } else if (this.configService.get<AppType>('$base.app.type') === 'kiosk') {
            this.$params = Params.kioskParams;
        };
        this.eventService.subscribe({name: 'TRANSITION_ENTER'}, () => {
            this.isOpened = false;
            this.dropdownBtnActive = false;
            this.cdr.markForCheck();
        }, this.$destroy);
    }

    public toggle(): void {
        this.isOpened = !this.isOpened;
        this.dropdownBtnActive = !this.dropdownBtnActive;
    }

    public depositAction(): void {
        this.stateService.go(this.$params.button.sref);
    }
}
