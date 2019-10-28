import { Record, ISysEventScriptAction, Instance, Converter } from "../all";
import { QuickPickItem, Uri } from "vscode";
import { FileTypes, MetaData, KeyValuePair } from "../../Manager/all";

export class ScriptAction extends Record implements ISysEventScriptAction, QuickPickItem
{

    constructor(u: ISysEventScriptAction)
    {
        super(u);
        this.active = u.active;
        this.description = u.description;
        this.script = u.script;
        this.name = u.name;
        this.order = u.order;
        this.event_name = u.event_name;
        this.condition_script = u.condition_script;
    }

    active: boolean;
    description: string;
    script: string;
    name: string;
    order: number;
    event_name: string;
    condition_script: string;

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string
    {
        return this.event_name;
    }

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

    GetMetadata(record: ISysEventScriptAction, instance: Instance): MetaData
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