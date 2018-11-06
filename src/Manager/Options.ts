import { Record, ISysMetadata, Instance } from "../ServiceNow/all";
import { KeyValuePair } from "./all";
import { Uri, workspace } from "vscode";
import { FileTypes } from "./FileTypes";

export class Options extends Record
{
    /**
     * Record MetaData and file references.
     */
    constructor(r: ISysMetadata, files: Array<KeyValuePair<FileTypes, Uri>>, instance: Instance, recordName: string)
    {
        super(r);
        this.Files = files;
        this.RecordName = recordName;
        if (instance.Url)
        {
            this.instanceName = instance.Url.host;
        }
        else
        {
            throw new Error("Instance object do not contain a Url");
        }

        if (workspace.rootPath)
        {
            this.basePath = Uri.parse(`file:${workspace.rootPath}/${this.instanceName}`);
        }
        else
        {
            throw new Error("Workspace is required");
        }
    }

    /**
     * Keyvaluepair fil uri. key is scripttype
     */
    private Files: Array<KeyValuePair<FileTypes, Uri>>;

    /**
     * name of the record
     */
    RecordName: string;
    /**
     * record base path.
     */
    basePath: Uri;

    /**
     * name of the instance 
     */
    instanceName: string;

    /**
     * getFileUri
     */
    public getFileUri(type: FileTypes): Uri | undefined
    {
        var uri = this.Files.find((item) =>
        {
            return item.key === type;
        });

        if (uri)
        {
            //build new uri reltive to workspace root.
            return Uri.parse(`${this.getRecordUri()}${uri.value.fsPath}`);
        }
    }

    /**
     * get a Uri for the folder for all records of this class
     */
    public getSysClassUri(): Uri
    {
        return Uri.parse(`${this.basePath}/${this.sys_class_name}`);
    }

    /**
     * get an Uri for the folder for this record and all scripts
     */
    public getRecordUri(): Uri
    {
        return Uri.parse(`${this.basePath}/${this.sys_class_name}/${this.RecordName}`);
    }
}