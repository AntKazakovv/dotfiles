import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    OnInit,
} from '@angular/core';
import {takeUntil} from 'rxjs';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';
import {DialogService} from 'wlc-engine/modules/chat/system/services/dialog.service';
import {DialogModel} from 'wlc-engine/modules/chat/system/classes/dialog.model';

@Component({
    selector: '[wlc-dialog]',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent extends AbstractChatComponent implements OnInit {

    constructor(
        protected dialogService: DialogService,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
    ) {
        super('wlc-dialog');
    }

    public ngOnInit(): void {
        this.cdr.detach();

        this.dialogService.dialogs$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.switchMod('opened', !!this.dialogs.length);
                setTimeout(() => {
                    this.cdr.detectChanges();
                });
            });
    }

    public get dialogs(): DialogModel<unknown>[] {
        return this.dialogService.dialogs;
    }

    public trackById(index: number, dialog: DialogModel<unknown>): string {
        return dialog.id;
    }

    public getInjector(dialog: DialogModel<unknown>): Injector {
        return Injector.create({
            providers: [
                {
                    provide: 'params',
                    useValue: Object.assign({}, dialog.params.componentParams || {}),
                },
                {
                    provide: 'dialog',
                    useValue: dialog,
                },
            ],
            parent: this.injector,
        });
    }


}
