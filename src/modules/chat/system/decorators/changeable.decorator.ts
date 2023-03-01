//TODO: fix decorator
// const metadataKey = Symbol('Changeable');

// function registerProperty(target: object, propertyKey: string): void {
//     let properties: string[] = (Reflect as any).getMetadata(metadataKey, target);

//     if (properties) {
//         properties.push(propertyKey);
//     } else {
//         properties = [propertyKey];
//         (Reflect as any).defineMetadata(metadataKey, properties, target);
//     }
// }

// export function Changeable(): (target: object, propertyKey: string) => void {
//     return registerProperty;
// }

// export function getChangeableProperties(origin: object): string[] {
//     const properties: string[] = (Reflect as any).getMetadata(metadataKey, origin);
//     const result = {};
//     properties.forEach(key => result[key] = origin[key]);
//     return Object.keys(result);
// }
