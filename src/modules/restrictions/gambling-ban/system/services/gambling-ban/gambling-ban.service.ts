import {Injectable} from '@angular/core';
import {
    Observable,
    first,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';

import {
    NotificationEvents,
    IPushMessageParams,
    IModalParams,
    ModalService,
    EventService,
    IEvent,
    DataService,
    WlcModalComponent,
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {LockedNodeMutations} from '../../../system/classes/locked-node-mutations';
import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';

@Injectable({providedIn: 'root'})
export class GamblingBanService {
    protected readonly modalId = 'gambling-btn';
    protected readonly modalConfig: IModalParams = {
        id: 'gambling-btn',
        componentName: 'gambling-ban.wlc-gambling-ban-modal',
        ignoreBackdropClick: true,
        closeBtnVisibility: false,
        backdrop: 'static',
        centered: true,
        showFooter: false,
        keyboard: false,
    };
    protected readonly showRestrictModal$: Observable<unknown> = this.eventService
        .filter<IEvent<UserInfo>>({name: 'USER_INFO'})
        .pipe(
            takeUntil(this.eventService.filter({name: 'LOGOUT'}).pipe(first())),
            first(({data}) => data.data?.blockByLocation),
            tap(() => this.openRestrictModal()),
        );

    protected mutations?: LockedNodeMutations;
    protected userService?: UserService;

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected modalService: ModalService,
        protected configService: ConfigService,
    ) {
        this.init();
    }

    public async confirm(): Promise<void> {
        try {
            await this.sendConfirmation();
            this.closeRestrictModal();
        } catch (e) {
            this.notifyAboutFail();
        }
    }

    public async signOut(): Promise<void> {
        this.userService ??= await this.injectionService.getService('user.user-service');
        this.userService.logout();
        this.mutations.disconnect();
        this.closeRestrictModal();
    }

    protected async openRestrictModal(): Promise<void> {
        const component: WlcModalComponent = await this.modalService.showModal(this.modalConfig);
        this.mutations ??= new LockedNodeMutations(this.reopenModal.bind(this));
        this.mutations.observe(component.nativeElement);
    }

    protected init(): void {

        this.eventService.filter({name: 'LOGIN'})
            .pipe(switchMap(() => this.showRestrictModal$))
            .subscribe();

        if (this.configService.get('$user.isAuthenticated')) {
            this.showRestrictModal$.subscribe();
        }
    }

    protected closeRestrictModal(): void {
        this.modalService.hideModal(this.modalId);
    }

    protected async reopenModal(): Promise<void> {
        this.closeRestrictModal();
        await this.openRestrictModal();
    }

    protected async sendConfirmation(): Promise<void> {
        await this.dataService.request({
            name: 'confirmGamblingBan',
            system: 'restrictions',
            type: 'POST',
            url: '/countrynonresidence',
        }, {confirm: 1});
    }

    protected notifyAboutFail(): void {
        const data: IPushMessageParams = {
            type: 'error',
            message: gettext('Error'),
        };

        this.eventService.emit({
            data,
            name: NotificationEvents.PushMessage,
        });
    }
}
