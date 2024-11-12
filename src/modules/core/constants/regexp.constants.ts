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
     * Integer values only
     */
    export const integers: RegExp =  /\D/;

    /**
    * RegExp for number
    */
    export const notNumberSymbols: RegExp = /\D/g;
}

export const sanitizeHTMLTags: RegExp = /<[^>]*>/g;

export namespace MediaQueries {

    export const minOrMax: RegExp = /\(\s*(min-width|max-width):\s*\d+(px)\s*\)/i;

}

export namespace JackpotCurrency {

    export const formatCurrency: RegExp = /[\d\s\,\.\০\u09e6]/g;// !!! don't touch 'о' and \u09e6
}
