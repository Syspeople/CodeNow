import { ISysMetadata, Relation } from './all';

//class with base attributes of any record in ServiceNow.
export class Record implements ISysMetadata
{
    constructor(o: ISysMetadata)
    {
        this.sys_class_name = o.sys_class_name;
        this.sys_id = o.sys_id;
        this.sys_policy = o.sys_policy;
        this.sys_updated_on = new Date(o.sys_updated_on);
        this.sys_created_on = new Date(o.sys_created_on);
        this.sys_package = new Relation(o.sys_package);
        this.sys_scope = new Relation(o.sys_scope);
    }

    sys_class_name: string;
    sys_id: string;
    sys_policy: string;
    sys_updated_on: Date;
    sys_created_on: Date;
    sys_package: Relation;
    sys_scope: Relation;

    /**
     * Does ServiceNow protection policy allow Read
     */
    public get canRead(): boolean
    {
        return (this.sys_policy !== "protected");
    }

    /**
     * Does ServiceNow protection policy allow for write actions.
     */
    public get canWrite(): boolean
    {
        return (this.sys_policy === "");
    }
}