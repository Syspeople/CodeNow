import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface IAngularTemplate extends ISysMetadata, IWorkspaceConvertable
{
    template: string;
    sys_name: string;
    id: string;
}