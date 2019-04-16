import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface ISysUiAction extends ISysMetadata, IWorkspaceConvertable
{
    //only subset of attributes.
    table: string;
    order: number;
    comments: string;
    active: boolean;
    script: string;
    condition: string;
    hint: string;
    name: string;
}