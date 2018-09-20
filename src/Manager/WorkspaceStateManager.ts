import * as vscode from 'vscode';
import { StateKeys } from "./StateKeys";
import { ScriptInclude, Widget, UpdateSet } from "../ServiceNow/all";
import { Theme } from '../ServiceNow/Theme';

//get update and manage workpace state.
export class WorkspaceStateManager
{

    //todo add get and update functions.
    constructor(context: vscode.ExtensionContext)
    {
        this._context = context;
    }

    private _context: vscode.ExtensionContext;

    /**
     * ClearState, sets all stateKeys to undefined
     */
    public ClearState()
    {
        for (const key in StateKeys)
        {
            if (StateKeys.hasOwnProperty(key))
            {
                const element = StateKeys[key];
                this._context.workspaceState.update(element.toString(), undefined);
            }
        }
    }

    /**
     * HasInstanceInState
     */
    public HasInstanceInState(): boolean
    {
        if (this.GetUrl() && this.GetUserName())
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * SetUrl
     */
    public SetUrl(url: string): void
    {
        this._context.workspaceState.update(StateKeys.url.toString(), url);
    }

    /**
     * GetInstance get Url from state
     */
    public GetUrl(): string | undefined
    {
        return this._context.workspaceState.get(StateKeys.url.toString()) as string;
    }

    /**
     * SetUserName
     */
    public SetUserName(url: string): void
    {
        this._context.workspaceState.update(StateKeys.user.toString(), url);
    }

    /**
     * GetUserName get username from state
     */
    public GetUserName(): string | undefined
    {
        return this._context.workspaceState.get(StateKeys.user.toString()) as string;
    }

    /**
     * SetScriptIncludes
     * Cache scriptIncludes in local storage
     * overwrites existing
     */
    public SetScriptIncludes(scriptIncludes: Array<ScriptInclude>): void
    {
        this._context.workspaceState.update(StateKeys.scriptIncludes.toString(), scriptIncludes);
    }

    /**
     * GetScriptIncludes
     */
    public GetScriptIncludes(): Array<ScriptInclude> | undefined
    {
        return this._context.workspaceState.get(StateKeys.scriptIncludes.toString());
    }

    /**
     * SetWidgets
     */
    public SetWidgets(Widgets: Array<Widget>): void
    {
        this._context.workspaceState.update(StateKeys.widget.toString(), Widgets);
    }

    /**
     * GetWidgets
     */
    public GetWidgets(): Array<Widget> | undefined
    {
        return this._context.workspaceState.get(StateKeys.widget.toString());
    }

    public SetThemes(themes: Theme[]): void
    {
        this._context.workspaceState.update(StateKeys.theme.toString(), themes);
    }

    public GetThemes(): Array<Theme> | undefined
    {
        return this._context.workspaceState.get(StateKeys.theme.toString());
    }

    public SetUpdateSet(sysId: UpdateSet): void
    {
        this._context.workspaceState.update(StateKeys.updateSet.toString(), sysId);
    }

    public GetUpdateSet(): UpdateSet | undefined
    {
        return this._context.workspaceState.get(StateKeys.updateSet.toString());
    }
}