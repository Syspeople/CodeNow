import { Record, IAngularTemplate, Instance, Converter } from "./all";
import { FileTypes, MetaData, KeyValuePair } from '../Manager/all';
import { Uri } from "vscode";

export class AngularTemplate extends Record implements IAngularTemplate
{
    constructor(at: AngularTemplate)
    {
        super(at);
        this.template = at.template;
        this.name = at.sys_name;
        this.sys_name = at.sys_name;
        this.id = at.id;
    }

    template: string;
    name: string;
    sys_name: string;
    id: string;

    public get label(): string
    {
        return this.sys_name;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.serverScript:
                this.template = content;
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
                return this.template;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return { template: this.template };
    }

    GetMetadata(record: IAngularTemplate, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.html, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.html)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }
}