import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface IValidationScript extends ISysMetadata, IWorkspaceConvertable
{
    active: boolean;
    description: string;
    validator: string;
    internal_type: string;
    ui_type: string;
}