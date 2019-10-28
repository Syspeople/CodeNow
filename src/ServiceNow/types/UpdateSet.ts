import { ISysUpdateSet } from "../all";
import { QuickPickItem } from "vscode";
import { Relation } from "./Relation";

export class UpdateSet implements ISysUpdateSet, QuickPickItem
{
    constructor(us: ISysUpdateSet)
    {
        this.sys_id = us.sys_id;
        this.name = us.name;
        this.state = us.state;
        this.description = us.description;
        this.application = new Relation(us.application);
        this.is_default = us.is_default;
    }
    sys_id: string;
    name: string;
    state: string;
    description: string;
    application: Relation;
    is_default: string;

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string | undefined
    {
        return this.application.value;
    }
}