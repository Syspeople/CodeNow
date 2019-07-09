import { ICodeSearchLineMatch } from "./all";
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class SearchLineMatch extends TreeItem implements ICodeSearchLineMatch
{
    line: number;
    context: string;
    escaped: string;

    constructor(l: ICodeSearchLineMatch)
    {
        super(`line: ${l.line}`, TreeItemCollapsibleState.None);
        this.line = l.line;
        this.context = l.context.trim();
        this.escaped = l.context.trim();
    }

    public get description(): string | boolean
    {
        return this.context;
    }
}