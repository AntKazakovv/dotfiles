import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ModifiersType = string;

export interface IDownloadPdf {
    use?: boolean;
    iconPath?: string;
}

export interface IPostCParams extends IComponentParams<string, string, string> {
    modifiers?: ModifiersType[];
    slug?: string;
    setTitle?: (title: string) => void;
    showTitle?: boolean,
    parseAsPlainHTML?: boolean;
    /**
     * if true - html puts via innerHTML without angular compilation;
     */
    withoutCompilation?: boolean;
    /**
     * Remove inline styles from html string;
     */
    shouldClearStyles?: boolean;
    /** Download PDF config */
    downloadPdf?: IDownloadPdf;
}

export const defaultParams: IPostCParams = {
    class: 'wlc-post',
    parseAsPlainHTML: false,
    downloadPdf: {
        iconPath: '/wlc/icons/download-pdf.svg',
    },
};
