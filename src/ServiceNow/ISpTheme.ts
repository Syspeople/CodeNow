import { ISysMetadata, IRelation } from "./all";

export interface ISpTheme extends ISysMetadata
{
    css_variables: string;
    name: string;
    navbar_fixed: Boolean;
    footer_fixed: boolean;
    footer: string;
    header: IRelation;
}
