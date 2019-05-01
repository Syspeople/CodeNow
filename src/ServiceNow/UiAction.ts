import { Record, ISysUiAction, Instance, Converter } from "./all";
import { FileTypes, MetaData, KeyValuePair } from "../Manager/all";
import { Uri } from "vscode";

export class UiAction extends Record implements ISysUiAction
{
    //ui action interface
    table: string;
    order: number;
    comments: string;
    active: boolean;
    script: string;
    condition: string;
    hint: string;
    name: string;

    //quickpick interface
    public get label(): string
    {
        return this.name;
    }

    public get description(): string
    {
        return this.comments;
    }

    public get detail(): string
    {
        return this.table;
    }

    constructor(record: ISysUiAction)
    {
        super(record);
        this.table = record.table;
        this.order = record.order;
        this.comments = record.comments;
        this.active = record.active;
        this.script = record.script;
        this.condition = record.condition;
        this.hint = record.hint;
        this.name = record.name;
    }

    //workspace convertable interface
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

    GetMetadata(record: ISysUiAction, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.serverScript)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }

    GetPatchable(): Object
    {
        return { script: this.script };
    }
}