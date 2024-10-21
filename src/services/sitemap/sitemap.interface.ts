export interface ISitemapService {
    // Downloads the sitemap.xml if the autotest cookie is set
    downloadXml(): Promise<void>;
}
