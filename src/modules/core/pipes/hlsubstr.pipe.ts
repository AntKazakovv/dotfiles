import {Pipe, PipeTransform} from '@angular/core';
import {GlobalHelper} from 'wlc-engine/modules/core';

/**
 * Custom pipe for to highlight the found substring in source string
 *
 * @param {string} source  source string
 * @param {string} substring  substring
 * @param {boolean} insensitive  flag for regular expression
 * @param {string} tagWrapper  tag for wrap result
 * @param {string} tagHighlight tag for wrap substring
 *
 * @returns {string} string - modified string
 *
 * @example | hlSubstr :searchText :$params.insensitiveSearch
 */
@Pipe({
    name: 'hlSubstr',
})
export class HlSubstrPipe implements PipeTransform {

    transform(
        source: string,
        substring: string,
        insensitive: boolean = true,
        tagWrapper: string = 'span',
        tagHighlight: string = 'span'): string {
        if (!substring) {
            return source;
        }

        substring = GlobalHelper.shieldingString(substring);
        return `<${tagWrapper}>${source.replace(new RegExp(`(${substring})`,insensitive ? 'i' : ''),
            `<${tagHighlight} class="hl-substr">$1</${tagHighlight}>`)}</${tagWrapper}>`;
    }
}
