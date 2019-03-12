import { FileTypes } from "./all";
import { IPatchable } from "../Api/all";

/**
 * interface required to write and read records to and from workspace.
 */
export interface IWorkspaceConvertable extends IPatchable
{
    name: string;
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