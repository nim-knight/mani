/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Interface for custom conversion between JSON objects and TypeScript objects.
 *
 * You have to implement two methods:
 * - serialize() to map a TypeScript object to a JSON object
 * - deserialize() to map a JSON object to a TypeScript object
 *
 * @see https://www.npmjs.com/package/json2typescript full documentation on NPM$
 */
export interface JsonCustomConvert<T> {

    /**
     * Converts an incoming TypeScript object to a plain JSON object.
     * Please note that the argument or resulting object can be primitive.
     *
     * @param data TypeScript object
     *
     * @return {any} JSON object
     */
    serialize(data: T): any;

    /**
     * Converts an incoming JSON object object to a TypeScript object.
     * Please note that the argument or resulting object can be primitive.

     * @param data JSON object
     *
     * @return {any} TypeScript object
     */
    deserialize(data: any): T;

}
