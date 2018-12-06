import { ISysMetadata, IRelation } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface ISpTheme extends ISysMetadata, IWorkspaceConvertable
{
    css_variables: string;
    name: string;
    navbar_fixed: Boolean;
    footer_fixed: boolean;
    footer: string;
    header: IRelation;
}
