import { Record, ISysMetadata } from "../ServiceNow/all";
import { KeyValuePair, ILocalMetaData } from "./all";
import { Uri, workspace } from "vscode";
import { FileTypes } from "./FileTypes";

/**
 * Record meta data object. Contains Instanse metadata aswell as files references to local files. 
 */
export class MetaData extends Record implements ILocalMetaData
{
    /**
     * Record MetaData and file references.
     */
    constructor(r: ISysMetadata, files: Array<KeyValuePair<FileTypes, Uri>>, instanceName: string, recordName: string)
    {
        super(r);
        this.Files = files;
        this.RecordName = recordName;
        this.instanceName = instanceName;

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
     * builds and returns a complete URI relative to the workspace root
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
        let fileTypes = MetaData.getFileTypes();

        for (let i = 0; i < fileTypes.length; i++)
        {
            const element = fileTypes[i];
            var u = this.getFileUri(element);
            if (u && u.fsPath === uri.fsPath)
            {
                return true;
            }
        }
        return false;
    }

    /**
    * returns all suported file types in an array. 
    */
    public static getFileTypes()
    {
        return [FileTypes.clientScript, FileTypes.html, FileTypes.serverScript, FileTypes.styleSheet];
    }

    /**
     * Returns an instantiated metadata object from a json object.
     */
    public static fromJson(m: ILocalMetaData): MetaData
    {
        var files = new Array<KeyValuePair<FileTypes, Uri>>();

        m.Files.forEach(element =>
        {
            files.push(new KeyValuePair<FileTypes, Uri>(element.key, Uri.parse(element.value.path)));
        });

        return new MetaData(m, files, m.instanceName, m.RecordName);
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