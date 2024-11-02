import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {ICheckboxCParams} from 'wlc-engine/modules/core/components/checkbox/checkbox.interfaces';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ICheckboxWithInputCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    name?: string[],
    checkboxParams?: ICheckboxCParams,
    inputParams?: IInputCParams,
};

export const defaultParams: ICheckboxWithInputCParams = {
    class: 'wlc-checkbox-with-input',
    componentName: 'wlc-checkbox-with-input',
    moduleName: 'core',
};
