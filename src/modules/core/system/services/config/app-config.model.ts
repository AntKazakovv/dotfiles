import _assign from 'lodash-es/assign';
import _entries from 'lodash-es/entries';
import _reduce from 'lodash-es/reduce';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
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
    ICategorySettings,
    IBootstrapMenuItem,
    IMobileApp,
} from 'wlc-engine/modules/core/system/interfaces';

export class AppConfigModel extends AbstractModel<IBootstrap> {

    constructor(from: IFromLog) {
        super({from: _assign({model: 'AppConfigModel', from})});
    }

    /**
     * Fundist settings and HTML for banners
     *
     * @returns {IIndexing<IBanner>} settings for each banner
     */
    public get banners(): IIndexing<IBanner[]> {
        return this.data.banners;
    }

    /**
     * Fundist settings of categories
     *
     * @returns {IIndexing<ICategorySettings>} settings of each category
     */
    public get categories(): IIndexing<ICategorySettings> {
        if (this.data.categories && _entries(this.data.categories).some(([, value]) => Array.isArray(value))) {
            return _reduce(_entries(this.data.categories), (acc, current) => {
                acc[current[0]] = current[1];

                if (Array.isArray(current[1])) {
                    acc[current[0]] = {};
                }
                return acc;
            }, {});
        }

        return this.data.categories as IIndexing<ICategorySettings>;
    }

    /**
     * @returns {IContacts} contacts information (email, phone, skype)
     */
    public get contacts(): IContacts {
        return this.data.contacts;
    }

    /**
     * @returns {string} country code ISO-3 ('rus', 'eng'...)
     */
    public get country(): string {
        return this.data.country;
    }

    /**
     * @returns {string} country code ISO-2 ('ru', 'en'...)
     */
    public get country2(): string {
        return this.data.country2;
    }

    /**
     * @returns {string} language code ISO-2 ('ru', 'en'...)
     */
    public get countryLangs(): string[] {
        return this.data.countryLangs;
    }

    /**
     * @returns {boolean} country is restricted if true
     */
    public get countryRestricted(): boolean {
        return this.data.countryRestricted;
    }

    /**
     * @returns {TEnv} environment ('dev' | 'test' | 'prod')
     */
    public get env(): TEnv {
        return this.data.env;
    }

    /**
     * Footer text from from Fundist API
     *
     * @returns {IIndexing<string>} footer text for each language
     */
    public get footerText(): IIndexing<string> {
        if (Array.isArray(this.data.footerText)) {
            return {};
        }

        return this.data.footerText;
    }

    /**
     * @returns {IGames} restricted games
     */
    public get games(): IGames {
        return this.data.games;
    }

    /**
     * @returns {boolean} hide user email if true
     */
    public get hideEmailExistence(): boolean {
        return this.data.hideEmailExistence;
    }

    /**
     * @returns {boolean} ignore poviders for game catalog if true
     */
    public get ignoreProvidersForGameCatalog(): boolean {
        return this.data.ignoreProvidersForGameCatalog;
    }

    /**
     * @returns {string} language code ISO-2 ('ru', 'en'...)
     */
    public get language(): string {
        return this.data.language;
    }

    /**
     * @returns {string} user locale ISO ('en_GB', 'en_US'...)
     */
    public get locale(): string {
        return this.data.locale;
    }

    /**
     * Languages aviable on this site
     *
     * @returns {ILanguage} code and label for each language
     */
    public get languages(): ILanguage[] {
        return this.data.languages;
    }

    /**
     * @returns {boolean} user logged in if true
     */
    public get loggedIn(): boolean {
        return this.data.loggedIn === '1';
    }

    /**
     * @returns {IMenuItem} category menu from Fundist
     */
    public get menu(): IBootstrapMenuItem[] {
        return this.data.menu;
    }

    /**
     * @returns {IMenu} menus settings
     */
    public get menuSettings(): IMenu {
        return this.data.menuSettings;
    }

    /**
     * @returns {boolean} mobile device if true
     */
    public get mobile(): boolean {
        return this.data.mobile;
    }

    /**
     * @returns {boolean} mobile device if true
     */
    public get mobileApp(): IMobileApp {
        return this.data.mobileApp;
    }

    /**
     * @returns {string} name of the session
     */
    public get sessionName(): string {
        return this.data.sessionName;
    }

    /**
     * @returns {string} site url
     */
    public get site(): string {
        return this.data.site;
    }

    /**
     * @returns {boolean} show profile menu if true
     */
    public get showProfileMenu(): boolean {
        return this.data.showProfileMenu;
    }

    /**
     * @returns {ISiteConfig} Fundist and backend site configs
     */
    public get siteconfig(): ISiteConfig {
        return this.data.siteconfig;
    }

    /**
     * Connected social networks
     *
     * @returns {ISocialNetwork} id and name for each social network
     */
    public get socialNetworks(): ISocialNetwork[] {
        return this.data.socialNetworks;
    }

    /**
     * @returns {boolean} Recaptcha using
     */
    public get useRecaptcha(): boolean {
        return this.data.useRecaptcha;
    }

    public get user(): IUser | boolean { // TODO remove after backend delete it
        return this.data.user;
    }

    /**
     * @returns {string} wlc-core version
     */
    public get version(): string {
        return this.data.version;
    }

    /**
     * Returns the Type of project (wlc, tk, etc)
     * @returns The project type.
     */
    public get projectType(): string {
        return this.siteconfig.Type;
    }

    /**
     * It returns the license of the site (curacao, etc).
     * @returns The license property is being returned.
     */
    public get license(): string {
        return this.siteconfig.License;
    }

    /**
     * Returns the legal age by country.
     * @returns {IIndexing<number>} age ban for each country
     */
    public get countryAgeBan(): IIndexing<number> {
        return this.data.countryAgeBan;
    }

    /**
     * @returns {boolean} is sms config enabled
     */
    public get smsEnabled(): boolean {
        return this.data.smsEnabled;
    }

    protected override checkData(): void {
        super.checkData();

        if (!this.objectData.languages?.length) {
            this.sendLog({code: '0.0.13'});
            this.objectData.languages = [
                {
                    code: 'en',
                    label: 'English',
                },
            ];
        }
    }
}
