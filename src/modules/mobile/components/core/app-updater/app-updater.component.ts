import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    HostBinding,
} from '@angular/core';
import {Location} from '@angular/common';
import {
    UIRouter,
    StateService,
} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    LayoutService,
    ModalService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {AppUpdateService} from 'wlc-engine/modules/mobile/system/services/app-update/app-update.service';

import * as Params from './app-updater.params';

@Component({
    selector: '[wlc-app-updater]',
    templateUrl: './app-updater.component.html',
    styleUrls: ['./styles/app-updater.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUpdaterComponent
    extends AbstractComponent
    implements OnInit {

    @HostBinding('hidden') get hidden() {
        return this.isHidden;
    };

    public $params: Params.IAppUpdaterParams;
    public isHidden: boolean = true;

    public downloadInProgress: boolean = false;
    public newVersionDownloaded: boolean = false;
    public downloadProgress: number = 0;
    public updateBtnText: string = gettext('Update app');

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAppUpdaterParams,
        protected configService: ConfigService,
        protected router: UIRouter,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected stateService: StateService,
        protected eventService: EventService,
        protected layoutService: LayoutService,
        protected location: Location,
        protected appUpdateService: AppUpdateService,
    ) {
        super(
            <IMixedParams<Params.IAppUpdaterParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.appUpdateService.ready;

        const lastAppVersion: string = this.configService.get('appConfig.mobileApp.version');
        if (GlobalHelper.mobileAppConfig.bundleType === 'site'
            && this.appUpdateService.apkBundleExists
            && lastAppVersion
            && lastAppVersion !== this.appUpdateService.appVersion
        ) {
            this.isHidden = false;
        }
        this.cdr.detectChanges();
    }

    public update(): void {
        this.downloadInProgress = true;

        this.appUpdateService.update((progressInfo: any) => {
            this.downloadProgress = Math.floor(progressInfo.progress);
            if (this.downloadProgress == 100) {
                this.newVersionDownloaded = true;
                this.downloadInProgress = false;
                this.isHidden = true;
            }
            this.cdr.detectChanges();
        });
    }
}
