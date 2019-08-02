import { TreeItem } from "vscode";

export interface ICodeSearchExpandable extends TreeItem
{
    /**
     * returns any children of this tree item. 
     */
    getChildren(): TreeItem[];
}