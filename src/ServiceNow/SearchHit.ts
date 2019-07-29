import { ICodeSearchHit, ICodeSearchExpandable, SearchMatch, IIdentifiable, SupportedRecordsHelper } from "./all";
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class SearchHit extends TreeItem implements ICodeSearchHit, ICodeSearchExpandable, IIdentifiable
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
        this.contextValue = `${SupportedRecordsHelper.isSupported(this.className)}`;

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

    public get sys_class_name(): string
    {
        return this.className;
    }

    public get sys_id(): string
    {
        return this.sysId;
    }
}