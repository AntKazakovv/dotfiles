export namespace ProhibitedPatterns {
    /**
     * RegExp excluding characters
     */
    export const notNamesSymbols: RegExp = /[\d!"#$%&'()*+,.\/:;<=>?@[\\\]^_`{|}~¡¿÷ˆ№]/g;

    /**
     * RegExp for amount payment
     */
    export const notAmountSymbols: RegExp = /[^\d,.]/;

    /**
    * RegExp for number
    */
    export const notNumberSymbols: RegExp = /\D/g;
}

export const sanitizeHTMLTags: RegExp = /<[^>]*>/g;

export namespace MediaQueries {

    export const minOrMax: RegExp = /(\(\s*\')\s*(min-width|max-width):\s*\d+(px)\s*\'\s*\)/i;

}
