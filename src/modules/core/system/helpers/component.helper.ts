import {ISaCParams} from 'wlc-engine/modules/core/components/sa/sa.component';
import {standaloneComponents, TStandaloneName} from 'wlc-engine/modules/core/system/constants/modules.constants';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export class ComponentHelper {
    public static getComponent(component: string): string {
        if (this.isStandaloneComponent(component)) {
            return 'core.wlc-sa';
        }

        return component;
    }

    public static getComponentParams<T>(component: string, componentParams: T): ISaCParams<T> | T {
        if (this.isStandaloneComponent(component)) {
            return {
                saName: component.split('.')[1] as TStandaloneName,
                saParams: componentParams,
            };
        }

        return componentParams;
    }

    public static isStandaloneComponent(component: string | ILayoutComponent): boolean {
        let name: string;

        if (typeof component === 'object') {
            name = component.name.split('.')[1];
        }

        if (typeof component === 'string') {
            name = component.split('.')[1];
        }

        // @ts-ignore no-implicit-any #672571
        return Boolean(standaloneComponents[name]);
    }

    public static changeConfigStandaloneComponents(components: ILayoutComponent[]): ILayoutComponent[] {
        return components.map((component) => {
            const name: string = component && component.name.split('.')[1];

            // @ts-ignore no-implicit-any #672571
            if (standaloneComponents[name]
                // @ts-ignore no-implicit-any #672571
                || (this.customStandaloneConfig && this.customStandaloneConfig[name])
            ) {
                const saConfig: ILayoutComponent = {
                    name: 'core.wlc-sa',
                    params: <ISaCParams<unknown>>{
                        saName: name,
                        saParams: component.params,
                    },
                };

                if (component.display) {
                    saConfig.display = component.display;
                }

                if (component.componentClass) {
                    saConfig.componentClass = component.componentClass;
                }

                return saConfig;
            }

            return component;
        });
    }
}
