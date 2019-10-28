import { Record, IUiPage, Instance, Converter } from "../all";
import { FileTypes, MetaData, KeyValuePair } from "../../Manager/all";
import { Uri } from "vscode";

export class UiPage extends Record implements IUiPage
{

    constructor(u: IUiPage)
    {
        super(u);
        this.description = u.description;
        this.client_script = u.client_script;
        this.name = u.name;
        this.html = u.html;
        this.category = u.category;
        this.processing_script = u.processing_script;

    }

    client_script: string;
    description: string;
    name: string;
    html: string;
    category: string;
    processing_script: string;

    public get label(): string
    {
        return this.name;
    }

    detail?: string | undefined;

    /**
     * Returns avilable categories for IU Pages.
     */
    public static getCategory(): Array<string>
    {
        return ["Content Management", "General", "Home Pages", "HTML Editor", "Knowledge Base", "Service Catalog"];
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.clientScript:
                this.client_script = content;
                break;
            case FileTypes.processingScript:
                this.processing_script = content;
                break;
            case FileTypes.html:
                this.html = content;
                break;
            default:
                break;
        }
    }

    GetAttribute(filetype: FileTypes): string | undefined
    {
        switch (filetype)
        {
            case FileTypes.clientScript:
                return this.client_script;
            case FileTypes.processingScript:
                return this.processing_script;
            case FileTypes.html:
                return this.html;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return {
            processing_script: this.processing_script,
            client_script: this.client_script,
            html: this.html
        };
    }

    GetMetadata(record: IUiPage, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.processingScript, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.processingScript)}`)));
            f.push(new KeyValuePair(FileTypes.clientScript, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.clientScript)}`)));
            f.push(new KeyValuePair(FileTypes.html, Uri.parse(`/${record.name}.${Converter.getFileTypeExtension(FileTypes.html)}`)));
            return new MetaData(record, f, instance.Url.host, record.name);
        }
        throw new Error("Instance not initialized");
    }
}