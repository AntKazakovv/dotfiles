import {Injectable} from '@angular/core';

import _includes from 'lodash-es/includes';
import _toArray from 'lodash-es/toArray';

import {
    DataService,
    EventService,
    IData,
    NotificationEvents,
    LogService,
} from 'wlc-engine/modules/core';
import {DocModel} from 'wlc-engine/modules/profile/system/models/doc.model';
import {
    IUserDoc,
    IDocType,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

@Injectable({
    providedIn: 'root',
})
export class VerificationService {

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
    ) {
        this.init();
    }

    public async getDocsTypes(): Promise<IDocType[]> {
        try {
            return (await this.dataService.request<IData>('docs/docs-types'))?.data;
        } catch (error) {
            this.logService.sendLog({
                code: '9.0.2',
                from: {
                    service: 'VerificationService',
                    method: 'getDocsTypes',
                },
                data: error,
            });
            return [];
        }
    }

    public async getFileTypes(): Promise<string[]> {
        try {
            return _toArray((await this.dataService.request<IData>('docs/docs-extensions'))?.data);
        } catch (error) {
            this.logService.sendLog({
                code: '9.0.3',
                from: {
                    service: 'VerificationService',
                    method: 'getFileTypes',
                },
                data: error,
            });
            return [];
        }
    }

    public async getUserDocs(): Promise<IUserDoc[]> {
        try {
            return (await this.dataService.request<IData>('docs/docs-list'))?.data;
        } catch (error) {
            this.logService.sendLog({
                code: '9.0.4',
                from: {
                    service: 'VerificationService',
                    method: 'getUserDocs',
                },
                data: error,
            });
            return [];
        }
    }

    public async uploadFile(file: File, docLabel: string): Promise<IData> {
        const formData = new FormData();
        formData.append('file1', file);
        formData.append('Description', docLabel);
        formData.append('DocType', docLabel);

        try {
            const result = await this.dataService.request<IData>('docs/send-file', formData);
            this.showSuccess(gettext('Document uploaded successfully'));

            return result;
        } catch (result) {
            this.logService.sendLog({
                code: '9.0.5',
                from: {
                    service: 'VerificationService',
                    method: 'uploadFile',
                },
                data: result,
            });
            this.showError(result.errors);
            return Promise.reject(result);
        }
    }

    public async deleteDoc(doc: DocModel): Promise<IData> {
        try {
            const result = await this.dataService.request<IData>({
                name: 'docs-delete',
                url: `/docs/${doc.id}`,
                type: 'DELETE',
                system: 'docs',
            });
            this.showSuccess(gettext('Document deleted successfully'));

            return result;
        } catch (result) {
            this.logService.sendLog({
                code: '9.0.6',
                from: {
                    service: 'VerificationService',
                    method: 'deleteDoc',
                },
                data: result,
            });
            this.showError(result.errors);
            return Promise.reject(result);
        }

    }

    public showError(message: string | string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'error',
                title: gettext('Verification Error'),
                message,
            },
        });
    }

    public showSuccess(message: string | string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'success',
                title: gettext('Verification'),
                message,
            },
        });
    }

    public checkFile(file: File, fileTypes: string[], maxSize: number): boolean {
        const extension = file.name.split('.').pop();

        if (file.size > maxSize * 1000000) {
            this.showError('No valid size');
            return false;
        }

        if (!_includes(fileTypes, extension)) {
            this.showError('No valid format');
            return false;
        }

        return true;
    }

    public async getPreview(file: File): Promise<string> {
        const reader = new FileReader();
        return new Promise((done) => {
            reader.onload = function (evt) {
                done(evt.target.result as string);
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * Check uploaded files count less or equal to max docs count limit
     *
     * @param {number} docsCount Uploaded files count
     * @param {number} maxDocsCount Max available docs count
     * @returns {boolean}
     */
    public checkUploadLimit(docsCount: number, maxDocsCount: number): boolean {
        const check: boolean = docsCount >= maxDocsCount;
        if (check) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: {
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('You cannot upload more documents of this type'),
                },
            });
        }
        return check;
    }


    private init(): void {
        this.dataService.registerMethod({
            name: 'docs-types',
            url: '/docs/types',
            // TODO return cache
            //cache: 60 * 1000 * 10, // 10 min
            type: 'GET',
            system: 'docs',
        });

        this.dataService.registerMethod({
            name: 'docs-list',
            url: '/docs',
            type: 'GET',
            system: 'docs',
        });

        this.dataService.registerMethod({
            name: 'docs-extensions',
            url: '/docs/extensions',
            type: 'GET',
            system: 'docs',
        });

        this.dataService.registerMethod({
            name: 'send-file',
            url: '/docs',
            type: 'POST',
            system: 'docs',
        });
    }
}
