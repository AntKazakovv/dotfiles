import {mergeCountryAliases} from 'wlc-engine/modules/core/components/select/helpers/merge-country-aliases.helper';

import {ICountry} from 'wlc-engine/modules/core/system/interfaces';
import {
    IAlias,
    ISelectOptions,
    TAliasesType,
} from 'wlc-engine/modules/core/components/select/select.params';

/**
 * Function merge aliases from params with counties iso2 and iso3.
 * @param {Record<string, IAlias[]>} aliases aliases from params.
 * @param {ISelectOptions<unknown>[]} options options from select.
 * @return {string} aliases type, for example, 'countries'.
 */
export function mergeAliases(
    aliases: Record<string, IAlias[]>,
    options: ISelectOptions<unknown>[],
    aliasesType: TAliasesType,
): IAlias[] {
    const projectAliases: IAlias[] = aliases[aliasesType];

    if (aliasesType === 'countries') {
        return mergeCountryAliases(projectAliases, <ICountry[]>options);
    }

    return [];
}
