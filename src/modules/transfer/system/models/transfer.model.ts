import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {ITransfer, TransferByEnum} from 'wlc-engine/modules/transfer';

export class TransferModel extends AbstractModel<ITransfer> {

    constructor(
        from: IFromLog,
        data: ITransfer,
    ) {
        super({from: _assign({model: 'TransferModel'}, from)});
        this.data = data;
    }

    public get transferBy(): TransferByEnum {
        //TODO Change "TransferByEnum.EMAIL" to "this.data.TransferBy" when it will work correctly
        // https://tracker.egamings.com/issues/518715#note-66
        return TransferByEnum.EMAIL;
    }

    public get disableConfirmation(): boolean {
        return this.data.DisableConfirmation;
    }

    public get currentDaily(): number {
        return _toNumber(this.data.CurrentDaily);
    }

    public get bonusId(): string {
        return this.data.IDBonus;
    }

    public get minOnce(): number {
        return _toNumber(this.data.MinOnce) || 1;
    }

    public get maxOnce(): number {
        return _toNumber(this.data.MaxOnce) || 10000;
    }

    public get maxDaily(): number {
        return _toNumber(this.data.MaxDaily);
    }

    public get docsVerified(): boolean {
        return this.data.DocsVerified;
    }
}
