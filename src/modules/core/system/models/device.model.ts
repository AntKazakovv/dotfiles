import * as Bowser from 'bowser';
// import

export enum DeviceType {
    Mobile,
    Tablet,
    Desktop,
}

export interface IDeviceConfig {
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    }
}

export class DeviceModel {
    protected bowserParser = Bowser.getParser(window.navigator.userAgent);

    constructor(
        protected deviceConfig: IDeviceConfig,
    ) {
        // console.log(deviceConfig);
    }

    public get isReady(): boolean {
        return !!this.deviceConfig;
    }

    public get windowWidth(): number {
        return window.innerWidth;
    }

    public get windowHeight(): number {
        return window.innerHeight;
    }

    public get isMobile(): boolean {
        return;
    }

    public get isTablet(): boolean {
        return;
    }

    public get isDesktop(): boolean {
        return;
    }
}
