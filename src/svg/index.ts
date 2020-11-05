export function getEngineFileBody(name: string): string {
    return require(
        /* webpackMode: 'lazy' */
        /* webpackInclude: /\.svg/ */
        `!raw-loader!./${name}`,
    ).default;
}
