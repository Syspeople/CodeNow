import { QuickPickItem } from "vscode";

export class Application implements QuickPickItem
{

    constructor(a: Application)
    {
        this.sysId = a.sysId;
        this.scopeName = a.scopeName;
        this.name = a.name;
    }

    sysId: string;
    scopeName: string;
    name: string;


    public get label(): string
    {
        return this.name;
    }


    public get description(): string | undefined
    {
        return this.scopeName;
    }

    detail?: string | undefined;
    picked?: boolean | undefined;
    alwaysShow?: boolean | undefined;
}