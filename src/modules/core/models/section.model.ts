import {assign as _assign, map as _map, reduce as _reduce, findIndex as _findIndex, union as _union} from 'lodash';
import {ILayoutComponent, ILayoutModifyItem, ILayoutSectionConfig} from 'wlc-engine/interfaces';

export interface ISectionData {
    section: ILayoutSectionConfig;
    name: string;
}

export class SectionModel implements ILayoutSectionConfig {
    public readonly name: string;
    public readonly container: string | boolean;
    public readonly components: (ILayoutComponent | string)[];
    public readonly modify: ILayoutModifyItem[];
    public readonly modifiers: string[];
    public readonly theme: string;

    protected preparedModifiers: string[] = [];

    constructor(sectionData: ISectionData) {
        _assign(this, sectionData.section);
        this.name = sectionData.name;
        this.prepareModifiers();
    }

    public toString(): string {
        return this.name;
    }

    public classList(hostClass: string): string {
        const cssModifiers = _map(
            this.preparedModifiers,
            (mod: string): string => `${hostClass}__${this.name}--${mod}`
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
