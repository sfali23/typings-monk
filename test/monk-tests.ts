/// <reference path="../typings/index.d.ts" />
/// <reference path="./bundle.d.ts" />

import {Manager, Collection} from 'monk';

import monk = require("monk");

const MONGO_DATABASE_URI: string = "localhost:27017/myproject";

export class MonkTest {
    private manager: Manager;
    private collection: Collection;
    private folderCollection: Collection;
    private orderCollection: Collection;

    constructor() {
        
        this.manager = monk(MONGO_DATABASE_URI);

        this.collection = this.manager.get("test");
        this.folderCollection = this.manager.get("folder");
        this.orderCollection = this.manager.get("order");
        this.dropCollections();

        this.collection = this.manager.create("test");
        console.log("Collection {%s} created.", this.collection.name);
        this.folderCollection = this.manager.create("folder");
        console.log("Collection {%s} created", this.folderCollection.name);
        this.orderCollection = this.manager.create("order");
        console.log("Collection {%s} created", this.orderCollection.name);
    }

    public static main(): void {
        let test: MonkTest = new MonkTest();
        test.clean();
        test.createIndices();
        test.aggregate();
        test.insertSingleDocument();
        test.insertMultipleDocuments();
        test.preGeneratedId();
        setTimeout(function () {
            test.manager.close();
        }, 5000);
    }

    public aggregate(): void {
        this.orderCollection.insert([
            { _id: 1, cust_id: "abc1", ord_date: new Date("2012-11-02T17:04:11.102Z"), status: "A", amount: 50 },
            { _id: 2, cust_id: "xyz1", ord_date: new Date("2013-10-01T17:04:11.102Z"), status: "A", amount: 100 },
            { _id: 3, cust_id: "xyz1", ord_date: new Date("2013-10-12T17:04:11.102Z"), status: "D", amount: 25 },
            { _id: 4, cust_id: "xyz1", ord_date: new Date("2013-10-11T17:04:11.102Z"), status: "D", amount: 125 },
            { _id: 5, cust_id: "abc1", ord_date: new Date("2013-11-12T17:04:11.102Z"), status: "A", amount: 25 }
        ])
            .then(results => {
                let documents: Object[] = <Object[]>results;
                console.log("Number of documents inserted fot aggregation: %s", documents.length);
                this.orderCollection.aggregate([
                    { $match: { status: "A" } },
                    { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
                    { $sort: { total: -1 } }
                ])
                    .then(results => {
                        console.log("Aggregate result: %s", JSON.stringify(results));
                    });
            });
    }


    public createIndices(): void {
        this.folderCollection.index({ "name": 1 })
            .then(indexName => console.log(indexName));
        this.folderCollection.index({ "parentPath": 1 })
            .then(indexName => console.log(indexName));
        this.folderCollection.index({ "path": 1 }, { unique: true })
            .then(indexName => console.log(indexName));
    }

    public insertSingleDocument(): void {
        this.collection.insert({ "a": 1 })
            .then(result => {
                console.log("Inserted single document");
                printDocument(result, "a");
            });
    }

    public insertMultipleDocuments(): void {
        this.collection.insert([{ a: 2 }, { a: 3 }])
            .then(results => {
                console.log("Inserted multiple documents");
                let documents: Object[] = <Object[]>results;
                documents.forEach(document => {
                    printDocument(document, "a");
                });
            });
    }

    public preGeneratedId(): void {
        let id: any = monk.id();
        this.folderCollection.insert({ "_id": id, "name": "/", "path": "/", "parentPath": "" })
            .then(result => {
                let folder: Folder = <Folder>result;
                console.log("Generated ID: %s, ID returned from insert: %s", id, folder._id);
            });
    }

    public clean(): void {
        this.collection.remove()
            .then(result => console.log("Remove documents: %s", JSON.stringify(result)));
        this.collection.dropIndexes()
            .then(result => console.log(JSON.stringify(result)));
        this.folderCollection.remove()
            .then(result => console.log("Remove documents: %s", JSON.stringify(result)));
        this.folderCollection.dropIndexes()
            .then(result => console.log(JSON.stringify(result)));
        this.orderCollection.remove()
            .then(result => console.log("Remove documents: %s", JSON.stringify(result)));
        this.orderCollection.dropIndexes()
            .then(result => console.log(JSON.stringify(result)));
    }

    public dropCollections(): void {
        this.collection.drop()
            .then(dropped => {
                let name: string = this.collection.name;
                let msg: string = dropped ? "Collection {" + name + "} successfully dropped" : "Failed to drop collection {" + name + "}";
                console.log(msg);
            });
        this.folderCollection.drop()
            .then(dropped => {
                let name: string = this.folderCollection.name;
                let msg: string = dropped ? "Collection {" + name + "} successfully dropped" : "Failed to drop collection {" + name + "}";
                console.log(msg);
            });
        this.orderCollection.drop()
            .then(dropped => {
                let name: string = this.orderCollection.name;
                let msg: string = dropped ? "Collection {" + name + "} successfully dropped" : "Failed to drop collection {" + name + "}";
                console.log(msg);
            });
    }
}

MonkTest.main();

export interface Folder {
    _id?: any;
    name: string;
    parentPath: string;
    path: string;
}

export class NewFolder implements Folder {
    constructor(public name?: string, public path?: string, public parentPath?: string) { }
}

function printDocument(document: any, otherProperty?: string) {
    console.log("Document inserted");
    console.log("    ID: %s", document["_id"]);
    if (otherProperty) {
        console.log("    %s: %s", otherProperty, document[otherProperty]);
    }
    console.log("");
}
