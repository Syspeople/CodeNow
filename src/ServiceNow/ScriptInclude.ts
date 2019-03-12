import { Record, ISysScriptInclude } from "./all";
import { FileTypes } from '../Manager/all';

export class ScriptInclude extends Record implements ISysScriptInclude
{

    constructor(si: ISysScriptInclude)
    {
        super(si);
        this.client_callable = si.client_callable;
        this.access = si.access;
        this.active = si.active;
        this.description = si.description;
        this.script = si.script;
        this.api_name = si.api_name;
        this.name = si.name;
    }

    client_callable: boolean;
    access: string;
    active: boolean;
    description: string;
    script: string;
    api_name: string;
    name: string;

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string | undefined
    {
        return this.description;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.serverScript:
                this.script = content;
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
                return this.script;
            default:
                break;
        }
    }

    GetPatchable(): Object
    {
        return { script: this.script };
    }
}