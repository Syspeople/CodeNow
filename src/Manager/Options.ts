import { ISysMetadata, Record, Instance } from "../ServiceNow/all";
import { Uri } from 'vscode';
import { WorkspaceManager } from "./WorkspaceManager";

//class for storing options and file references in local cache.
export class RecordOptions extends Record implements ISysMetadata
{
    /**
     *  Create objects. Provides file path information for a given record. 
     */
    constructor(record: ISysMetadata, path: Uri)
    {
        super(record);
        //let recordPath = path;

        //file for specific records. 
        let MetaDir: string;
        //name of the record.
        let recordName: string;
    }

    private _files: Array<Uri> = [];
    public get files(): Array<Uri>
    {
        return this._files;
    }
}