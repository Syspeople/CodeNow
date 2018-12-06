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
        this.footer = t.footer;
        this.header = new Relation(t.header);

    }
    css_variables: string;
    name: string;
    navbar_fixed: Boolean;
    footer_fixed: boolean;
    footer: string;
    header: Relation;

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

    public toJSON()
    {
        let b = super.toJSON();
        return {
            sys_class_name: b.sys_class_name,
            sys_id: b.sys_id,
            sys_policy: b.sys_policy,
            sys_updated_on: b.sys_updated_on,
            sys_created_on: b.sys_created_on,
            sys_package: b.sys_package,
            sys_scope: b.sys_scope,
            css_variables: this.css_variables,
            name: this.name,
            navbar_fixed: this.navbar_fixed,
            footer_fixed: this.footer_fixed,
            footer: this.footer,
            header: this.header
        };
    }
}