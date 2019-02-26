import { ISysMetadata, Relation } from './all';

//class with base attributes of any record in ServiceNow.
export class Record implements ISysMetadata
{
    constructor(o: ISysMetadata)
    {
        this._sys_class_name = o.sys_class_name;
        this._sys_id = o.sys_id;
        this._sys_policy = o.sys_policy;
        this.sys_updated_on = new Date(o.sys_updated_on);
        this._sys_created_on = new Date(o.sys_created_on);
        this._sys_package = new Relation(o.sys_package);
        this._sys_scope = new Relation(o.sys_scope);
    }

    private _sys_class_name: string;
    public get sys_class_name(): string
    {
        return this._sys_class_name;
    }

    private _sys_id: string;
    public get sys_id(): string
    {
        return this._sys_id;
    }

    private _sys_policy: string;
    public get sys_policy(): string
    {
        return this._sys_policy;
    }

    public sys_updated_on: Date;

    private _sys_created_on: Date;
    public get sys_created_on(): Date
    {
        return this._sys_created_on;
    }

    private _sys_package: Relation;
    public get sys_package(): Relation
    {
        return this._sys_package;
    }

    private _sys_scope: Relation;
    public get sys_scope(): Relation
    {
        return this._sys_scope;
    }

    /**
     * toJSON
     */
    public toJSON()
    {
        //overwrite to JSON to ensure that json.stringify serializes with public property names and not the private ones. 
        return {
            sys_class_name: this.sys_class_name,
            sys_id: this.sys_id,
            sys_policy: this.sys_policy,
            sys_updated_on: this.sys_updated_on,
            sys_created_on: this.sys_created_on,
            sys_package: this.sys_package,
            sys_scope: this.sys_scope
        };
    }
}