import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';

import {levenshteinDistance} from './levenshtein-distance.helper';

import {ISelectOptions} from 'wlc-engine/modules/core/components/select/select.params';

/**
 * Function return suggestions by using Levenshtein distance.
 * @param {string} inputValue value from user input
 * @param {number} limit limit of output suggestion items (default: 3)
 * @param {ISelectOptions[]} items items from select list
 * @return {ISelectOptions[]} suggestion items
 */
export function suggestCountry(inputValue: string, items: ISelectOptions[], limit = 3): ISelectOptions[] {
    const inputLowerCase: string = inputValue.toLocaleLowerCase();

    const suggestions: ISelectOptions[] = _map(items, country => {
        country.distance = levenshteinDistance(inputLowerCase, country.title.toString().toLowerCase());
        return country;
    }).sort((a, b) => a.distance - b.distance);

    return _filter(suggestions, (entry, index) => index < limit);
}
