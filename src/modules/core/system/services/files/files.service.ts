import {Injectable} from '@angular/core';
import {localFiles} from '../../config/files.config';
import {getFileBody} from 'wlc-src/svg';
import imagesList from 'wlc-src/staticImagesList.json';
import {getEngineFileBody} from 'wlc-engine/svg';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {
    find as _find,
    findIndex as _findIndex,
    map as _map,
    reduce as _reduce,
    unionBy as _unionBy,
    flatten as _flatten,
    includes as _includes,
} from 'lodash';

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

    constructor(
        protected configService: ConfigService,
        private httpClient: HttpClient,
    ) {
        this.init();
    }

    public async getFileByUrl(url: string): Promise<IFile> {
        const fileUrl = this.normalizeFileUrl(url);

        let file: IFile = _find(this.stashedFiles, (item) => item.key === fileUrl);

        if (file) {
            return file;
        }

        const location: LocationFileType = _includes(imagesList, fileUrl)
            ? 'static'
            : 'gstatic';
        const fullUrl = this.getStaticFileUrl(location, fileUrl);

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
        try {
            const res: HttpResponse<string> = await this.httpClient.request('GET', url, {
                headers: {
                    'Cache-Control': 'public, max-age=31536000',
                },
                observe: 'response',
                responseType: 'text',
            }).toPromise();

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
