import { ISysMetadata } from "./all";

export interface ISysScriptInclude extends ISysMetadata
{
    client_callable: boolean;
    access: string;
    active: boolean;
    description: string;
    script: string;
    api_name: string;
    name: string;
}