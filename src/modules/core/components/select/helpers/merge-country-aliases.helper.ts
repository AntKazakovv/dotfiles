import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _merge from 'lodash-es/merge';
import _union from 'lodash-es/union';
import _uniqBy from 'lodash-es/uniqBy';
import _differenceBy from 'lodash-es/differenceBy';

import {ICountry} from 'wlc-engine/modules/core';

import {countryAliases} from 'wlc-engine/modules/core/system/constants/country-aliases.constants';
import {IAlias} from 'wlc-engine/modules/core/components/select/select.params';

/**
 * Function merge aliases from params with counties iso2 and iso3.
 * @param {IAlias[]} inputValue aliases from params.
 * @param {ICountry[]} countries counties.
 * @return {IAlias[]} merged aliases with iso2 and iso3 and with not existing countries.
 */
export function mergeCountryAliases(projectAliases: IAlias[], countries: ICountry[]): IAlias[] {
    // Group project and wlcAliases
    const groupedAliases = _merge(countryAliases, projectAliases);

    // Merge exist aliases with iso2 and iso3.
    const mergedAliases: IAlias[] = _map(groupedAliases, (alias => {
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
    const missingCountries: ICountry[] = _differenceBy(countries, groupedAliases, 'value');
    const missingAliases: IAlias[] = _map(missingCountries, (item) => ({
        value: item?.value,
        title: item?.title,
        aliases: [item?.iso2, item?.iso3],
    }));

    return _uniqBy([...mergedAliases, ...missingAliases], 'value');
}
