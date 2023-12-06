export interface ISettingsWheel {
    amount?: string;
    duration?: string;
    winnersCount?: string;
    id?: number;
    link?: string;
}

export interface IParticipant {
    avatar?: string;
    name: string;
    id: number;
}

export interface IUserWheel {
    idUser?: number;
    isStreamer?: boolean;
    streamWheelOwner?: number;
    streamWheelsParticipant?: number[];
    currency?: string;
}

export interface IInfoWheelResponse extends ISettingsWheel {
    currency?: string;
    finishedAt?: string;
    participants?: IParticipantRest[];
    participantsCount?: number;
    status?: number;
    serverTime?: number;
}

export interface IWSStreamWheelData {
    Event?: string,
    IDWheel?: string,
    Users?: string,
}

export interface IWSStreamWheel {
    status?: string,
    system?: string,
    event?: string,
    data?: IWSStreamWheelData,
}

export interface IParticipantRest {
    id?: number;
    screenName?: string;
}

export interface IWinner extends IParticipant {
    amount?: number;
    currency?: string;
}

export interface IEventWidgetWheel {
    name: string;
    data?: number;
}
