import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface IUiMacro extends ISysMetadata, IWorkspaceConvertable
{
    xml: string;
    name: string;
    description: string;
}