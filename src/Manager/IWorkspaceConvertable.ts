import { FileTypes } from "./all";
<<<<<<< HEAD
import { QuickPickItem } from "vscode";
=======
import { IPatchable } from "../Api/all";
>>>>>>> dev

/**
 * interface required to write and read records to and from workspace.
 */
<<<<<<< HEAD
export interface IWorkspaceConvertable extends QuickPickItem
=======
export interface IWorkspaceConvertable extends IPatchable
>>>>>>> dev
{
    /**
     * Set value on object based on filetype. 
     * @param content content to be set on class
     * @param filetype enum stating which type og file the content is.
     */
    SetAttribute(content: string, filetype: FileTypes): void;

    /**
     * returns content of attribute associated with the given filetype.
     * undefined if file does is not associated with this class.
     * @param filetype 
     */
    GetAttribute(filetype: FileTypes): string | undefined;
}