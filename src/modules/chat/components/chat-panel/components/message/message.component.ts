import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnInit,
} from '@angular/core';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {
    Direction,
    IMessage,
} from 'wlc-engine/modules/chat/system/interfaces';
import {ChatHelper} from 'wlc-engine/modules/chat/system/classes/chat.helper';

export type TComponentMod = 'skeleton' | 'default';

@Component({
    selector: '[wlc-message]',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent extends AbstractChatComponent implements OnInit {
    @HostBinding('class.read') protected get read() {
        return this.message?.read;
    }

    @HostBinding('class.unread') protected get unread() {
        return !this.message?.read;
    }

    @HostBinding('class.in') protected get in() {
        return this.message?.direction === Direction.in;
    }

    @HostBinding('class.out') protected get out() {
        return this.message?.direction === Direction.out;
    }

    @Input() public mod: TComponentMod = 'default';
    @Input() public message!: IMessage;

    public avatar!: string;

    constructor() {
        super('wlc-message');
    }

    public ngOnInit(): void {
        this.addMod(`mod-${this.mod}`);

        if (this.message) {
            let name = this.message.from.nickname.replace(' ', '-');
            let bg = ChatHelper.stringToColor(this.message.from.nickname);
            let color = ChatHelper.invertColor(bg);
            this.avatar = `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=${color}`;

            this.addMod(this.message.from.role);
        }
    }

}
