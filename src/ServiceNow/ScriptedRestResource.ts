import { Record, Instance, Converter, ISysWsOperation } from "./all";
import { QuickPickItem, Uri } from "vscode";
import { FileTypes, MetaData, KeyValuePair } from "../Manager/all";
import { Relation } from "./Relation";


export class ScriptedRestResource extends Record implements ISysWsOperation, QuickPickItem
{
    constructor(u: ISysWsOperation)
    {
        super(u);
        this.active = u.active;
        this.name = u.name;
        this.relative_path = u.relative_path;
        this.operation_script = u.operation_script;
        this.http_method = u.http_method;
        this.operation_uri = u.operation_uri;
        this.web_service_definition = u.web_service_definition;
        this.web_service_version = u.web_service_version;
        if (u.web_service_definition)
        {
            this.web_service_definition = new Relation(u.web_service_definition);
        }

        if (u.web_service_version)
        {
            this.web_service_definition = new Relation(u.web_service_definition);
        }
    }

    web_service_version: Relation;
    web_service_definition: Relation;
    http_method: string;
    operation_uri: string;
    active: boolean;
    name: string;
    relative_path: string;
    operation_script: string;

    public get description(): string
    {
        return this.http_method;
    }

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string | undefined
    {
        return this.operation_uri;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        if (filetype === FileTypes.serverScript)
        {
            this.operation_script = content;
        }
    }
    GetAttribute(filetype: FileTypes): string | undefined
    {
        if (filetype === FileTypes.serverScript)
        {
            return this.operation_script;
        }
    }

    GetPatchable(): Object
    {
        return { operation_script: this.operation_script };
    }

    GetMetadata(record: ISysWsOperation, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            //Remove path variables.
            let uriElements = this.operation_uri.replace(this.relative_path, '').split('/');
            let parent = uriElements[uriElements.length - 1];

            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${parent}/${record.name}.${Converter.getFileTypeExtension(FileTypes.serverScript)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }
}