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
    public async addSearch(search: SearchResponse): Promise<Number>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                var length = this._searches.push(search);
                this._eventEmitter.fire();
                resolve(length);

            } catch (error)
            {
                reject(error);
            }
        });
    }
}