export interface IBaseHook {
    final: () => void,
}

export interface IReplaceHook extends Partial<IBaseHook> {
    replace?: () => void,
}

export interface ICustomHookConfig {
    finances?: {
        financesServiceOnPaymentFail?: IReplaceHook,
        financesServiceOnPaymentSuccess?: IReplaceHook,
        financesServiceOnPaymentPending?: IReplaceHook,
    }
}
