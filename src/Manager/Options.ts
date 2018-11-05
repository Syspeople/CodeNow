import { Record, ISysMetadata } from "../ServiceNow/all";
import { KeyValuePair } from "./all";
import { Uri } from "vscode";

export class Options extends Record
{
    /**
     * Record MetaData and file references.
     */
    constructor(r: ISysMetadata, files: Array<KeyValuePair>, basePath: Uri)
    {
        super(r);
        this.Files = files;

    }
    Files: Array<KeyValuePair>;
    basePath: Uri;
}