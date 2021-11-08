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
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {VerificationService} from 'wlc-engine/modules/profile/system/services/verification/verification.service';
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
import {DocModel} from 'wlc-engine/modules/profile/system/models/doc.model';
import {DocGroupModel} from 'wlc-engine/modules/profile/system/models/doc-group.model';
import {IVerification} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';

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
    public fileTypes: string[];
    public acceptFormat: string;
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
    public verificationParams: IVerification;
    protected docTypes: IDocTypeResponse[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IVerificationCParams,
        protected configService: ConfigService,
        protected verificationService: VerificationService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected translate: TranslateService,
    ) {
        super(
            <IMixedParams<Params.IVerificationCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.injectParams);
        this.docTypes = await this.verificationService.getDocsTypes();
        this.fileTypes = await this.verificationService.getFileTypes();
        this.verificationParams = this.configService.get<IVerification>('$base.profile.verification');

        if (!this.docTypes.length || !this.fileTypes.length) {
            this.loaded = true;
            return this.cdr.markForCheck();
        }

        if (this.isSelectMode) {
            this.eventService.filter([{
                name: 'DROP_FILES',
            }])
                .pipe(takeUntil(this.$destroy))
                .subscribe(({data}: IEvent<IDroppedFiles>) => {
                    if (data.label === this.currentDocGroup.ID) {
                        this.preloadFile(data.files);
                    }
                });
        }

        this.acceptFormat = this.fileTypes.map(item => `.${item}`).join(', ');
        this.selectParams.items = this.selectItems();
        this.selectParams.control.setValue(this.docTypes[0].ID);
        this.selectParams.control.registerOnChange(this.setCurrentDocGroup.bind(this));
        await this.updateDocItems();
        this.currentDocGroup = this.docGroups[0];
        this.loaded = true;
    }

    /**
     * Check is select mode
     *
     * @returns {boolean}
     */
    public get isSelectMode(): boolean {
        return this.docTypes.length >= this.verificationParams.selectModeFrom
            || this.configService.get('$base.profile.type') === 'first';
    }

    /**
     * Update document items
     *
     * @returns {Promise<void>}
     */
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

    /**
     * Preload check file & preview
     *
     * @param {FileList} files
     * @returns {Promise<void>}
     */
    public async preloadFile(files: FileList): Promise<void> {
        if (files[0] && this.verificationService.checkFile(files[0], this.fileTypes, this.verificationParams.maxSize)) {
            this.currentDocGroup.preview = {
                base64: await this.verificationService.getPreview(files[0]),
                file: files[0],
            };
        }
        this.cdr.markForCheck();
    }

    /**
     * Upload file
     *
     * @returns {Promise<void>}
     */
    public async uploadFile(): Promise<void> {
        if (this.currentDocGroup.pending ||
            this.verificationService.checkUploadLimit(
                this.currentDocGroup.docs.length,
                this.verificationParams.maxDocsCount,
            )
        ) return;

        this.switchLoader(LoaderStatus.Loading);

        try {
            await this.verificationService.uploadFile(this.currentDocGroup.preview.file, this.currentDocGroup.ID);
            await this.updateDocItems();
        } finally {
            this.switchLoader();
            this.clearPreview();
        }
    }

    /**
     * Clear preview
     *
     * @returns {void}
     */
    public clearPreview(): void {
        this.currentDocGroup.preview = {};
        this.inputFile.nativeElement.value = '';
    }

    /**
     * Delete document
     *
     * @param {DocModel} doc
     * @returns {Promise<void>}
     */
    public async deleteDoc(doc: DocModel): Promise<void> {
        doc.switchLoader(LoaderStatus.Deleting);
        this.cdr.markForCheck();

        try {
            await this.verificationService.deleteDoc(doc);
            await this.updateDocItems();
        } catch (error) {
        }
    }

    /**
     * Get documents types
     *
     * @returns {ISelectOptions[]}
    */
    protected selectItems(): ISelectOptions[] {
        return _map(this.docTypes, ({ID, Name}) => {
            return {
                value: ID,
                title: this.translate.instant(ID) !== ID ? this.translate.instant(ID) : Name,
            };
        });
    }

    protected setCurrentDocGroup(id: string): void {
        this.currentDocGroup = _find(this.docGroups, ({ID}) => ID === id);
    }

    protected switchLoader(status: LoaderStatus = LoaderStatus.Ready): void {
        this.currentDocGroup.switchLoader(status);
        this.cdr.markForCheck();
    }
}
