import {
    IDisplayConfig,
    ILayoutComponent,
    ILayoutModifyItem,
    ILayoutSectionConfig,
    IPanelSectionConfig,
} from 'wlc-engine/modules/core/system/interfaces';

import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _isUndefined from 'lodash-es/isUndefined';
import _union from 'lodash-es/union';

export interface ISectionData {
    section: ILayoutSectionConfig | IPanelSectionConfig;
    name: string;
    order: number;
}

export class SectionModel implements ILayoutSectionConfig, IPanelSectionConfig {
    public readonly name: string;
    public readonly order: number;
    public readonly container: string | boolean;
    public readonly components: (ILayoutComponent | string)[];
    public readonly modify: ILayoutModifyItem[];
    public readonly modifiers: string[];
    public readonly theme: string;
    public readonly wlcElement: string;
    public readonly hide?: boolean;
    public readonly replaceConfig?: boolean;
    public readonly showClose?: boolean;
    public readonly showLogo?: boolean;
    public readonly showHeader?: boolean;
    public readonly usePreloader?: boolean;
    public readonly type?: 'default' | 'fixed';
    public readonly class?: string;
    public readonly themeMod?: string;
    public readonly customMod?: string;
    public display: IDisplayConfig;
    public useScroll: boolean;
    protected preparedModifiers: string[] = [];

    constructor(sectionData: ISectionData) {
        if (sectionData.section === null) {
            return;
        }
        _assign(this, sectionData.section);
        this.name = sectionData.name;
        this.order = _isUndefined(this.order) ? 1 : this.order;
        this.wlcElement = sectionData.section.wlcElement || 'section_' + this.name;
        this.prepareModifiers();
    }

    public toString(): string {
        return this.name;
    }

    public classList(hostClass: string): string {
        const cssModifiers = _map(
            this.preparedModifiers,
            (mod: string): string => `${hostClass}__${this.name}--${mod}`,
        );
        return [`${hostClass}__${this.name}`, ...cssModifiers].join(' ');
    }

    protected prepareModifiers(): void {
        if (!this.container) {
            this.preparedModifiers = _union(this.preparedModifiers, ['fluid']);
        }

        this.preparedModifiers = _union(
            this.preparedModifiers,
            (this.theme) ? [`theme-${this.theme}`] : ['theme-default'],
        );

        this.preparedModifiers = _union(this.preparedModifiers, this.modifiers);
    }
}
