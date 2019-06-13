import { Record, ISysMetadata, SupportedRecords } from "../ServiceNow/all";
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
        var displayValue = this.getClassDisplayValue();
        return Uri.parse(`${this.basePath}/${displayValue}`);
    }

    /**
     * get an Uri for the folder for this record and all scripts
     */
    public getRecordUri(): Uri
    {
        var displayValue = this.getClassDisplayValue();
        switch (this.sys_class_name)
        {
            case "sys_ws_operation":
                return Uri.parse(`${this.basePath}/${displayValue}`);

            default:
                return Uri.parse(`${this.basePath}/${displayValue}/${this.RecordName}`);
        }

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
        return [FileTypes.clientScript, FileTypes.html, FileTypes.serverScript, FileTypes.styleSheet, FileTypes.processingScript];
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

    public getClassDisplayValue(): string | undefined
    {
        //@ts-ignore index
        const classDisplayValue = Object.keys(SupportedRecords).find(key => SupportedRecords[key] === this.sys_class_name);
        return classDisplayValue;
    }
}