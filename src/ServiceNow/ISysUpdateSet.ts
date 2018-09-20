import { Relation } from "./Relation";

//They do not have the same base structure as sysmetaData
export interface ISysUpdateSet
{
    sys_id: string;
    name: string;
    state: string;
    description: string;
    application: Relation;
    is_default: string;
}