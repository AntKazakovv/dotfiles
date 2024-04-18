import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';
import {
    UntypedFormControl,
} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
    map,
    distinctUntilChanged,
} from 'rxjs/operators';

import _isEqual from 'lodash-es/isEqual';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    FilesService,
    IPushMessageParams,
    NotificationEvents,
    ValidationService,
    LogService,
} from 'wlc-engine/modules/core';

import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {IUserNickIcon} from 'wlc-engine/modules/user/system/interfaces/user.interface';
import {WlcModalComponent} from 'wlc-engine/standalone/core/components/modal/modal.component';

import * as Params from './nickname-icon-edit.params';

@Component({
    selector: '[wlc-nickname-icon-edit]',
    templateUrl: './nickname-icon-edit.component.html',
    styleUrls: ['./styles/nickname-icon-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NicknameIconEditComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.INicknameIconEditCParams;

    public override $params: Params.INicknameIconEditCParams;
    public iconPath!: string;
    public iconsList!: Params.IIcon[];
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    protected defaultIcon!: string;
    protected hasAvatar: boolean = false;
    protected iconsFolder!: string;
    protected selectedAvaId!: string;
    protected control: UntypedFormControl;
    protected nick!: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.INicknameIconEditCParams,
        @Inject(WlcModalComponent) protected modal: WlcModalComponent,
        configService: ConfigService,
        protected fileService: FilesService,
        protected userService: UserService,
        protected eventService: EventService,
        protected validationService: ValidationService,
        protected logService: LogService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params.nickInputParams.control;
        this.iconsFolder = this.configService.get<string>('$base.profile.nicknameIcon.iconsFolder');
        this.defaultIcon = this.configService.get<string>('$base.profile.nicknameIcon.defaultIcon');

        if (!this.defaultIcon) {
            console.error('defaultIcon is not specified');
        }

        if (!this.iconsFolder) {
            console.error('iconsFolder is not specified');
        }

        const maxLength: number = this.configService.get<number>('$base.profile.nicknameIcon.nickMaxLength') || 20;
        this.control.setValidators([this.validationService.getValidator('maxLength').validator(maxLength)]);

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}).pipe(
            filter((v) => !!v),
            map((profile: UserProfile) => ({
                nick: profile.nickname,
                icon: profile.userIcon,
            })),
            distinctUntilChanged(_isEqual),
            takeUntil(this.$destroy),
        ).subscribe((v: IUserNickIcon) => {
            if (!!v.icon) {
                this.hasAvatar = true;
                this.iconPath = v.icon;
            } else {
                this.iconPath = this.defaultIcon;
            }

            if (!!v.nick) {
                this.nick = v.nick;
                this.control.setValue(v.nick);
            }
        });

        this.iconsList = this.getIconList();
        this.ready$.next(true);
    }

    public chooseAvatar(icon: Params.IIcon): void {
        let avatars = this.iconsList;
        let ava = avatars.find((ava) => ava.path === icon.path);

        if (this.hasAvatar || (this.iconPath !== this.defaultIcon)) {
            avatars.find((ava) => ava.isChosen === true).isChosen = false;
        }

        ava.isChosen = true;
        this.selectedAvaId = ava.path;
        this.iconPath = ava.path;
        this.cdr.markForCheck();
    }

    public closeModal(): void {
        this.modal.closeModalByReason('closeButton');
    }

    public async setNicknameIcon(): Promise<void> {
        let avatar: string;
        let nick: string;

        if(!this.control.valid) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error filling form.'),
                    message: gettext('Error filling form. Check the correctness of filling out the form fields.'),
                    wlcElement: 'notification_profile-update-error',
                },
            });
        } else if (this.nickAndAvatarSelected) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: gettext('There are no changes to save'),
                    wlcElement: 'notification_profile-update-error',
                },
            });
        } else {

            if (this.hasAvatar || this.selectedAvaId !== this.defaultIcon) {
                avatar = this.selectedAvaId;
            } else {
                avatar = '';
            }

            if (this.control.value !== this.nick) {
                nick = this.control.value;
            }

            try {
                this.control.disable();
                await this.userService.setNicknameIcon(avatar, nick);
                await this.userService.fetchUserProfile();

                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('Profile updated successfully'),
                        message: gettext('Your profile has been updated successfully'),
                        wlcElement: 'notification_profile-update-success',
                    },
                });
                this.modal.closeModalByReason('setNicknameIconSuccess');
            } catch (error) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Profile update failed'),
                        message: error.errors,
                        wlcElement: 'notification_profile-update-error',
                    },
                });
                this.logService.sendLog({code: '1.11.0', data: error});
                this.modal.closeModalByReason('setNicknameIconFailure');
            }
        }
    }

    protected get nickAndAvatarSelected(): boolean {
        return !this.selectedAvaId && (!this.control.value || this.nick === this.control.value);
    }

    protected getIconList(): Params.IIcon[] {
        const list = this.fileService.getStaticFilesList(this.iconsFolder);
        let res = [];

        list.forEach((file: string) => {
            if (this.hasAvatar && file === this.iconPath) {
                res.push({
                    path: file,
                    isChosen: true,
                    type: 'avatar',
                });
            } else {
                res.push({
                    path: file,
                    isChosen: false,
                    type: 'avatar',
                });
            }
        });

        return res;
    }
}
