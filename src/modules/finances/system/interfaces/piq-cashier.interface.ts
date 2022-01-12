export const PIQCashierResponse = 'piq-cashier';

export enum PIQCashierConvertedMethod {
    deposit = 'deposit',
    withdraw = 'withdrawal',
};

export type TPaymentsMethods = 'deposit' | 'withdraw';

export interface IPIQCashierTheme {
    input?: IPIQCashierThemeInput;
    inputbackground?: IPIQCashierThemeColor;
    labels?: IPIQCashierThemeText;
    headings?: IPIQCashierThemeText;
    loader?: IPIQCashierThemeColor;
    error?: IPIQCashierThemeColor;
    buttons?: IPIQCashierThemeColor;
    headerbackground?: IPIQCashierThemeColor;
    background?: IPIQCashierThemeColor;
    cashierbackground?: IPIQCashierThemeColor;
    border?: IPIQCashierThemeRadius;
    margin?: IPIQCashierThemeSize;
    success?: IPIQCashierThemeColor;
}

interface IPIQCashierThemeInput {
    color?: string,
    fontSize?: string;
    height?: string;
    borderRadius?: string;
}

interface IPIQCashierThemeText {
    color?: string;
    fontSize?: string;
}

interface IPIQCashierThemeColor {
    color?: string;
}

interface IPIQCashierThemeRadius {
    radius?: string;
}

interface IPIQCashierThemeSize {
    size?: string;
}
