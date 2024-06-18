import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    map,
    distinctUntilChanged,
    takeUntil,
} from 'rxjs/operators';
import _isEqual from 'lodash-es/isEqual';

import {
    AbstractComponent,
    FilesService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {IUserNickIcon} from 'wlc-engine/modules/user/system/interfaces/user.interface';

import * as Params from './nickname-icon.params';

@Component({
    selector: '[wlc-nickname-icon]',
    templateUrl: './nickname-icon.component.html',
    styleUrls: ['./styles/nickname-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NicknameIconComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.INicknameIconCParams;

    public override $params: Params.INicknameIconCParams;
    public userNick: string = this.translateService.instant('Not specified');
    public iconPath!: string;
    public emptyNick: boolean = true;
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        @Inject('injectParams') protected injectParams: Params.INicknameIconCParams,
        protected fileService: FilesService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected translateService: TranslateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        const defaultIcon = this.configService.get<string>('$base.profile.nicknameIcon.defaultIcon');

        if (!defaultIcon) {
            console.error('defaultIcon is not specified');
        }

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}).pipe(
            filter((v) => !!v),
            map((profile: UserProfile) => ({
                nick: profile.nickname,
                icon: profile.userIcon,
            })),
            distinctUntilChanged(_isEqual),
            takeUntil(this.$destroy),
        ).subscribe((v: IUserNickIcon) => {
            this.iconPath = !!v.icon ? v.icon : defaultIcon;
            if (!!v.nick) {
                this.userNick = v.nick;
                this.emptyNick = false;
            }
            this.ready$.next(true);
            this.cdr.markForCheck();
        });
    }

    public showModal(): void {
        this.modalService.showModal('nicknameIcon');
    }
}
