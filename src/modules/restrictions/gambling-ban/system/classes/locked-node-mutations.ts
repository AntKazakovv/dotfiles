export type TReopenModalCallback = () => Promise<void>;

export class LockedNodeMutations {
    protected readonly mutations = new MutationObserver(this.onIllegalChanges.bind(this));

    constructor(protected readonly reopenModal: TReopenModalCallback) {}

    public disconnect(): void {
        this.mutations.disconnect();
    }

    public observe(node: Node): void {
        this.mutations.observe(node, {subtree: true, childList: true});
    }

    protected async onIllegalChanges(mutations: MutationRecord[]): Promise<void> {
        if (this.hasIllegalChanges(mutations)) {
            this.reopenModal();
        }
    }

    protected hasIllegalChanges(mutations: MutationRecord[]): boolean {
        return mutations.some(({removedNodes}) => removedNodes.length);
    }
}
