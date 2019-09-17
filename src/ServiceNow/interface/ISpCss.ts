import { ISysMetadata } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";
export interface ISpCss extends ISysMetadata, IWorkspaceConvertable
{
    name: string;
    css: string;
}