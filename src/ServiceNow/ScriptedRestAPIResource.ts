import { Record, IScriptedRestAPIResource } from "./all";
import { QuickPickItem } from "vscode";
import { FileTypes } from "../Manager/all";
import { Relation } from "./Relation";


export class ScriptedRestAPIResource extends Record implements IScriptedRestAPIResource, QuickPickItem
{
    constructor(u: IScriptedRestAPIResource)
    {
        super(u);
        this.active = u.active;
        this.name = u.name;
        this.description = "Scripted REST API";
        this.relative_path = u.relative_path;
        this.operation_script = u.operation_script;
        this.web_service_definition = new Relation(u.web_service_definition);
        this.web_service_version = new Relation(u.web_service_version);
    }

    web_service_version: Relation;
    web_service_definition: Relation;
    active: boolean;
    name: string;
    relative_path: string;
    description: string;
    operation_script: string;

    public get label(): string
    {
        return this.name;
    }

    detail?: string | undefined;

    SetAttribute(content: string, filetype: FileTypes): void
    {
        if (filetype === FileTypes.serverScript)
        {
            this.operation_script = content;
        }
    }
    GetAttribute(filetype: FileTypes): string | undefined
    {
        if (filetype === FileTypes.serverScript)
        {
            return this.operation_script;
        }
    }

}