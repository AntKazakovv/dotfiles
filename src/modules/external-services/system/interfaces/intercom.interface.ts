export interface IIntercomSetup {
    appId: string;
    apiBase?: string;
    sendUserInfo?: boolean;
    excludeStates?: string[];
    excludeOnlyMobile?: boolean;
}
