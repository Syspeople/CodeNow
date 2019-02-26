import { QuickPickItem } from 'vscode';
import { Record, ISysScriptInclude } from "./all";
import { FileTypes } from '../Manager/all';

export class ScriptInclude extends Record implements ISysScriptInclude, QuickPickItem
{

    constructor(si: ISysScriptInclude)
    {
        super(si);
        this._client_callable = si.client_callable;
        this._access = si.access;
        this._active = si.active;
        this._description = si.description;
        this._script = si.script;
        this._api_name = si.api_name;
        this._name = si.name;
    }

    public get label(): string
    {
        return this.name;
    }

    public get detail(): string | undefined
    {
        return this.description;
    }

    private _client_callable: boolean;
    public get client_callable(): boolean
    {
        return this._client_callable;
    }
    public set client_callable(v: boolean)
    {
        this._client_callable = v;
    }

    private _access: string;
    public get access(): string
    {
        return this._access;
    }
    public set access(v: string)
    {
        this._access = v;
    }

    private _active: boolean;
    public get active(): boolean
    {
        return this._active;
    }
    public set active(v: boolean)
    {
        this._active = v;
    }

    private _description: string;
    public get description(): string
    {
        return this._description;
    }
    public set description(v: string)
    {
        this._description = v;
    }

    private _script: string;
    public get script(): string
    {
        return this._script;
    }
    public set script(v: string)
    {
        this._script = v;
    }

    private _api_name: string;
    public get api_name(): string
    {
        return this._api_name;
    }

    private _name: string;
    public get name(): string
    {
        return this._name;
    }
    public set name(v: string)
    {
        this._name = v;
    }

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.serverScript:
                this.script = content;
                break;
            default:
                break;
        }
    }

    GetAttribute(filetype: FileTypes): string | undefined
    {
        switch (filetype)
        {
            case FileTypes.serverScript:
                return this.script;
            default:
                break;
        }
    }

    /**
     * toJSON
     */
    public toJSON()
    {
        let b = super.toJSON();
        return {
            sys_class_name: b.sys_class_name,
            sys_id: b.sys_id,
            sys_policy: b.sys_policy,
            sys_updated_on: b.sys_updated_on,
            sys_created_on: b.sys_created_on,
            sys_package: b.sys_package,
            sys_scope: b.sys_scope,
            client_callable: this._client_callable,
            access: this._access,
            active: this._active,
            description: this._description,
            script: this._script,
            api_name: this._api_name,
            name: this._name
        };
    }
}