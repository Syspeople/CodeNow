import { URL } from "url";

import { ScriptInclude, ISysScriptInclude, Record, ISysMetadata, Widget, ISpWidget, Theme, ISpTheme, UpdateSet, ISpCss, StyleSheet, UiScript, ISysUiScript, MailScript, ISysMailScript, SpHeaderFooter, ISpHeaderFooter, IScriptedRestAPIResource, ScriptedRestAPIResource } from "./all";
import { Api } from "../Api/all";
import { WorkspaceStateManager, StatusBarManager } from "../Manager/all";
import { ISysMetadataIWorkspaceConvertable } from "../MixIns/all";
import opn = require('opn');

export class Instance
{

    /**
     * Initialize() have to be invoked.
     */
    constructor() { }

    private _wsm: WorkspaceStateManager | undefined;

    private _userName: string | undefined;
    public get UserName(): string | undefined
    {
        if (this.IsInitialized())
        {
            return this._userName;
        }
    }

    private _url: URL | undefined;
    public get Url(): URL | undefined
    {
        if (this.IsInitialized())
        {
            return this._url;
        }
    }

    private _ApiProxy: Api | undefined;
    public get ApiProxy(): Api | undefined
    {
        if (this.IsInitialized())
        {
            return this._ApiProxy;
        }
    }
    public set ApiProxy(v: Api | undefined)
    {
        this._ApiProxy = v;
    }

    private _isPasswordValid: boolean = false;

    public get isPasswordValid(): boolean
    {
        return this._isPasswordValid;
    }

    private _hasRequiredRole: boolean = false;

    public get hasRequiredRole(): boolean
    {
        return this._hasRequiredRole;
    }

    /**
     * IsInitialized
     */
    public IsInitialized(): boolean
    {
        if (this._url && this._userName)
        {
            return true;
        }
        else
        {
            console.warn("Instance not initalized");
            return false;
        }
    }

    /**
     * Initialize
     */
    public Initialize(Url: URL, UserName: string, Password: string, wsm: WorkspaceStateManager, nm: StatusBarManager): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            this._url = Url;
            this._userName = UserName;
            this._wsm = wsm;

            this._ApiProxy = new Api(this, Password);
            let p = this.InitializeUpdateSet(wsm, nm);

            p.then(() =>
            {
                this.Cache();
                resolve();
            }).catch((error) =>
            {
                reject(error);
            });
        });
    }

    /**set last update or revert to default update set */
    private InitializeUpdateSet(wsm: WorkspaceStateManager, nm: StatusBarManager): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            let LocalUpdateSetSysId = wsm.GetUpdateSet();

            let p = this.GetUpdateSets();

            p.then((res) =>
            {
                if (LocalUpdateSetSysId)
                {
                    let UpdateSet = res.find((element) =>
                    {
                        //@ts-ignore LocalUpdateSetSysId Already validated.
                        return element.sys_id === LocalUpdateSetSysId.sys_id;
                    });

                    if (UpdateSet)
                    {
                        let e = this.SetUpdateSet(UpdateSet);
                        if (e)
                        {
                            e.then((us) =>
                            {
                                //@ts-ignore updateSet already nullchecked
                                nm.SetNotificationUpdateSet(us);
                                resolve();
                            }).catch((er) =>
                            {
                                console.error(er);
                                reject(er);
                            });
                        }
                    }
                }
                else
                {
                    let defaultUs = res.find((element) =>
                    {
                        return (element.is_default === "true");
                    });

                    if (defaultUs)
                    {
                        let e = this.SetUpdateSet(defaultUs);
                        if (e)
                        {
                            e.then((us) =>
                            {
                                //@ts-ignore updateSet already nullchecked
                                nm.SetNotificationUpdateSet(defaultUs);
                                resolve();
                            }).catch((er) =>
                            {
                                console.error(er);
                                reject(er);
                            });
                        }
                    }
                }
            }).catch((er) =>
            {
                console.error(er);
                reject(er);
            });
        });

    }

    /**
     * Verifies current update set. Ensures update set is still in progress before saving.
     */
    public UpdateSetIsValid(): Promise<Boolean>
    {
        return new Promise((resolve, reject) =>
        {
            let p = this.GetUpdateSets();

            p.then((us) =>
            {
                let set: UpdateSet | undefined;
                if (this._wsm)
                {
                    //only gets in progress update set.
                    set = this._wsm.GetUpdateSet();
                }

                let index: number = -1;
                if (set)
                {
                    index = us.findIndex((element) =>
                    {
                        //@ts-ignore variable set already null checked
                        return element.sys_id === set.sys_id;
                    });
                }

                if (index !== -1)
                {
                    resolve(true);
                }
                else
                {
                    reject(false);
                }
            }).catch((r) =>
            {
                reject(r);
            });
        });
    }

    /**
     * OpenInPlatform Opens a record in hte default browser
     */
    public OpenInPlatformRecord(record: ISysMetadata): void
    {
        //nav_to.do?uri=%2Fsys_script_include.do%3Fsys_id%3D8a060ae7c0a80027000b70aecfd1f263
        if (this._url)
        {
            let url = `${this._url.href}nav_to.do?uri=/${record.sys_class_name}.do?sys_id=${record.sys_id}`;
            opn(url, { wait: false });
        }
    }

    /**
     * OpenInPlatform open the list for a specified table in the default browser
     */
    public OpenInPlatformList(record: ISysMetadata): void
    {
        if (this._url)
        {
            let url = `${this._url.href}nav_to.do?uri=/${record.sys_class_name}_list.do`;
            opn(url, { wait: false });
        }
    }

    /**
     * saves the record to instance
     * @param record 
     * @returns new record object from instance. if failed undefined.
     */
    public SaveRecord<T extends ISysMetadata>(record: T): Promise<ISysMetadataIWorkspaceConvertable> | undefined
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                let p = this.ApiProxy.PatchRecord(record);
                if (p)
                {
                    p.then((res) =>
                    {
                        let r = new Record(res.data.result);
                        switch (r.sys_class_name)
                        {
                            case "sys_script_include":
                                resolve(new ScriptInclude(<ISysScriptInclude>res.data.result));
                                break;
                            case "sp_widget":
                                resolve(new Widget(<ISpWidget>res.data.result));
                                break;
                            case "sp_theme":
                                resolve(new Theme(<ISpTheme>res.data.result));
                                break;
                            case "sp_css":
                                resolve(new StyleSheet(<ISpCss>res.data.result));
                                break;
                            case "sp_header_footer":
                                resolve(new SpHeaderFooter(<ISpHeaderFooter>res.data.result));
                                break;
                            case "sys_ui_script":
                                resolve(new UiScript(<ISysUiScript>res.data.result));
                                break;
                            case "sys_script_email":
                                resolve(new MailScript(<ISysMailScript>res.data.result));
                                break;
                            case "sys_ws_operation":
                                resolve(new ScriptedRestAPIResource(<IScriptedRestAPIResource>res.data.result));
                                break;
                            default:
                                console.warn(`SaveRecord: Record from ${r.sys_class_name} not recognized`);
                                break;
                        }
                    }).catch((er) =>
                    {
                        reject(er);
                    });
                }
            }
        });
    }
    /**
    * GetRecord retrieves full record from instance
    */
    public GetRecord(record: ISysMetadata): Promise<ISysMetadataIWorkspaceConvertable>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                let p = this.ApiProxy.GetRecord(record);
                if (p)
                {
                    p.then((res) =>
                    {
                        //add new record
                        switch (res.data.result.sys_class_name)
                        {
                            case "sys_script_include":
                                resolve(new ScriptInclude(<ISysScriptInclude>res.data.result));
                                break;
                            case "sp_widget":
                                resolve(new Widget(<ISpWidget>res.data.result));
                                break;
                            case "sp_theme":
                                resolve(new Theme(<ISpTheme>res.data.result));
                                break;
                            case "sp_css":
                                resolve(new StyleSheet(<ISpCss>res.data.result));
                                break;
                            case "sys_ui_script":
                                resolve(new UiScript(<ISysUiScript>res.data.result));
                                break;
                            case "sp_header_footer":
                                resolve(new SpHeaderFooter(<ISpHeaderFooter>res.data.result));
                                break;
                            case "sys_script_email":
                                resolve(new MailScript(<ISysMailScript>res.data.result));
                                break;
                            default:
                                console.warn(`GetRecord: Record ${res.data.result.sys_class_name} not recognized`);
                                break;
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                    });
                }
            }
        });
    }

    public getStyleSheets(): Promise<Array<StyleSheet>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let si = this._wsm.GetStyleSheet();
                if (si)
                {
                    resolve(si);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }
    /**
         * GetScriptIncludes
         * Returns all available script includes as an array.
         */
    public GetScriptIncludes(): Promise<Array<ScriptInclude>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let si = this._wsm.GetScriptIncludes();
                if (si)
                {
                    resolve(si);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }

    /**returns all cached widgets */
    public GetWidgets(): Promise<Widget[]>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let wi = this._wsm.GetWidgets();
                if (wi)
                {
                    resolve(wi);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }

    /**returns all cached themes */
    public GetThemes(): Promise<Theme[]>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let t = this._wsm.GetThemes();
                if (t)
                {
                    resolve(t);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }


    /**returns all cached widgets */
    public GetHeadersAndFooters(): Promise<SpHeaderFooter[]>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let wi = this._wsm.GetHeadersAndFooters();
                if (wi)
                {
                    resolve(wi);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }


    /**returns all cached ui scripts */
    public GetUiScripts(): Promise<UiScript[]>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let u = this._wsm.GetUiScript();
                if (u)
                {
                    resolve(u);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }

    /**returns all cached mail scripts */
    public GetMailScripts(): Promise<MailScript[]>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let m = this._wsm.GetMailScript();
                if (m)
                {
                    resolve(m);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }

    /**returns all cached mail scripts */
    public GetSriptedApiResources(): Promise<ScriptedRestAPIResource[]>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let m = this._wsm.GetScriptedApiResource();
                if (m)
                {
                    resolve(m);
                }
            }
            else
            {
                reject("No records found");
            }
        });
    }


    /**
     * IsLatest 
     * resolves if newer is found upstream
     * rejects if latest
     */
    public IsLatest(record: ISysMetadata): Promise<ISysMetadata>
    {
        return new Promise((resolve, reject) =>
        {
            //get upstream record
            let p = this.GetRecordMetadata(record);

            p.then((res) =>
            {
                //fix this comparison
                if (res.sys_updated_on > record.sys_updated_on)
                {
                    //upstream newest
                    resolve(res);
                }
                else
                {
                    reject(res);
                }
            }).catch((e) =>
            {
                console.error(e);
                throw e;
            });
        });
    }

    /**
     * RebuildCache
     */
    public RebuildCache()
    {
        this.Cache();
    }

    private GetStyleSheetsUpstream(): Promise<Array<StyleSheet>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetStyleSheets();

                if (include)
                {
                    let result = new Array<StyleSheet>();

                    include.then((res) =>
                    {
                        res.data.result.forEach((element) =>
                        {
                            result.push(new StyleSheet(<ISpCss>element));
                        });
                        resolve(result);

                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    private GetScriptIncludesUpStream(): Promise<Array<ScriptInclude>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetScriptIncludes();

                if (include)
                {
                    let result = new Array<ScriptInclude>();

                    include.then((res) =>
                    {
                        res.data.result.forEach((element) =>
                        {
                            result.push(new ScriptInclude(<ISysScriptInclude>element));
                        });
                        resolve(result);

                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    private GetWidgetsUpStream(): Promise<Array<Widget>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetWidgets();

                if (include)
                {
                    let result = new Array<Widget>();

                    include.then((res) =>
                    {
                        if (res.data.result.length > 0)
                        {
                            res.data.result.forEach((element) =>
                            {
                                result.push(new Widget(<ISpWidget>element));
                            });
                            resolve(result);
                        }
                        else
                        {
                            reject("No elements Found");
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    private GetHeadersAndFootersUpStream(): Promise<Array<SpHeaderFooter>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetHeadersAndFooters();

                if (include)
                {
                    let result = new Array<SpHeaderFooter>();

                    include.then((res) =>
                    {
                        if (res.data.result.length > 0)
                        {
                            res.data.result.forEach((element) =>
                            {
                                result.push(new SpHeaderFooter(<ISpHeaderFooter>element));
                            });
                            resolve(result);
                        }
                        else
                        {
                            reject("No elements Found");
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    private GetThemesUpStream(): Promise<Array<Theme>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetThemes();

                if (include)
                {
                    let result = new Array<Theme>();

                    include.then((res) =>
                    {
                        if (res.data.result.length > 0)
                        {
                            res.data.result.forEach((element) =>
                            {
                                result.push(new Theme(<ISpTheme>element));
                            });
                            resolve(result);
                        }
                        else
                        {
                            reject("No elements Found");
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    /**
     * get all ui elegible ui scripts
     */
    private GetUiScriptsUpStream(): Promise<Array<UiScript>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetUiScripts();

                if (include)
                {
                    let result = new Array<UiScript>();

                    include.then((res) =>
                    {
                        if (res.data.result.length > 0)
                        {
                            res.data.result.forEach((element) =>
                            {
                                result.push(new UiScript(<ISysUiScript>element));
                            });
                            resolve(result);
                        }
                        else
                        {
                            reject("No elements Found");
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    /**
 * get all ui elegible mail scripts
 */
    private GetMailScriptsUpStream(): Promise<Array<MailScript>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetEmailScripts();

                if (include)
                {
                    let result = new Array<MailScript>();

                    include.then((res) =>
                    {
                        if (res.data.result.length > 0)
                        {
                            res.data.result.forEach((element) =>
                            {
                                result.push(new MailScript(<ISysMailScript>element));
                            });
                            resolve(result);
                        }
                        else
                        {
                            reject("No elements Found");
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    // Get Scripted API Resources
    private GetScriptedApiResourcesUpStream(): Promise<Array<ScriptedRestAPIResource>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                var include = this.ApiProxy.GetScriptedApiResources();

                if (include)
                {
                    let result = new Array<ScriptedRestAPIResource>();

                    include.then((res) =>
                    {
                        if (res.data.result.length > 0)
                        {
                            res.data.result.forEach((element) =>
                            {
                                result.push(new ScriptedRestAPIResource(<IScriptedRestAPIResource>element));
                            });
                            resolve(result);
                        }
                        else
                        {
                            reject("No elements Found");
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                        reject(er);
                    });
                }
            }
        });
    }

    /**
     * GetUpdateSets
     * 
     * Retrieves all updates sets that are in progress.
     */
    public GetUpdateSets(): Promise<Array<UpdateSet>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                let p = this.ApiProxy.GetUpdateSets();

                if (p)
                {
                    p.then((res) =>
                    {
                        let arr: Array<UpdateSet> = [];

                        res.data.result.forEach((element) =>
                        {
                            arr.push(new UpdateSet(element));
                        });

                        resolve(arr);
                    }).catch((er) =>
                    {
                        reject(er);
                    });
                } else
                {
                    reject("API proxy not initialized");
                }
            }
        });
    }

    //will store objects in local storage
    private Cache(): void
    {
        if (this.IsInitialized)
        {
            let includes = this.GetScriptIncludesUpStream();

            includes.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetScriptIncludes(res);
                }
            }).catch((e) =>
            {
                console.error(e);
            });

            let widgets = this.GetWidgetsUpStream();

            widgets.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetWidgets(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });

            let themes = this.GetThemesUpStream();
            themes.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetThemes(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });

            let styleSheets = this.GetStyleSheetsUpstream();
            styleSheets.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetStyleSheet(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });

            let uiScripts = this.GetUiScriptsUpStream();
            uiScripts.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetUiScript(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });

            let mailScripts = this.GetMailScriptsUpStream();
            mailScripts.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetMailScript(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });

            let scriptedApiResources = this.GetScriptedApiResourcesUpStream();
            scriptedApiResources.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetScriptedApiResource(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });

            let headersAndFooters = this.GetHeadersAndFootersUpStream();
            headersAndFooters.then((res) =>
            {
                if (this._wsm)
                {
                    this._wsm.SetHeadersAndFooters(res);
                }
            }).catch((er) =>
            {
                console.error(er);
            });
        }
    }

    /**
     * SetUpdateSet
     * 
     * Sets the update to the one provided.
     */
    public SetUpdateSet(updateSet: UpdateSet): Promise<UpdateSet> | undefined
    {
        if (this.ApiProxy)
        {
            return this.ApiProxy.SetUpdateSet(updateSet);
        }
    }

    /**
     * GetRecord, returns record metadata from instance
     */
    private GetRecordMetadata(record: ISysMetadata): Promise<ISysMetadata>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                let p = this.ApiProxy.GetRecordMetadata(record);
                if (p)
                {
                    p.then((res) =>
                    {
                        if (res.data.result)
                        {
                            let r = new Record(res.data.result);
                            resolve(r);
                        }
                        else
                        {
                            reject(res.data);
                        }
                    }).catch((er) =>
                    {
                        console.error(er);
                    });
                }
                else
                {
                    reject("axios Promise is null or undefined");
                }
            }
            else
            {
                reject("API Proxy is null or undefined");
            }
        });

    }
}