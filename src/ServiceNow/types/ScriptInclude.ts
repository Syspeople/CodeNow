import { Record, ISysScriptInclude, Instance, Converter } from "../all";
import { FileTypes, MetaData, KeyValuePair } from '../../Manager/all';
import { Uri } from "vscode";

export class ScriptInclude extends Record implements ISysScriptInclude
{

    constructor(si: ISysScriptInclude)
    {
        super(si);
        this.client_callable = si.client_callable;
        this.access = si.access;
        this.active = si.active;
        this.description = si.description;
        this.script = si.script;
        this.api_name = si.api_name;
        this.name = si.name;
    }

    client_callable: boolean;
    access: string;
    active: boolean;
    description: string;
    script: string;
    api_name: string;
    name: string;

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string | undefined
    {
        return this.description;
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

    GetMetadata(record: ISysScriptInclude, instance: Instance): MetaData
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