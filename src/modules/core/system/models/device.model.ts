import * as Bowser from 'bowser';

export enum DeviceType {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop',
}

export enum DeviceOrientation {
    Portrait = 'portrait',
    Landscape = 'landscape',
}

export interface IDeviceConfig {
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    }
}

export class DeviceModel {
    protected bowserParser = Bowser.getParser(this.window.navigator.userAgent);

    constructor(
        protected deviceConfig: IDeviceConfig,
        protected window: Window,
    ) {
    }

    public get orientation(): DeviceOrientation {
        return this.window.matchMedia('(orientation:portrait)').matches
            ? DeviceOrientation.Portrait
            : DeviceOrientation.Landscape;
    }

    public get isReady(): boolean {
        return !!this.deviceConfig;
    }

    public get windowWidth(): number {
        return this.window.innerWidth;
    }

    public get windowHeight(): number {
        return this.window.innerHeight;
    }

    public get isMobile(): boolean {
        return this.platformType === 'mobile';
    }

    public get isTablet(): boolean {
        return this.platformType === 'tablet';
    }

    public get isDesktop(): boolean {
        return this.platformType === 'desktop';
    }

    public get isAndroid(): boolean {
        return this.osName === 'android';
    }

    public get isIOS(): boolean {
        return this.osName === 'ios';
    }

    public get platformType(): string {
        return this.bowserParser.getPlatformType(true);
    }

    public get osName(): string {
        return this.bowserParser.getOSName(true);
    }

    public get osVersion(): string {
        return this.bowserParser.getOSVersion();
    }

    public get browserName(): string {
        return this.bowserParser.getBrowserName(true);
    }
}
