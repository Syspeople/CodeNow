import { ICodeSearchExpandable, ICodeSearchMatch, SearchLineMatch } from "../all";
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class SearchMatch extends TreeItem implements ICodeSearchMatch, ICodeSearchExpandable
{
    field: string;
    fieldLabel: string;
    lineMatches: SearchLineMatch[];
    count: number;

    constructor(m: ICodeSearchMatch)
    {
        super(`Field: ${m.fieldLabel}`, TreeItemCollapsibleState.Expanded);

        this.field = m.field;
        this.fieldLabel = m.fieldLabel;
        this.count = m.count;

        this.lineMatches = new Array<SearchLineMatch>();
        m.lineMatches.forEach(element =>
        {
            this.lineMatches.push(new SearchLineMatch(element));
        });
    }

    getChildren(): TreeItem[]
    {
        return this.lineMatches;
    }
}