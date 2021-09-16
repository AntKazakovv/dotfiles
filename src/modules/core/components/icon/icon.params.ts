import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IIconCParams extends IComponentParams<string, string, string> {
    /**
     * If true, svg will be shown as image
     */
    showSvgAsImg?: boolean;
    fallback?: string;
    /* Path to the image, which is similar to the URL parameter of the `FilesService.getFileByUrl` */
    iconUrl?: string;
    /**
     * The key indicated in the "files" configuration file,
     * which is similar to the `KEY` parameter of the `FilesService.getSvgByName` method
     */
    iconName?: string;
    /**
     * An icon is searched for by 'folder / icon name'.
     * First locally in the engine and project using the $localFiles settings,
     * then in the folder root/static/images in project
     * and finally in gstatic
     */
    iconPath?: string;
}

export const defaultParams: IIconCParams = {
    moduleName: 'core',
    componentName: 'wlc-icon',
    class: 'wlc-icon',
};
