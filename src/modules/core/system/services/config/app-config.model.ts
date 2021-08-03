import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
    IMenuItem,
    ILanguage,
    ISocialNetwork,
    IIndexing,
    IMenu,
    IBootstrap,
    IBanner,
    IContacts,
    IGames,
    TEnv,
    ISiteConfig,
    IUser,
} from 'wlc-engine/modules/core/system/interfaces';

import _assign from 'lodash-es/assign';

export class AppConfigModel extends AbstractModel<IBootstrap> {

    constructor(from: IFromLog) {
        super({from: _assign({model: 'AppConfigModel', from})});
    }

    public get banners(): IIndexing<IBanner> {
        return this.data.banners;
    }

    public get contacts(): IContacts {
        return this.data.contacts;
    }

    public get country(): string {
        return this.data.country;
    }

    public get country2(): string {
        return this.data.country2;
    }

    public get countryLangs(): string[] {
        return this.data.countryLangs;
    }

    public get countryRestricted(): boolean {
        return this.data.countryRestricted;
    }

    public get env(): TEnv {
        return this.data.env;
    }

    public get footerText(): IIndexing<string> {
        return this.data.footerText;
    }

    public get games(): IGames {
        return this.data.games;
    }

    public get ignoreProvidersForGameCatalog(): boolean {
        return this.data.ignoreProvidersForGameCatalog;
    }

    public get language(): string {
        return this.data.language;
    }

    public get languages(): ILanguage[] {
        return this.data.languages;
    }

    public get loggedIn(): boolean {
        return this.data.loggedIn === '1';
    }

    public get menu(): IMenuItem[] {
        return this.data.menu;
    }

    public get menuSettings(): IMenu {
        return this.data.menuSettings;
    }

    public get mobile(): boolean {
        return this.data.mobile;
    }

    public get sessionName(): string {
        return this.data.sessionName;
    }

    public get site(): string {
        return this.data.site;
    }

    public get showProfileMenu(): boolean {
        return this.data.showProfileMenu;
    }

    public get siteconfig(): ISiteConfig {
        return this.data.siteconfig;
    }

    public get socialNetworks(): ISocialNetwork[] {
        return this.data.socialNetworks;
    }

    public get user(): IUser | boolean { // TODO remove after backend delete it
        return this.data.user;
    }

    public get version(): string {
        return this.data.version;
    }
}
