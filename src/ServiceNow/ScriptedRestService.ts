import { Record, Instance } from "./all";
import { QuickPickItem, Uri } from "vscode";
import { FileTypes, MetaData, KeyValuePair } from "../Manager/all";
import { ISysWsDefinition } from "./ISysWsDefinition";


export class ScriptedRestService extends Record implements ISysWsDefinition, QuickPickItem
{

    constructor(r: ISysWsDefinition)
    {
        super(r);
        this.active = r.active;
        this.doc_link = r.doc_link;
        this.base_uri = r.base_uri;
        this.is_versioned = r.is_versioned;
        this.namespace = r.namespace;
        this.name = r.name;
        this.service_id = r.service_id;
        this.short_description = r.short_description;
    }

    active: boolean;
    base_uri: string;
    doc_link: string;
    is_versioned: false;
    namespace: string;
    service_id: string;
    short_description: string;
    name: string;

    public get label(): string
    {
        return this.name;
    }

    public get description(): string
    {
        return this.short_description;
    }

    public get detail(): string
    {
        return this.base_uri;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        return;
    }

    GetAttribute(filetype: FileTypes): string | undefined
    {
        return;
    }

    GetMetadata(record: ISysWsDefinition, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }

    GetPatchable(): Object
    {
        return {};
    }
}