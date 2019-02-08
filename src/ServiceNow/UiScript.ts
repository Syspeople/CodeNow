import { Record, ISysUiScript } from "./all";
import { QuickPickItem } from "vscode";
import { FileTypes } from "../Manager/all";

export class UiScript extends Record implements ISysUiScript, QuickPickItem
{

    constructor(u: ISysUiScript)
    {
        super(u);
        this.active = u.active;
        this.description = u.description;
        this.use_scoped_format = u.use_scoped_format;
        this.global = u.global;
        this.script_name = u.script_name;
        this.script = u.script;
        this.name = u.name;

    }

    active: boolean;
    description: string;
    use_scoped_format: boolean;
    global: false;
    script_name: string;
    script: string;
    name: string;

    public get label(): string
    {
        return this.name;
    }

    detail?: string | undefined;

    SetAttribute(content: string, filetype: FileTypes): void
    {
        if (filetype === FileTypes.serverScript)
        {
            this.script = content;
        }
    }
    GetAttribute(filetype: FileTypes): string | undefined
    {
        if (filetype === FileTypes.serverScript)
        {
            return this.script;
        }
    }
}