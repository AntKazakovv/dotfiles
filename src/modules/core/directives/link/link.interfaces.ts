import type {RouterLink} from '@angular/router';
import type {UISref} from '@uirouter/angular';

export type TMayBe<T> = T | null | undefined;

/**
 * State name - alias for specific route path
 */
export type TLinkStateName = string;

/**
 * Object with dynamic parameters of the route. For example state `'app.catalog'` has dynamic
 * param `category`, so provided params are object `{category: 'livecasino'}`
 *
 * @todo Типизируем {@link UISref#params}, а то он почему-то `any`
 */
export type TLinkStateParams = {
    [key: string]: string | number;
};

/**
 * State with params. The array, where first element is state name [[TLinkStateName]],
 * second element is object with dynamic params for state [[TLinkStateParams]]
 * @see TLinkStateName
 * @see TLinkStateParams
 */
export type TLinkState = [TLinkStateName] | [TLinkStateName, TLinkStateParams];

/**
 * Available incoming params for {@link LinkDirective#wlcLink}
 * @see TLinkStateName
 * @see TLinkState
 */
export type TLink = TMayBe<TLinkStateName | TLinkState>;


/**
 * @todo Если при переходе на директиву понадобятся прокидывание дополнительных параметров -
 * пишите в личку Mila Kovtun
 */
export type TLinkStateOptions = {
    /**
     * Implementation {@link TransitionOptions#location} via {@link RouterLink#skipLocationChange}
     * @default false
     * @summary `TransitionOptions.location: false` = `RouterLink.skipLocationChange: true`.
     */
    skipLocationChange?: RouterLink['skipLocationChange'];
    /**
     * Implementation {@link TransitionOptions#reload} via {@link RouterLink#replaceUrl}
     * @default false
     * @summary по всему движку если и используется, то везде фолз.
     */
    replaceUrl?: RouterLink['replaceUrl'];
    /**
     * Temporary implementation {@link TransitionOptions#inherit}
     * @deprecated `@angular/router` has no parallel for RouterLink
     * @default true
     * @summary по движку используется либо как тру, либо в настройке стейтов, можно не прокидывать.
     * Нативный это имплементирует только через настройку стейтов.
     */
    inherit?: UISref['options']['inherit'];
}

/**
 * @todo routerLinkActiveOptions
 */
export interface TLinkActiveOpt {
    exact: boolean;
}
