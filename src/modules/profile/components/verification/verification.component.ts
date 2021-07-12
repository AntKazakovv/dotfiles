import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IEvent} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';

import {
    IDoc,
    IDocTypeResponse,
    IDroppedFiles,
    LoaderStatus,
    ISelectOptions,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

import {VerificationService} from 'wlc-engine/modules/profile/system/services/verification/verification.service';
import {DocModel} from 'wlc-engine/modules/profile/system/models/doc.model';
import {DocGroupModel} from 'wlc-engine/modules/profile/system/models/doc-group.model';

import * as Params from './verification.params';

import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';

@Component({
    selector: '[wlc-verification]',
    templateUrl: './verification.component.html',
    styleUrls: ['./styles/verification.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationComponent extends AbstractComponent implements OnInit {
    @ViewChild('inputFile') public inputFile: ElementRef<HTMLInputElement>;
    public docGroups: DocGroupModel[];
    public currentDocGroup: DocGroupModel;
    public loaded: boolean = false;
    public $params: Params.IVerificationCParams;
    public selectParams: ISelectCParams = {
        labelText: gettext('Type document'),
        theme: 'vertical',
        common: {},
        name: undefined,
        items: [],
        control: new FormControl(''),
    };

    private docTypes: IDocTypeResponse[];
    public acceptFormat: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IVerificationCParams,
        protected configService: ConfigService,
        protected verificationService: VerificationService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IVerificationCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get selectItems(): ISelectOptions[] {
        return _map(this.docTypes, ({ID, Name}) => {
            return {
                value: ID,
                title: Name,
            };
        });
    }

    public get isSelectMode(): boolean {
        return this.docTypes.length >= this.$params.selectModeFrom
            || this.configService.get('$base.profile.type') === 'first';
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit({
            ...this.verificationService.params,
            ...this.injectParams,
        } as Params.IVerificationCParams);
        this.docTypes = await this.verificationService.getDocsTypes();
        if (!this.docTypes.length) {
            this.loaded = true;
            return this.cdr.markForCheck();
        }

        this.eventService.filter([{
            name: 'DROP_FILES',
        }])
            .pipe(takeUntil(this.$destroy))
            .subscribe(({data}: IEvent<IDroppedFiles>) => {
                if (data.label === this.currentDocGroup.ID) {
                    this.preloadFile(data.files);
                }
            });

        this.acceptFormat = this.verificationService.acceptFormat();

        this.selectParams.items = this.selectItems;
        this.selectParams.control.setValue(this.docTypes[0].ID);
        this.selectParams.control.registerOnChange(this.setCurrentDocGroup.bind(this));
        await this.updateDocItems();
        this.currentDocGroup = this.docGroups[0];
        this.loaded = true;
    }

    public async updateDocItems(): Promise<void> {
        const docs: IDoc[] = await this.verificationService.getUserDocs();
        this.docGroups = _map(this.docTypes, (docType: IDocTypeResponse) => {
            const userDocs: IDoc[] = _filter(docs, (userDoc: IDoc) => {
                return docType.TypeKey === userDoc.DocType;
            });
            return new DocGroupModel(
                docType,
                _map(userDocs, (doc) => new DocModel(doc, this.$params.iconPath)),
                this.isSelectMode,
                this.$params.iconPath);
        });
        if (this.currentDocGroup) {
            this.setCurrentDocGroup(this.currentDocGroup.ID);
        }
        this.cdr.markForCheck();
    }

    public async preloadFile(files: FileList): Promise<void> {
        if (files[0] && this.verificationService.checkFile(files[0])) {
            this.currentDocGroup.preview = {
                base64: await this.verificationService.getPreview(files[0]),
                file: files[0],
            };
        }
        this.cdr.markForCheck();
    }

    public async uploadFile(): Promise<void> {
        if (this.currentDocGroup.pending) {
            return;
        }

        if (this.verificationService.checkUploadLimit(this.currentDocGroup.docs.length)) return;

        this.switchLoader(LoaderStatus.Loading);

        try {
            await this.verificationService.uploadFile(this.currentDocGroup.preview.file, this.currentDocGroup.ID);
            await this.updateDocItems();
        } finally {
            this.switchLoader();
            this.clearPreview();
        }
    }

    public clearPreview() {
        this.currentDocGroup.preview = {};
        this.inputFile.nativeElement.value = '';
    }

    public async deleteDoc(doc: DocModel): Promise<void> {
        doc.switchLoader(LoaderStatus.Deleting);
        this.cdr.markForCheck();

        try {
            await this.verificationService.deleteDoc(doc);
            await this.updateDocItems();
        } catch (error) {
        }
    }

    protected setCurrentDocGroup(id: string) {
        this.currentDocGroup = _find(this.docGroups, ({ID}) => ID === id);
    }

    protected switchLoader(status: LoaderStatus = LoaderStatus.Ready): void {
        this.currentDocGroup.switchLoader(status);
        this.cdr.markForCheck();
    }

}
