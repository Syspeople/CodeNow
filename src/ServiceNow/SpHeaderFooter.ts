import { QuickPickItem } from 'vscode';
import { Record, } from "./all";
import { FileTypes } from '../Manager/all';
import { ISpHeaderFooter } from './ISpHeaderFooter';

export class SpHeaderFooter extends Record implements ISpHeaderFooter, QuickPickItem
{
    constructor(w: ISpHeaderFooter)
    {
        super(w);

        this.template = w.template;
        this.css = w.css;
        this.internal = w.internal;
        this.roles = w.roles;
        this.link = w.link;
        this.description = w.description;
        this.docs = w.docs;
        this.public = w.public;
        this.client_script = w.client_script;
        this.id = w.id;
        this.field_list = w.field_list;
        this.demo_data = w.demo_data;
        this.option_schema = w.option_schema;
        this.script = w.script;
        this.has_preview = w.has_preview;
        this.servicenow = w.servicenow;
        this.data_table = w.data_table;
        this.name = w.name;
        this.controller_as = w.controller_as;
    }

    template: string;
    css: string;
    internal: boolean;
    roles: string;
    link: string;
    description: string;
    docs: string;
    public: boolean;
    client_script: string;
    id: string;
    field_list: string;
    demo_data: string;
    option_schema: string;
    script: string;
    has_preview: boolean;
    servicenow: boolean;
    data_table: string;
    name: string;
    controller_as: string;

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string | undefined
    {
        return;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.styleSheet:
                this.css = content;
                break;
            case FileTypes.clientScript:
                this.client_script = content;
                break;
            case FileTypes.serverScript:
                this.script = content;
                break;
            case FileTypes.html:
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
            case FileTypes.styleSheet:
                return this.css;
            case FileTypes.clientScript:
                return this.client_script;
            case FileTypes.serverScript:
                return this.script;
            case FileTypes.html:
                return this.template;
            default:
                break;
        }
    }
}