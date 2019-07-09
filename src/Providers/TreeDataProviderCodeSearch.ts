import { TreeDataProvider, TreeItem, ProviderResult, Event, EventEmitter } from "vscode";
import { SearchResponse, ICodeSearchExpandable } from "../ServiceNow/all";
export class TreeDataProviderCodeSearch implements TreeDataProvider<TreeItem>
{
    private _searches: Array<TreeItem> = new Array<TreeItem>();
    private _eventEmitter: EventEmitter<TreeItem> = new EventEmitter<TreeItem>();

    onDidChangeTreeData?: Event<TreeItem | null | undefined> | undefined = this._eventEmitter.event;

    getTreeItem(element: ICodeSearchExpandable): TreeItem | Thenable<TreeItem>
    {
        return element;
    }

    getChildren(element?: ICodeSearchExpandable | undefined): ProviderResult<TreeItem[]>
    {
        if (element)
        {
            return element.getChildren();
        }
        else
        {
            return this._searches;
        }
    }

    /**
     * add a search to the view.
     * returns number of searches available
     */
    public async addSearch(search: Promise<SearchResponse>, term: string): Promise<Number>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let res = await search;
                res.setLabel(term);
                var length = this._searches.unshift(res);

                this._eventEmitter.fire();

                resolve(length);

            } catch (error)
            {
                reject(error);
            }
        });
    }

    public async clearSearch(): Promise<void>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                if (this._searches.length > 0)
                {
                    this._searches = new Array<TreeItem>();
                }
                resolve();
            } catch (error)
            {
                reject(error);
            }
        });
    }
}