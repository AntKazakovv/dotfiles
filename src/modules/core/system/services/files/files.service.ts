import {Injectable} from '@angular/core';
import {localFiles} from '../../config/files.config';
import {getFileBody} from 'wlc-src/svg';
import imagesList from 'wlc-src/staticImagesList.json';
import {getEngineFileBody} from 'wlc-engine/svg';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {HttpClient, HttpResponse} from '@angular/common/http';

import _find from 'lodash-es/find';
import _findIndex from 'lodash-es/findIndex';
import _map from 'lodash-es/map';
import _reduce from 'lodash-es/reduce';
import _unionBy from 'lodash-es/unionBy';
import _flatten from 'lodash-es/flatten';
import _includes from 'lodash-es/includes';

type LocationFileType =
    'local-wlc'
    | 'local-engine'
    | 'gstatic'
    | 'static';

type FileTypeType = 'svg' | 'bin';

interface IFileMeta {
    name: string;
    type: FileTypeType,
    path?: string;
    location: LocationFileType;
}

export interface IFile {
    key: string;
    location?: LocationFileType;
    htmlString?: string;
    url?: string;
}

@Injectable()
export class FilesService {
    protected rowFileList: IFileMeta[] = [];
    protected stashedFiles: IFile[] = [];
    protected fetchedFiles: IIndexing<string> = {};
    protected getFileRequests: IIndexing<Promise<IFile>> = {};

    constructor(
        protected configService: ConfigService,
        private httpClient: HttpClient,
    ) {
        this.init();
    }

    public async getFile(filePath: string): Promise<IFile> {
        if (!filePath) {
            return {key: filePath};
        }
        if (this.getFileRequests[filePath]) {
            return this.getFileRequests[filePath];
        }
        const findFilePromise = this.findFile(filePath);
        this.getFileRequests[filePath] = findFilePromise;

        return await findFilePromise;
    }

    public async getFileByUrl(url: string): Promise<IFile> {
        let file: IFile;
        let fileUrl: string;
        let fullUrl: string;
        let location: LocationFileType;

        if (url.indexOf('http') >= 0) {
            fullUrl = fileUrl = url;
        } else {
            fileUrl = this.normalizeFileUrl(url);

            file = _find(this.stashedFiles, (item) => item.key === fileUrl);
            if (file) {
                return file;
            }

            location = _includes(imagesList, fileUrl)
                ? 'static'
                : 'gstatic';
            fullUrl = this.getStaticFileUrl(location, fileUrl);
        }

        file = this.getFileType(fileUrl) === 'bin'
            ? {
                key: fileUrl,
                location,
                url: fullUrl,
            } : {
                key: fileUrl,
                location,
                url: fullUrl,
                htmlString: await this.fetchStaticFile(fullUrl),
            };

        this.stashFile(file);
        return file;
    }

    public getSvgByName(key: string): IFile {
        const fileMeta: IFileMeta = _find(this.rowFileList, (item) => item.name === key);

        if (!fileMeta) {
            return {key};
        }

        try {
            const htmlString = fileMeta.location === 'local-wlc'
                ? getFileBody(fileMeta.path)
                : getEngineFileBody(fileMeta.path);

            const svg: IFile = {
                key,
                location: fileMeta.location,
                htmlString,
            };

            this.stashFile(svg);
            return svg;

        } catch (e) {
            return {key};
        }
    }

    protected async findFile(filePath: string): Promise<IFile> {
        let file: IFile = {key: filePath};
        if (!filePath) {
            return file;
        }

        const path: string = filePath.replace(/\.[^/]+$/, '');
        file = this.getSvgByName(path);
        if (!file.location) {
            file = await this.getFileByUrl(filePath);

            if (file.url) {
                const fileData = await this.fetchStaticFile(file.url);
                if (!fileData) {
                    return {key: filePath};
                }
            }
        }
        return file;
    }

    protected normalizeFileUrl(fileUrl: string): string {
        return fileUrl[0] === '/' ? fileUrl : '/' + fileUrl;
    }

    protected getStaticFileUrl(location: LocationFileType, fileName: string): string {
        if (location === 'gstatic') {
            return `/gstatic${fileName}`;
        } else {
            return `/static/images${fileName}`;
        }
    }

    protected init(): void {
        const wlcFiles = this.configService.get<IIndexing<string>>('$localFiles');

        this.rowFileList = this.mergeFileLists([
            this.transformToFileMeta(wlcFiles, 'local-wlc'),
            this.transformToFileMeta(localFiles, 'local-engine'),
        ]);
    }

    protected stashFile(file: IFile): void {
        this.stashedFiles = _unionBy(this.stashedFiles, [file], 'name');
    }

    protected async fetchStaticFile(url: string): Promise<string> {
        if (this.fetchedFiles[url]) {
            return this.fetchedFiles[url];
        }

        try {
            const res: HttpResponse<string> = await this.httpClient.request('GET', url, {
                headers: {
                    'Cache-Control': 'public, max-age=31536000',
                },
                observe: 'response',
                responseType: 'text',
            }).toPromise();

            this.fetchedFiles[url] = res.body;
            return res.body;
        } catch (e) {
            return undefined;
        }
    }

    protected transformToFileMeta(list: IIndexing<string>, location: LocationFileType): IFileMeta[] {
        return _map(list, (path, name) => ({
            name,
            path,
            location,
            type: this.getFileType(path),
        }));
    }

    protected mergeFileLists(lists: IFileMeta[][]): IFileMeta[] {
        return _reduce(_flatten(lists), (acc, item) => {
            const index = _findIndex(acc, ({name}) => name === item.name);
            if (index < 0) {
                acc.push(item);
            } else if (_includes(item.location, 'wlc')) {
                acc[index] = item;
            }
            return acc;
        }, []);
    }

    protected getFileType(fileName: string): FileTypeType {
        return /\.svg$/i.test(fileName) ? 'svg' : 'bin';
    }
}
