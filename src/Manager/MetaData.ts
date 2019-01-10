import { Record, ISysMetadata, Instance } from "../ServiceNow/all";
import { KeyValuePair } from "./all";
import { Uri, workspace } from "vscode";
import { FileTypes } from "./FileTypes";

/**
 * Record meta data object. Contains Instanse metadata aswell as files references to local files. 
 */
export class MetaData extends Record
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
     * use getFileUri() to get full URI relatively to workspace directory. 
     */
    public Files: Array<KeyValuePair<FileTypes, Uri>>;

    /**
     * name of the record
     */
    public RecordName: string;
    /**
     * record base path.
     */
    public basePath: Uri;

    /**
     * name of the instance 
     */
    public instanceName: string;

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

    /**
     * returns true if this metadata object contains a reference to the file provided.
     * @param uri VsCode Uri object
     */
    public ContainsFile(uri: Uri): boolean
    {
        let out = false;
        let fileTypes = MetaData.getFileTypes();

        fileTypes.forEach(element =>
        {
            //get relative uri
            var u = this.getFileUri(element);
            if (u && u.fsPath === uri.fsPath)
            {
                out = true;
            }
        });

        return out;
    }

    /**
    * returns all suported file types in an array. 
    */
    public static getFileTypes()
    {
        return [FileTypes.clientScript, FileTypes.html, FileTypes.serverScript, FileTypes.styleSheet];
    }

    public toJSON()
    {
        let b = super.toJSON();
        return {
            sys_class_name: b.sys_class_name,
            sys_id: b.sys_id,
            sys_policy: b.sys_policy,
            sys_updated_on: b.sys_updated_on,
            sys_created_on: b.sys_created_on,
            sys_package: b.sys_package,
            sys_scope: b.sys_scope,
            Files: this.Files,
            RecordName: this.RecordName,
            basePath: this.basePath,
            instanceName: this.instanceName,
        };
    }
}