import {
    Inject,
    Injectable,
} from '@angular/core';

import _trim from 'lodash-es/trim';

import {
    GlobalHelper,
    ConfigService,
    Deferred,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

export type downloadProgress = (progress: number) => void;

interface IAppVersion {
    code: number;
    name: string;
}

interface IInstalledVersion {
    firstInstallTime: number;
    name: string;
    package: string;
    version: IAppVersion;
}

@Injectable({providedIn: 'root'})
export class AppUpdateService {
    public ready: Promise<void>;

    private readyStatus: Deferred<void> = new Deferred<void>();
    private installedVersion: IInstalledVersion;
    private apkBundleUrl: string;

    /**
     * Get app version in format '1.0.0'
     */
    public get appVersion(): string {
        return this.installedVersion.version.name;
    }

    /**
     * Check that apk bundle path exists
     */
    public get apkBundleExists(): boolean {
        return !!this.apkBundleUrl;
    }

    constructor(
        @Inject(WINDOW) protected window: Window,
        private configService: ConfigService,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        this.ready = this.readyStatus.promise;
        if (!this.window.ApkUpdater) {
            return;
        }

        if (GlobalHelper.mobileAppConfig.apkFile?.url) {
            this.apkBundleUrl = GlobalHelper.mobileAppConfig.apkFile.url;
        } else if (GlobalHelper.mobileAppConfig.apkFile?.path) {
            this.apkBundleUrl =
                _trim(GlobalHelper.mobileAppConfig.apiUrl, ' /')
                + '/'
                + _trim(GlobalHelper.mobileAppConfig.apkFile.path, ' /');
        }
        this.installedVersion = await this.window.ApkUpdater.getInstalledVersion();

        await this.configService.ready;
        this.readyStatus.resolve();
    }

    /**
     * Update app
     *
     * @param downloadProgress
     */
    public update(downloadProgress: downloadProgress): void {
        if (!this.apkBundleUrl) {
            return;
        }

        this.window.ApkUpdater.download(
            this.apkBundleUrl,
            {
                onDownloadProgress: downloadProgress,
            },
            () => {
                this.window.ApkUpdater.install();
            },
            console.error,
        );
    }
}
