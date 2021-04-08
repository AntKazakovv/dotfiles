import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {
    DocGroupModel,
    DocModel,
    IDroppedFiles,
    LoaderStatus,
    VerificationService,
} from 'wlc-engine/modules/profile';
import * as Params from './verification-group.params';

@Component({
    selector: '[wlc-verification-group]',
    templateUrl: './verification-group.component.html',
    styleUrls: ['./styles/verification-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: true,
})
export class VerificationGroupComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input('doc-group') public currentDocGroup: DocGroupModel;
    @Output() protected needUpdate = new EventEmitter<void>();
    public $params: Params.IVerificationGroupCParams;

    constructor(
        protected configService: ConfigService,
        protected verificationService: VerificationService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IVerificationGroupCParams>>{
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit({
            ...this.verificationService.params,
        } as Params.IVerificationGroupCParams);

        this.eventService.subscribe({
            name: 'DROP_FILES',
        }, (data: IDroppedFiles) => {
            if (data.label === this.currentDocGroup.ID) {
                this.uploadFile(data.files, data.label);
            }
        });
    }

    public ngOnChanges() {
        this.switchLoader();
    }

    public async uploadFile(files: FileList, docLabel: string): Promise<void> {
        if (this.currentDocGroup.pending || !files.length) {
            return;
        }
        this.switchLoader(LoaderStatus.Loading);

        try {
            await this.verificationService.uploadFile(files[0], docLabel);
            this.needUpdate.emit();
        } catch (error) {
            this.switchLoader();
        }
    }

    public async deleteDoc(doc: DocModel): Promise<void> {
        if (this.currentDocGroup.pending) {
            return;
        }
        this.switchLoader(LoaderStatus.Deleting);
        doc.switchLoader(LoaderStatus.Deleting);
        try {
            await this.verificationService.deleteDoc(doc);
            this.needUpdate.emit();
        } catch (error) {
            doc.switchLoader(LoaderStatus.Ready);
            this.switchLoader();
        }
    }

    protected switchLoader(status: LoaderStatus = LoaderStatus.Ready): void {
        this.currentDocGroup.switchLoader(status);
        this.cdr.markForCheck();
    }
}
