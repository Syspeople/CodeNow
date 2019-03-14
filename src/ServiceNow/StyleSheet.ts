import { Record, ISpCss, Instance, Converter } from "./all";
import { FileTypes, MetaData, KeyValuePair } from "../Manager/all";
import { Uri } from "vscode";

export class StyleSheet extends Record implements ISpCss
{
    constructor(css: ISpCss)
    {
        super(css);

        this.name = css.name;
        this.css = css.css;
    }

    detail?: string | undefined = undefined;
    name: string;
    css: string;

    public get label(): string
    {
        return this.name;
    }

    public get description(): string
    {
        return "";
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.styleSheet:
                this.css = content;
                break;
            default:
                break;
        }
    }

    GetAttribute(filetype: FileTypes): string | undefined
    {
        switch (filetype)
        {
            case FileTypes.styleSheet:
                return this.css;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return {
            css: this.css
        };
    }

    GetMetadata(record: ISpCss, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.styleSheet, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.styleSheet)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }
}