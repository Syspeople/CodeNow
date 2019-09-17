import { Record, ISysProcessor, Instance, Converter } from "../all";
import { FileTypes, MetaData, KeyValuePair } from "../../Manager/all";
import { Uri } from "vscode";

export class Processor extends Record implements ISysProcessor
{

    active: boolean;
    description: string;
    interactive: boolean;
    name: string;
    parameters: string;
    parameters_endpoint: string;
    path: string;
    path_endpoint: string;
    require_csrf: boolean;
    script: string;
    type: string;

    public get label(): string
    {
        return this.name;
    }

    detail?: string | undefined;

    constructor(p: ISysProcessor)
    {
        super(p);
        this.active = p.active;
        this.description = p.description;
        this.interactive = p.interactive;
        this.name = p.name;
        this.parameters = p.parameters;
        this.parameters_endpoint = p.parameters_endpoint;
        this.path = p.path;
        this.path_endpoint = p.parameters_endpoint;
        this.require_csrf = p.require_csrf;
        this.script = p.script;
        this.type = p.type;
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

    GetMetadata(record: ISysProcessor, instance: Instance): MetaData
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