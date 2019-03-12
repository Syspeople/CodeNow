import { Record, ISysMailScript } from "./all";
import { FileTypes } from "../Manager/all";

export class MailScript extends Record implements ISysMailScript
{

    constructor(u: ISysMailScript)
    {
        super(u);
        this.script = u.script;
        this.name = u.name;
        this.description = "Mail Script";
    }

    description: string;
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

    GetPatchable(): Object
    {
        return { script: this.script };
    }
}