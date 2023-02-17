import {
    Component,
    ChangeDetectionStrategy,
    HostBinding,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';

import {moduleConfig} from '../../../../chat.module';
import {fadeInUpTrigger} from 'wlc-engine/modules/chat/system/animations/chat.animations';

@Component({
    selector: '[wlc-emoji]',
    templateUrl: './emoji.component.html',
    styleUrls: ['./emoji.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        fadeInUpTrigger,
    ],
})

export class EmojiComponent {
    @HostBinding('class.wlc-emoji') public $class: string = 'wlc-emoji';
    @Input('isOpened') public isOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    @Output() chooseEmojiEvent = new EventEmitter<string>();

    public emojiList: Map<string, string> = moduleConfig.emojiList;

    constructor() {}

    public toggle(val: boolean): void {
        this.isOpened$.next(val);
    }

    public chooseEmoji(emoji: string): void {
        this.chooseEmojiEvent.emit(emoji);
    }
}
