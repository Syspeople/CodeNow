import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface IFixScript extends ISysMetadata, IWorkspaceConvertable
{
    active: boolean;
    description: string;
    sys_name: string;
    script: string;
    name: string;
}