import { Record, ISysUiScript, ISysEventScriptAction } from "./all";
import { QuickPickItem } from "vscode";
import { FileTypes } from "../Manager/all";

export class ScriptAction extends Record implements ISysEventScriptAction, QuickPickItem
{

    constructor(u: ISysEventScriptAction)
    {
        super(u);
        this.active = u.active;
        this.description = u.description;
        this.script = u.script;
        this.name = u.name;
        this.order = u.order;
        this.event_name = u.event_name;
        this.condition_script = u.condition_script;
    }

    active: boolean;
    description: string;
    script: string;
    name: string;
    order: number;
    event_name: string;
    condition_script: string;

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

    GetPatchable(): Object
    {
        return { script: this.script };
    }
}