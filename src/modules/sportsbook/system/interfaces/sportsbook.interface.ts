
export interface ISportsbookConfig {
    betradar?: IBetradar
}

export interface ISportsbookSettings {
    id: string;
    merchantId: number,
    launchCode: string,
}

export interface ISportsbookSettingsFilter {
    id: string,
    merchantId: number,
}

export interface IBetradar {
    cssFile?: string;
    configFile?: string;
}

export interface IMessageDataLocationChange {
    path: string;
}
