import { Record, ISpTheme, Relation } from './all';
import { QuickPickItem } from 'vscode';
import { FileTypes } from '../Manager/all';

export class Theme extends Record implements ISpTheme, QuickPickItem
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
}