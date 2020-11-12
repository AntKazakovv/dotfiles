import {Injectable} from '@angular/core';
import {files as defaultFiles} from '../../config/files.config';
import {getFileBody} from 'wlc-svg/index';
import {getEngineFileBody} from 'wlc-engine/svg';
import {ConfigService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/interfaces';

import {
    get as _get,
    find as _find,
    findIndex as _findIndex,
    map as _map,
    reduce as _reduce,
    concat as _concat,
} from 'lodash';

type SourceFileType = 'wlc' | 'engine';

interface ISvgFile {
    name: string;
    source?: string;
    htmlString?: string;
}

interface IFileMeta {
    name: string;
    file: string;
    source: SourceFileType;
}

@Injectable()
export class FilesService {
    protected rowFileList: IFileMeta[] = [];
    protected svgFiles: ISvgFile[] = [];
    // protected base64Files: any[] = []; // soon

    constructor(
        protected configService: ConfigService,
    ) {
        this.init();
    }

    public getSvgFile(key: string): ISvgFile {
        const file: ISvgFile = _find(this.svgFiles, (item) => item.name === key);

        if (file) {
            return file;
        }

        const emptyFile: ISvgFile = {name: key};
        const fileMeta: IFileMeta = _find(this.rowFileList, ({name}) => name === key);

        if (!_get(fileMeta, 'name')) {
            return emptyFile;
        }

        try {
            const fileBody = fileMeta.source === 'wlc'
                ? getFileBody(fileMeta.file)
                : getEngineFileBody(fileMeta.file);

            return {
                name: key,
                htmlString: fileBody,
            };
        } catch (e) {
            return emptyFile;
        }
    }

    protected init(): void {
        const wlcFiles: IFileMeta[] = this.transformToFileMeta(
            this.configService.get<IIndexing<string>>('$files') || {});
        const engineFiles: IFileMeta[] = this.transformToFileMeta(defaultFiles, 'engine');

        this.rowFileList = this.mergeFileLists(wlcFiles, engineFiles);
    }

    protected transformToFileMeta(list: IIndexing<string>, source: SourceFileType = 'wlc'): IFileMeta[] {
        return _map(list, (file, name) => ({name, file, source}));
    }

    protected mergeFileLists(wlcFiles: IFileMeta[], engineFiles: IFileMeta[]): IFileMeta[] {
        return _reduce(_concat(wlcFiles, engineFiles), (acc, item) => {
            const index = _findIndex(acc, ({name}) => name === item.name);
            if (index < 0) {
                acc.push(item);
            } else if (item.source === 'wlc'){
                acc[index] = item;
            }
            return acc;
        }, []);
    }

}
