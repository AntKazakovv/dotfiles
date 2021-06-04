import {
    Component,
    OnInit,
    Input,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    EventService,
    GlobalHelper,
    InteractiveTextEvents,
    InteractiveTextService,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './link-block.params';

@Component({
    selector: '[wlc-link-block]',
    templateUrl: './link-block.component.html',
    styleUrls: ['./styles/link-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkBlockComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.ILinkBlockCParams;
    @Input() public actionParams: Params.IActionParams;
    @Input() public link: string;
    @Input() public subtitle: string;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public title: string;
    @Input() public useInteractiveText: boolean;
    @Input() public useLinkButton: boolean;

    public $params: Params.ILinkBlockCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILinkBlockCParams,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected router: UIRouter,
        protected cdr: ChangeDetectorRef,
        protected interactiveTextService: InteractiveTextService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        const inputProperties: string[] = [
            'title', 'subtitle', 'link', 'actionParams', 'useInteractiveText', 'useLinkButton',
        ];
        super.ngOnInit(GlobalHelper.prepareParams(this, inputProperties));

        if (this.$params.common.useInteractiveText) {
            this.setInteractiveText();
            this.subscribeForInteractiveText();
        }
    }

    public goTo(data: Params.IActionParams): void {
        if (!data) return;

        if (data.modal) {
            this.modalService.showModal(data.modal.name);
            return;
        } else if (data.url) {
            this.router.stateService.go(data.url.path, data.url.params);
            return;
        } else if (data.event) {
            this.eventService.emit({
                name: data.event.name,
            });
        }
    }


    protected setInteractiveText(): void {

        const interactiveText = this.interactiveTextService.getInteractiveText();

        this.$params.common.title = interactiveText.title;
        this.$params.common.link = interactiveText.text;
        this.$params.common.actionParams.url = interactiveText.actionParams.url;

        this.cdr.markForCheck();
    }

    protected subscribeForInteractiveText(): void {
        this.eventService.filter([
            {name: InteractiveTextEvents.ChangeText},
        ])
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.setInteractiveText();
            });
    }
}
