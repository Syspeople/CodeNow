import { FileTypes } from "./FileTypes";

/**
 * interface required to write and read records to and from workspace.
 */
export interface IWorkspaceConvertable
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