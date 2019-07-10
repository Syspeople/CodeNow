import { ICodeSearchHit, ICodeSearchExpandable, SearchMatch } from "./all";
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class SearchHit extends TreeItem implements ICodeSearchHit, ICodeSearchExpandable
{
    name: string;
    className: string;
    tableLabel: string;
    matches: SearchMatch[];
    sysId: string;
    modified: number;

    /**
     * Instantiate a new SearchResult.
     */
    constructor(s: ICodeSearchHit)
    {
        super(`Name: ${s.name}`, TreeItemCollapsibleState.Collapsed);

        this.name = s.name;
        this.className = s.className;
        this.tableLabel = s.tableLabel;
        this.sysId = s.sysId;
        this.modified = s.modified;
        this.contextValue = "record";

        this.matches = new Array<SearchMatch>();
        s.matches.forEach(element =>
        {
            this.matches.push(new SearchMatch(element));
        });
    }

    getChildren(): TreeItem[]
    {
        return this.matches;
    }
}