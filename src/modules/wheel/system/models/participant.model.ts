import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';

import {IParticipant} from 'wlc-engine/modules/wheel/system/interfaces';

export class ParticipantModel extends AbstractModel<IParticipant> {
    public static folder: string;

    constructor(
        from: IFromLog,
        data: IParticipant,
    ) {
        super({from: _assign({model: 'Participant'}, from)});
        this.data = data;
        this.changeAvatar();
    }

    public get avatar(): string {
        return this.data.avatar;
    }

    public get name(): string {
        return this.data.name;
    }

    public set name(name: string) {
        this.data.name = name;
    }

    public get id(): number {
        return this.data.id;
    }

    private changeAvatar(): void {
        const array = Array.from(this.data.id.toString(), Number);
        const firstNum = array[array.length - 2] > 4 ? 1 : 0;
        const secondNum = array[array.length - 1];
        const path = `${ParticipantModel.folder}avatar-${firstNum}${secondNum}.png`;
        this.data.avatar = path;
    }
}
