import { Record, ISysMailScript, Instance, Converter } from "./all";
import { FileTypes, MetaData, KeyValuePair } from "../Manager/all";
import { Uri } from "vscode";

export class MailScript extends Record implements ISysMailScript
{

    constructor(u: ISysMailScript)
    {
        super(u);
        this.script = u.script;
        this.name = u.name;
        this.description = "Mail Script";
    }

    description: string;
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

    GetMetadata(record: ISysMailScript, instance: Instance): MetaData
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