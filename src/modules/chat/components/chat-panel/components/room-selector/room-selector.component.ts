import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    takeUntil,
    fromEvent,
    takeWhile,
    first,
    merge,
} from 'rxjs';

import {ChatService} from 'wlc-engine/modules/chat/system/services/chat.service';
import {RoomModel} from 'wlc-engine/modules/chat/system/classes/room.model';
import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';

type TKeyboardDir = 'up' | 'down';

@Component({
    selector: '[wlc-room-selector]',
    templateUrl: './room-selector.component.html',
    styleUrls: ['./room-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomSelectorComponent extends AbstractChatComponent implements OnInit, OnDestroy {

    @ViewChild('currentRoom', {static: true}) protected currentRoom: ElementRef<HTMLElement>;
    @ViewChild('selectList') protected selectList: ElementRef<HTMLElement>;

    public rooms: RoomModel[] = this.chatService.roomList;
    public isExpanded: boolean = false;
    public hoveredItemIndex: number = 0;

    private _clickListener: () => void;
    private _keypressListener: () => void;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected chatService: ChatService,
        protected elRef: ElementRef<HTMLElement>,
        protected renderer: Renderer2,
        protected cdr: ChangeDetectorRef,
    ) {
        super('wlc-room-selector');
    }

    public ngOnInit(): void {
        this.initListeners();
    }

    public override ngOnDestroy(): void {

        if (this._clickListener) {
            this._clickListener();
        }

        if (this._keypressListener) {
            this._keypressListener();
        }

        super.ngOnDestroy();
    }

    public get activeRoom(): RoomModel {
        return this.chatService.activeRoom;
    }

    public get activeItemIndex(): number {
        return this.rooms.findIndex((el) => el.id === this.activeRoom.id);
    }

    public set activeItemIndex(index: number) {
        this.chatService.setActiveRoom(this.rooms[index]?.id);
    }

    public get isMultiRoom(): boolean {
        return this.rooms.length > 1;
    }

    public selectClickHandler(): void {
        this.setIsExpanded(!this.isExpanded);
        this.cdr.markForCheck();
    }

    public selectKeypressHandler(event: KeyboardEvent): void {
        event.preventDefault();

        switch (event.key) {
            case 'Space':
                this.setIsExpanded(!this.isExpanded);
                break;
            case 'Enter':
                if (this.hoveredItemIndex) {
                    this.optionClickHandler(this.hoveredItemIndex - 1);
                } else {
                    this.setIsExpanded(!this.isExpanded);
                }
                break;
            case 'Escape':
                this.setIsExpanded(false);
                break;
            case 'ArrowUp':
                this.optionSelectHandler('up');
                break;
            case 'ArrowDown':
                this.optionSelectHandler('down');
                break;
        }
        this.cdr.markForCheck();
    }

    public optionClickHandler(index: number, setOpened: boolean = false): void {
        if (this.activeItemIndex !== index) {
            this.activeItemIndex = index;
            this.hoveredItemIndex = 0;
            this.setIsExpanded(setOpened);
        }
    }

    public listMouseenterHandler(): void {
        this.hoveredItemIndex = 0;
    }

    protected scrollList(): void {
        this.selectList?.nativeElement?.children[this.activeItemIndex]?.scrollIntoView({block: 'nearest'});
    }

    protected setIsExpanded(value: boolean): void {
        this.isExpanded = value;
        if (this.isExpanded) {
            merge(
                fromEvent(this.document, 'click'),
                fromEvent(this.document, 'touchstart'),
            ).pipe(
                first((event: MouseEvent) => {
                    return !this.elRef.nativeElement.contains(event.target as HTMLElement);
                }),
                takeUntil(this.destroy$),
                takeWhile(() => this.isExpanded),
            ).subscribe(() => {
                this.isExpanded = false;
                this.cdr.markForCheck();
            });
        }
    }

    private optionSelectHandler(dir: TKeyboardDir): void {
        let index: number = dir === 'down'
            ? this.hoveredItemIndex + 1
            : this.hoveredItemIndex - 1;

        if (index < 1) {
            index = this.rooms.length;
        } else if (index > this.rooms.length) {
            index = 1;
        }

        this.hoveredItemIndex = index;
        this.cdr.markForCheck();
    }

    private initListeners(): void {
        const currentRoom: HTMLElement = this.currentRoom?.nativeElement;

        if (this.isMultiRoom) {
            this._clickListener = this.renderer.listen(currentRoom, 'click', () => {
                this.selectClickHandler();
            });

            this._keypressListener = this.renderer.listen(currentRoom, 'keydown', (event: KeyboardEvent) => {
                this.selectKeypressHandler(event);
            });
        }
    }
}
