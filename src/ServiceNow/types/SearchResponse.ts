import { ICodeSearchResult, SearchResult, ICodeSearchExpandable } from "../all";
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { IServiceNowResponse } from "../../Api/all";

/**
 * Response containing search results.
 */
export class SearchResponse extends TreeItem implements IServiceNowResponse<Array<ICodeSearchResult>>, ICodeSearchExpandable
{
    result: SearchResult[];

    constructor(s: IServiceNowResponse<Array<ICodeSearchResult>>)
    {
        super("Remember to set label", TreeItemCollapsibleState.Collapsed);

        //cast results.
        this.result = Array<SearchResult>();
        s.result.forEach(element =>
        {
            this.result.push(new SearchResult(element));
        });
    }

    setLabel(searchTerm: string): void
    {
        this.label = `Search: ${searchTerm}`;
    }

    getChildren(): TreeItem[]
    {
        return this.result.filter((element) =>
        {
            return element.hits.length > 0;
        });
    }
}