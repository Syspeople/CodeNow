import { Record, IAngularProvider, Instance, Converter } from "../all";
import { FileTypes, MetaData, KeyValuePair } from '../../Manager/all';
import { Uri } from "vscode";

export class AngularProvider extends Record implements IAngularProvider
{
    constructor(ap: IAngularProvider)
    {
        super(ap);
        this.script = ap.script;
        this.name = ap.name;
        this.sys_name = ap.sys_name;
        this.type = ap.type;
    }

    script: string;
    name: string;
    sys_name: string;
    type: string;

    public get label(): string
    {
        return this.name;
    }

    public get description(): string
    {
        return "";
    }

    /**
     * returns a available types for creating a AngularProvider
     */
    public static getTypes(): Array<string>
    {
        return ["Directive", "Service", "Factory"];
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.serverScript:
                this.script = content;
                break;
            default:
                break;
        }
    }

    GetAttribute(filetype: FileTypes): string | undefined
    {
        switch (filetype)
        {
            case FileTypes.serverScript:
                return this.script;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return { script: this.script };
    }

    GetMetadata(record: IAngularProvider, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.serverScript)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }
}