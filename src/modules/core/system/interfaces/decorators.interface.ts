export interface IBaseHook {
    final: () => void,
}

export interface IReplaceHook extends Partial<IBaseHook> {
    replace?: () => void,
}
