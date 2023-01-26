import {takeUntil} from 'rxjs/operators';
import {
    BehaviorSubject,
    Observable,
    PartialObserver,
    pipe,
    Subscription,
} from 'rxjs';

import _uniqBy from 'lodash-es/uniqBy';
import _each from 'lodash-es/each';
import _toString from 'lodash-es/toString';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractModel,
    ConfigService,
    IAbstractModelParams,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {ITournamentAbstract} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {ITopTournamentUsers} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {ITournamentPlace} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

export abstract class AbstractTournamentModel<T extends ITournamentAbstract> extends AbstractModel<T> {
    protected userCurrency: string;
    protected $descriptionClean: string;
    protected useUsersCurrency: boolean = false;

    constructor(
        params: IAbstractModelParams,
        data: T,
        protected configService: ConfigService,
        protected tournamentsService: TournamentsService,
    ) {
        super(params);

        this.data = data;
        this.$descriptionClean = this.data.Description
            .replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/g, '')
            .replace('<br>', '\n')
            .replace(/<[^>]*>/g, '');
        this.userCurrency = this.configService.
            get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue()?.currency
            && this.configService.get('$user.isAuthenticated')
            ? this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue()?.currency
            : this.configService.get<string>('$base.defaultCurrency');
        this.useUsersCurrency = this.configService.get<boolean>('$base.tournaments.useUsersCurrency');
    }

    public get points(): number {
        return _toNumber(this.data.Points);
    }

    public get statusName(): string {
        return this.data.StatusText;
    }

    public get descriptionClean(): string {
        return this.$descriptionClean;
    }

    public get descriptionSafeHTML(): string {
        return this.prepareHtml(this.data.Description);
    }

    public get pointsTotal(): number {
        return _toNumber(this.data.PointsTotal);
    }

    public get qualification(): number {
        return _toNumber(this.data.Qualification);
    }

    public get series(): string {
        return this.data.Series;
    }

    public get status(): number {
        return _toNumber(this.data.Status);
    }

    public get target(): string {
        return this.data.Target;
    }

    public get terms(): string {
        return this.data.Terms;
    }

    public get termsSafeHTML(): string {
        return this.prepareHtml(this.data.Terms);
    }

    public get winnerBy(): string {
        return this.data.WinnerBy;
    }

    public get winToBetRatio(): number {
        return _toNumber(this.data.WinToBetRatio);
    }

    public get name(): string {
        return this.data.Name;
    }

    public get feeType(): string {
        return this.data.FeeType || null;
    }

    public get description(): string {
        return this.data.Description;
    }

    /**
     * @returns {number} tournament fee amount
     */
    public get feeAmount(): number {
        if (this.feeType === 'loyalty') {
            return _toNumber(this.data.FeeAmount) || 0;
        } else {
            return _toNumber(this.data.FeeAmount['Currency']) ||
                _toNumber(this.data.FeeAmount[this.userCurrency]) ||
                _toNumber(this.data.FeeAmount['EUR']);
        }
    }

    public get id(): number {
        return +this.data.ID;
    }

    public get image(): string {
        return this.data.Image || this.configService.get('$tournaments.defaultImages.image');
    }

    public get imageDashboard(): string {
        return this.data.Image_dashboard || this.configService.get('$tournaments.defaultImages.imageDashboard');
    }

    public get imageDescription(): string {
        return this.data.Image_description || this.configService.get('$tournaments.defaultImages.imageDescription');
    }

    public get imagePromo(): string {
        return this.data.Image_promo || this.configService.get('$tournaments.defaultImages.imagePromo');
    }

    /** Tournament default imageOther shall be displayed only if neither background nor decor image is set in Fundist */
    public get imageOther(): string {
        if (this.data.Image || this.data.Image_other) {
            return this.data.Image_other;
        } else {
            return this.configService.get('$tournaments.defaultImages.imageOther');
        }
    }

    /**
     * @returns {string} tournament target currency
     */
    public get targetCurrency(): string {
        return this.checkTargetCurrency(false);
    }

    /**
     * @returns {string} tournament target currency loyalty or EUR
     */
    public get targetDefaultCurrency(): string {
        return this.checkTargetCurrency(!this.useUsersCurrency);
    }

    /** @returns {string} currency formatting config */
    public get currencyDigitsInfo(): string {
        return this.targetDefaultCurrency === 'LP' ? '1-0-0' : '1-2-2';
    }

    /**
     * Winners subscription
     *
     * @param {PartialObserver<ITopTournamentUsers>} observer observer
     * @param {} params until?: Observable<unknown>, limit?: number, start?: number
     * @returns {Subscription} Winners subscription
     */
    public getWinnersSubscribe(
        observer: PartialObserver<ITopTournamentUsers>,
        params?: {
            until?: Observable<unknown>,
            limit?: number,
            start?: number
        }): Subscription {
        const winnersSubject = this.tournamentsService.getWinnersSubjects(this.id, params?.until, params?.limit);

        if (winnersSubject.observers.length === 0) {
            this.tournamentsService.getTournamentTop(this.id, params?.limit, params?.start);
        }

        return winnersSubject.pipe(
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(observer);
    }

    /**
     * Get tournament top array
     *
     * @param {ITopTournamentUsers} result tournament top users
     * @returns {ITournamentPlace[]} tournament top array
     */

    public getTopArray(result: ITopTournamentUsers): ITournamentPlace[] {
        const topWin = result?.results || [];

        if (result?.user && (_toNumber(result.user.Place) > topWin.length || !result.user.Place)) {
            topWin.push({
                Email: this.configService.get<string>('appConfig.user.Email')?.substring(0, 6) + '***',
                FirstName: this.configService.get<string>('appConfig.user.first_name'),
                IDUser: result.user.IDUser,
                IDUserPlace: result.user.Place || '-',
                LastName: this.configService.get<string>('appConfig.user.last_name'),
                Login: this.configService.get<string>('appConfig.user.user_id'),
                Points: _toString(result.user.Points),
                UserLogin: this.configService.get<string>('appConfig.user.login'),
                Win: result.user.Win,
                BestWinToBetRatio: result.user.BestWinToBetRatio,
            });
        }

        const isBestWinToBetRatio: boolean = this.winnerBy === 'max_app_winbet_ratio';

        _each(topWin, (item: ITournamentPlace) => {
            item.points = _toNumber(item.Points);

            if (isBestWinToBetRatio) {
                item.delta = Math.abs(this.winToBetRatio - _toNumber(item.BestWinToBetRatio));
            }

            if (!item.UserLogin?.length) {
                item.UserLogin = this.getUserLogin(item);
            }
        });

        return _uniqBy(topWin, 'IDUser');
    }

    protected getUserLogin(item: ITournamentPlace): string {
        if (item.FirstName?.length && item.LastName?.length) {
            return item.FirstName + ' ' + item.LastName.substring(0, 1);
        } else {
            return item.Email.substring(0, 6) + '***';
        }
    }

    /**
     * @param {boolean} useDefaultCurrency
     * @returns {string} check use default currency EUR
     */
    protected checkTargetCurrency(useDefaultCurrency?: boolean): string {

        if (this.target === 'loyalty') {
            return 'LP';
        }

        return useDefaultCurrency ? 'EUR' : this.userCurrency;
    }

    /**
     * @param {string} with or without HTML
     * @returns {string} sanitized HTML code
     */
    protected prepareHtml(html: string): string {
        if (!/<[a-z][\S\s]*>/i.test(html)) {
            return this.setBrLinesWrap(html);
        }
        const formattedHtml = this.formatHtmlLinesWrap(html);
        return formattedHtml.replace(/<\/?(script|meta|link|html|iframe|form|head)\b[^<>]*>/g, '');
    }

    /**
     * @param {string} html with or without <style> tag
     * @returns {string} html with styles in the end
     */
    protected formatHtmlLinesWrap(html: string): string {
        const closeStyleTag = '</style>';

        if (html.indexOf(closeStyleTag) === -1) {
            return this.setBrLinesWrap(html);
        } else {
            const stylesSubString = html.slice(
                html.indexOf('<style'),
                html.indexOf(closeStyleTag) + closeStyleTag.length,
            );
            return this.setBrLinesWrap(html.replace(stylesSubString, '')) + stylesSubString;
        }
    }

    /**
     * @param {string} string with new lines as \r \n
     * @returns {string} new lines replaced by <br>
     */
    protected setBrLinesWrap(text: string): string {
        return text.replace(/(\r\n|\r|\n)/g, '<br>');
    }
}
