import { Record, ISysUiScript, ISysScriptInclude, Instance, Converter } from "../all";
import { FileTypes, MetaData, KeyValuePair } from "../../Manager/all";
import { Uri } from "vscode";

export class UiScript extends Record implements ISysUiScript
{

    constructor(u: ISysUiScript)
    {
        super(u);
        this.active = u.active;
        this.description = u.description;
        this.use_scoped_format = u.use_scoped_format;
        this.global = u.global;
        this.script_name = u.script_name;
        this.script = u.script;
        this.name = u.name;

    }

    active: boolean;
    description: string;
    use_scoped_format: boolean;
    global: false;
    script_name: string;
    script: string;
    name: string;

    public get label(): string
    {
        return this.name;
    }

    detail?: string | undefined;

    SetAttribute(content: string, filetype: FileTypes): void
    {
        if (filetype === FileTypes.serverScript)
        {
            this.script = content;
        }
    }
    GetAttribute(filetype: FileTypes): string | undefined
    {
        if (filetype === FileTypes.serverScript)
        {
            return this.script;
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