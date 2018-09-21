import { ISysMetadata } from "./all";

export interface ISysUiScript extends ISysMetadata
{
    active: boolean;
    description: string;
    use_scoped_format: boolean;
    global: false;
    script_name: string;
    script: string;
    name: string;
}