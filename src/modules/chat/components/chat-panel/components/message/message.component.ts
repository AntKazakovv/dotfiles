import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnInit,
} from '@angular/core';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {
    Direction,
    INewMsg,
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
    @HostBinding('class.read') protected get read(): boolean {
        return this.message?.read;
    }

    @HostBinding('class.unread') protected get unread(): boolean {
        return !this.message?.read;
    }

    @HostBinding('class.in') protected get in(): boolean {
        return this.message?.direction === Direction.in;
    }

    @HostBinding('class.out') protected get out(): boolean {
        return this.message?.direction === Direction.out;
    }

    @Input() public mod: TComponentMod = 'default';
    @Input() public message!: INewMsg;

    public avatar!: string;
    public moderator: boolean = false;

    constructor(
        protected cdr: ChangeDetectorRef,
    ) {
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

            if (this.message.from.role === 'moderator') {
                this.moderator = true;
            }
        }
        this.cdr.markForCheck();
    }

}
