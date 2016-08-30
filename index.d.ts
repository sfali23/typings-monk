// Type definitions for Monk v3.x
// Project https://github.com/Automattic/monk
// Definitions by: Syed Farhan Ali - https://github.com/sfali23
// // Definitions: https://github.com/DefinitelyTyped/Monk

import {Promise} from 'es6-promise';

declare interface Monk {
    (uri: string, options?: Object, calback?: Object): Monk.Manager;
    id(id?: string): any;
}

declare namespace Monk {
    interface Manager {

        get(collection: string): Collection;

        create(collection: string): Collection;

        close(force?: boolean, callback?: Function): void;

        then(callback: Function): Promise<Manager>;

        catch(callback: Function): Promise<Manager>;
    } // end of class "Manager"

    interface Collection {
        /**
         * Name of collection
         */
        name: string;

        aggregate(pipeline: Object, options?: Object, callback?: Function): Promise<Object>;

        bulkWrite(operations: Object, options?: Object, callback?: Function): Promise<Object>;

        count(query?: Object, options?: Object, callback?: Function): Promise<Number>;

        distinct(field: string, query?: Object, options?: Object, callback?: Function): Promise<Object>;

        drop(callback?: Function): Promise<Boolean>;

        dropIndex(index: Object, options?: Object, callback?: Function): Promise<Object>;

        dropIndexes(callback?: Function): Promise<Object>;

        index(fieldOrSpec: Object, options?: Object, callback?: Function): Promise<string>;

        ensureIndex(fieldOrSpec: Object, options?: Object, callback?: Function): Promise<string>;

        find(query?: Object, options?: Object, callback?: Function): Promise<Object[]>;

        findOne(query: Object, options?: Object, callback?: Function): Promise<Object>;

        findOneAndDelete(query: Object, options?: Object, callback?: Function): Promise<Object>;

        findOneAndUpdate(query: Object, update: Object, options?: Object, callback?: Function): Promise<Object>;

        group(keys: Object, condition: Object, initial: Object, reduce: Function, finalize?: Function, command?: Boolean, options?: Object, callback?: Object): Promise<Object>;

        indexes(callback?: Function): Promise<Object[]>;

        insert(docs: Object, options?: Object, callback?: Function): Promise<any>;

        remove(query?: Object, options?: Object, callback?: Function): Promise<Object>;

        update(query: Object, update: Object, options?: Object, callback?: Function): Promise<Object[]>;
    } // end of class "Collector"
}

declare var Monk: Monk;

export = Monk;

