export class ResizedEventModel {

    public newRect: DOMRectReadOnly;
    public oldRect?: DOMRectReadOnly;
    public isFirst: boolean;

    public constructor(newRect: DOMRectReadOnly, oldRect: DOMRectReadOnly | undefined) {
        this.newRect = newRect;
        this.oldRect = oldRect;
        this.isFirst = typeof oldRect === 'undefined';
    }
}
