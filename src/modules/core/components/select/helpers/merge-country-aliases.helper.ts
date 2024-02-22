import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _merge from 'lodash-es/merge';
import _union from 'lodash-es/union';
import _uniqBy from 'lodash-es/uniqBy';
import _differenceBy from 'lodash-es/differenceBy';

import {ICountry} from 'wlc-engine/modules/core';

import {IAlias} from 'wlc-engine/modules/core/components/select/select.params';

/**
 * Function merge aliases from params with counties iso2 and iso3.
 * @param {IAlias[]} inputValue aliases from params.
 * @param {ICountry[]} countries counties.
 * @return {IAlias[]} merged aliases with iso2 and iso3 and with not existing countries.
 */
export function mergeCountryAliases(aliases: IAlias[], countries: ICountry[]): IAlias[] {

    // Merge exist aliases with iso2 and iso3.
    const mergedAliases: IAlias[] = _map(aliases, (alias => {
        const country: ICountry = _find(countries, {value: alias.value});

        if (country) {
            return _merge({}, alias, {
                aliases: _union(alias.aliases, [country?.iso2, country?.iso3]),
            });
        }

        return alias;
    }));

    // Find countries that don't have corresponding entries in aliases.
    // Make aliases with iso2 and iso3.
    const missingCountries: ICountry[] = _differenceBy(countries, aliases, 'value');
    const missingAliases: IAlias[] = _map(missingCountries, (item) => ({
        value: item?.value,
        title: item?.title,
        aliases: [item?.iso2, item?.iso3],
    }));

    // Create objects in aliases for the missing countries with iso2 and iso3 values.
    return _uniqBy([...mergedAliases, ...missingAliases], 'value');
}
