import { ISysMetadata } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";

export interface IAngularProvider extends ISysMetadata, IWorkspaceConvertable
{
    name: string;
    script: string;
    sys_name: string;
    type: string;
}