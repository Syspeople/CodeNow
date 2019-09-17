import { ICodeSearchResult, ICodeSearchExpandable, SearchHit } from "../all";
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class SearchResult extends TreeItem implements ICodeSearchResult, ICodeSearchExpandable
{

    recordType: string;
    hits: SearchHit[];

    /**
     * Instantiate a new SearchResult.
     */
    constructor(s: ICodeSearchResult)
    {
        super(`Table: ${s.recordType}`, TreeItemCollapsibleState.Collapsed);
        this.recordType = s.recordType;

        this.hits = new Array<SearchHit>();

        s.hits.forEach(element =>
        {
            this.hits.push(new SearchHit(element));
        });
    }

    getChildren(): TreeItem[]
    {
        return this.hits;
    }
}