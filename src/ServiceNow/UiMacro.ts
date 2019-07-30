import { Record, IUiMacro, Instance, Converter } from "./all";
import { FileTypes, MetaData, KeyValuePair } from '../Manager/all';
import { Uri } from "vscode";

export class UiMacro extends Record implements IUiMacro
{
    constructor(um: UiMacro)
    {
        super(um);
        this.xml = um.xml;
        this.name = um.name;
        this.description = um.description;
    }

    xml: string;
    name: string;
    description: string;

    public get label(): string
    {
        return this.name;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.xml:
                this.xml = content;
                break;
            default:
                break;
        }
    }

    GetAttribute(filetype: FileTypes): string | undefined
    {
        switch (filetype)
        {
            case FileTypes.xml:
                return this.xml;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return { xml: this.xml };
    }

    GetMetadata(record: IUiMacro, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.xml)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }
}