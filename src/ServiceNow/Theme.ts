import { Record, ISpTheme, Relation, Instance, Converter } from './all';
import { FileTypes, MetaData, KeyValuePair } from '../Manager/all';
import { Uri } from 'vscode';

export class Theme extends Record implements ISpTheme
{
    constructor(t: ISpTheme)
    {
        super(t);

        this.css_variables = t.css_variables;
        this.name = t.name;
        this.navbar_fixed = t.navbar_fixed;
        this.footer_fixed = t.footer_fixed;
        if (t.footer)
        {
            this.footer = new Relation(t.footer);
        }
        if (t.header)
        {
            this.header = new Relation(t.header);
        }
    }

    css_variables: string;
    name: string;
    navbar_fixed: Boolean;
    footer_fixed: boolean;
    footer: Relation | undefined;
    header: Relation | undefined;

    public get label(): string
    {
        return this.name;
    }

    public get description(): string
    {
        return "";
    }

    public get detail(): string | undefined
    {
        return "";
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.styleSheet:
                this.css_variables = content;
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
                return this.css_variables;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return {
            css_variables: this.css_variables
        };
    }

    GetMetadata(record: ISpTheme, instance: Instance): MetaData
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