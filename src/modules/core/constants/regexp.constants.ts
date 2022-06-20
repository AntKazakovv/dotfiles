export namespace ProhibitedPatterns {
    /**
     * RegExp excluding characters
     */
    export const notNamesSymbols: RegExp = /[\d!"#$%&'()*+,.\/:;<=>?@[\\\]^_`{|}~¡¿÷ˆ№]/g;

    /**
     * RegExp for amount payment
     */
    export const notAmountSymbols: RegExp = /[^\d,.]/;
}
