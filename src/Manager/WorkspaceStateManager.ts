import * as vscode from 'vscode';
import { StateKeys, MemCache } from "./all";
import { ScriptInclude, Widget, UpdateSet, StyleSheet, ISysUiScript, Theme } from "../ServiceNow/all";

//get update and manage workpace state.
export class WorkspaceStateManager
{
    constructor(context: vscode.ExtensionContext)
    {
        this._context = context;
        this._memCache = new MemCache();
    }

    private _memCache: MemCache;
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
        // this._context.workspaceState.update(StateKeys.scriptIncludes.toString(), scriptIncludes);
        this._memCache.Set(StateKeys.scriptIncludes, scriptIncludes);
    }

    /**
     * GetScriptIncludes
     */
    public GetScriptIncludes(): Array<ScriptInclude> | undefined
    {
        // return this._context.workspaceState.get(StateKeys.scriptIncludes.toString());
        return this._memCache.Get<Array<ScriptInclude>>((StateKeys.scriptIncludes));
    }

    /**
     * SetWidgets
     */
    public SetWidgets(Widgets: Array<Widget>): void
    {
        // this._context.workspaceState.update(StateKeys.widget.toString(), Widgets);
        this._memCache.Set(StateKeys.widget, Widgets);
    }

    /**
     * GetWidgets
     */
    public GetWidgets(): Array<Widget> | undefined
    {
        return this._memCache.Get<Array<Widget>>((StateKeys.widget));
    }

    public SetThemes(themes: Array<Theme>): void
    {
        this._memCache.Set(StateKeys.theme, themes);
    }

    public GetThemes(): Array<Theme> | undefined
    {
        return this._memCache.Get<Array<Theme>>((StateKeys.theme));
    }

    public SetUpdateSet(us: UpdateSet): void
    {
        this._context.workspaceState.update(StateKeys.updateSet.toString(), us);
    }

    public GetUpdateSet(): UpdateSet | undefined
    {
        return this._context.workspaceState.get(StateKeys.updateSet.toString());
    }

    public SetStyleSheet(css: Array<StyleSheet>): void
    {
        this._memCache.Set(StateKeys.StyleSheets, css);
    }

    public GetStyleSheet(): Array<StyleSheet> | undefined
    {
        return this._memCache.Get<Array<StyleSheet>>((StateKeys.StyleSheets));
    }

    public SetUiScript(us: ISysUiScript): void
    {
        this._memCache.Set(StateKeys.UiScripts, us);
    }

    public GetUiScript(): Array<ISysUiScript> | undefined
    {
        return this._memCache.Get<Array<ISysUiScript>>((StateKeys.UiScripts));
    }
}