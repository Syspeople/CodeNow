import { URL } from "url";
import { Record, ISysMetadata, UpdateSet, Converter, SupportedRecords, SearchResponse, IIdentifiable, SupportedRecordsHelper, ApplicationCollection, Application } from "./all";
import { Api } from "../Api/all";
import { WorkspaceStateManager, StatusBarManager, Mixpanel } from "../Manager/all";
import { ISysMetadataIWorkspaceConvertable } from "../MixIns/all";
import opn = require('open');
import { WorkspaceConfiguration } from "vscode";


/**
 * Instance class
 * Type casting, validation of operations and initialization of connection to ServiceNow.
 * All communication is handled through the API proxy class. 
 */
export class Instance
{
    /**
     * Initialize() have to be invoked.
     */
    constructor(config: WorkspaceConfiguration, mixpanel: Mixpanel)
    {
        this.Config = config;
        this._mp = mixpanel;
    }

    Config: WorkspaceConfiguration;

    private _mp: Mixpanel;

    private _wsm: WorkspaceStateManager | undefined;

    public get WorkspaceStateManager(): WorkspaceStateManager
    {
        if (this.IsInitialized() && this._wsm)
        {
            return this._wsm;
        }
        else
        {
            throw new Error("WorkspaceStateManager undefined");
        }
    }


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
    public get ApiProxy(): Api
    {
        if (this.IsInitialized() && this._ApiProxy)
        {
            return this._ApiProxy;
        }
        else
        {
            throw new Error("API proxy undefined, Ensure intance class is initialized");
        }
    }
    public set ApiProxy(v: Api)
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
        if (this._url && this._userName && this._wsm)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * Initialize
     */
    public async Initialize(Url: URL, UserName: string, Password: string, wsm: WorkspaceStateManager, nm: StatusBarManager): Promise<ISysMetadataIWorkspaceConvertable[][]>
    {
        try
        {
            this._url = Url;
            this._userName = UserName;
            this._wsm = wsm;

            this._ApiProxy = new Api(this, Password);

            //disable cookies. in lack of a better way to handle cookkies with concurrent http requests.
            this.ApiProxy.storeCookies = false;
            let cached = await this.Cache();
            //this fucker rejects without being catched.
            this.ApiProxy.storeCookies = true;

            let app = await this.initializeApplication(wsm, nm);

            await this.InitializeUpdateSet(wsm, nm, app);

            return (cached);
        } catch (error)
        {
            //nm.SetNotificationState(NotifationState.NotConnected);
            throw error;
        }
    }

    private async initializeApplication(wsm: WorkspaceStateManager, nm: StatusBarManager): Promise<Application>
    {
        let lastApp = wsm.getApplication();

        let currentApp: Application;

        if (lastApp)
        {
            currentApp = await this.setApplication(lastApp);
        }
        else
        {
            //take instance default
            currentApp = await this.getCurrentApplication();
        }

        nm.setNotificationApplication(currentApp);

        return currentApp;
    }

    /**set last update or revert to default update set */
    private InitializeUpdateSet(wsm: WorkspaceStateManager, nm: StatusBarManager, app: Application): Promise<void>
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
                                    wsm.SetUpdateSet(us);
                                    resolve();
                                }).catch((er) =>
                                {
                                    console.error(er);
                                    reject(er);
                                });
                            }
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
                                wsm.SetUpdateSet(us);
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

    public setConfig(config: WorkspaceConfiguration): void
    {
        this.Config = config;

        if (this.IsInitialized())
        {
            this.ApiProxy.setTimeout(config);
        }
    }

    /**
     * Verifies current update set. Ensures update set is still in progress before saving.
     */
    public async UpdateSetIsValid(): Promise<Boolean>
    {
        let app = this.WorkspaceStateManager.getApplication();

        if (!app)
        {
            //get current from instance.
            app = await this.getCurrentApplication();
        }

        let us = await this.GetUpdateSets();

        let set: UpdateSet | undefined;

        //only gets in progress update set.
        set = this.WorkspaceStateManager.GetUpdateSet();

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
            return true;
        }
        return false;
    }

    /**
     * OpenInPlatform Opens a record in hte default browser
     */
    public OpenInPlatformRecord(record: IIdentifiable): void
    {
        if (this._url)
        {
            let url = `${this._url.href}nav_to.do?uri=/${record.sys_class_name}.do?sys_id=${record.sys_id}`;
            opn(url, { wait: false });
        }
    }

    /**
     * OpenInPlatform open the list for a specified table in the default browser
     */
    public OpenInPlatformList(record: IIdentifiable): void
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
    public SaveRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T): Promise<ISysMetadataIWorkspaceConvertable> | undefined
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                let p = this.ApiProxy.PatchRecord(record);
                if (p)
                {
                    p.then((res) =>
                    {
                        resolve(Converter.CastSysMetaData(res.data.result));
                    }).catch((er) =>
                    {
                        reject(er);
                    });
                }
            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * Deletes the record to from instance and workspace
     * @param record 
     * @returns deleted record object from instance. if failed undefined.
     */
    public async DeleteRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T): Promise<object>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let res = await this.ApiProxy.DeleteRecord(record);
                resolve(res);
            } catch (error)
            {
                console.log(error);
                reject(error);
            }
        });
    }

    /**
     * Performs a codesearch on connected instance
     */
    public async search(term: string): Promise<SearchResponse>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                if (this.IsInitialized())
                {
                    let res = await this.ApiProxy.search(term);
                    if (res)
                    {
                        resolve(new SearchResponse(res.data));
                    }
                }
                throw new Error("Instance not initialized");
            }
            catch (er)
            {
                reject(er);
            }
        });
    }

    /**
    * GetRecord retrieves full record from instance
    */
    public GetRecord(record: IIdentifiable): Promise<ISysMetadataIWorkspaceConvertable>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let p = await this.ApiProxy.GetRecord(record);
                resolve(Converter.CastSysMetaData(p.data.result));
            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * returns all cached records of a specific type. 
     * @param type 
     */
    public GetRecords(type: SupportedRecords): Promise<Array<ISysMetadataIWorkspaceConvertable>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._wsm)
            {
                let rec = this._wsm.GetRecords(type);
                if (rec)
                {
                    let arrOut = new Array<ISysMetadataIWorkspaceConvertable>();

                    rec.forEach(element =>
                    {
                        arrOut.push(Converter.CastSysMetaData(element));
                    });

                    resolve(arrOut);
                }
                else
                {
                    this._mp.track("Records not cached", {
                        class: "instance",
                        method: "GetRecords",
                        type: type
                    });
                    reject("No records found");
                }
            } else
            {
                reject("Workspace Manager undefined");
            }
        });
    }

    /**
     * IsLatest 
     * resolves if newer is found upstream
     * rejects if latest
     */
    public async IsLatest(record: ISysMetadata): Promise<ISysMetadata>
    {
        try
        {
            //get upstream record
            let p = await this.GetRecordMetadata(record);

            return p;
        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }

    /**
     * RebuildCache
     */
    public RebuildCache()
    {
        this.Cache();
    }

    /**
     * GetUpdateSets
     * 
     * Retrieves all updates sets that are in progress.
     */
    public async GetUpdateSets(): Promise<Array<UpdateSet>>
    {
        try
        {
            //get current app.
            let app = await this.getCurrentApplication();

            let p = await this.ApiProxy.GetUpdateSets(app.sysId);

            let arr: Array<UpdateSet> = [];
            p.data.result.forEach((element) =>
            {
                arr.push(new UpdateSet(element));
            });

            return arr;
        } catch (error)
        {
            console.error(error);
            throw error;
        }

    }

    /**
     * Returns a list of applications including the current set. 
     */
    getApplication(): Promise<ApplicationCollection>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let app = await this.ApiProxy.getApplication();
                console.log(app.data.result);
                resolve(new ApplicationCollection(app.data.result));
            } catch (error)
            {
                reject(error);
            }
        });
    }

    public async getCurrentApplication(): Promise<Application>
    {
        let apps = await this.ApiProxy.getApplication();
        let current = apps.data.result.list.find(element =>
        {
            return apps.data.result.current === element.sysId;
        });

        if (!current)
        {
            throw new Error("Unable to get current App");
        }

        return current;
    }

    setApplication(selectedApp: Application): Promise<Application>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                await this.ApiProxy.setApplication(selectedApp.sysId);

                let currentApp = await this.getCurrentApplication();

                this.WorkspaceStateManager.setApplication(currentApp);
                resolve(currentApp);

            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * Caches and retrieves all supported records
     */
    Cache(): Promise<Array<Array<ISysMetadataIWorkspaceConvertable>>>
    {
        let promises = new Array<Promise<Array<ISysMetadataIWorkspaceConvertable>>>();
        let availableRecords = SupportedRecordsHelper.GetRecordsDisplayValue();
        availableRecords.forEach(element =>
        {
            //@ts-ignore Index error is false positive. 
            let type = SupportedRecords[element];
            let records = this.GetRecordsUpstream(type);
            promises.push(records);

            records.then((res) =>
            {
                if (this._wsm)
                {
                    //@ts-ignore Index error is false positive. 
                    this._wsm.SetRecords(SupportedRecords[element], res);
                }
            }).catch((e) =>
            {
                throw e;
            });

        });
        return Promise.all(promises);
    }

    GetRecordsUpstream(type: SupportedRecords): Promise<Array<ISysMetadataIWorkspaceConvertable>>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                let errMsg: string | undefined;

                if (this.ApiProxy)
                {
                    let records = this.ApiProxy.GetRecords(type);

                    if (records)
                    {
                        records.then((res) =>
                        {
                            try
                            {
                                let arrOut = new Array<ISysMetadataIWorkspaceConvertable>();
                                res.data.result.forEach((element) =>
                                {
                                    try
                                    {
                                        arrOut.push(Converter.CastSysMetaData(element));
                                    } catch (error)
                                    {
                                        reject(error);
                                    }
                                });
                                resolve(arrOut);
                            } catch (error)
                            {
                                reject(error);
                            }

                        });
                    }
                    else
                    {
                        errMsg = "Get Records returned undefined";
                    }
                }
                else
                {
                    errMsg = "API not initilized";
                }

                if (errMsg)
                {
                    console.error(errMsg);
                    reject(errMsg);
                }
            } catch (error)
            {
                reject(error);
            }
        });
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
     * Create Update Set
     * Creates an update-set with the provided name.
     * @param name name of the update set
     * @returns the newly created updateset
     */
    public CreateUpdateSet(name: string, parent: string): Promise<UpdateSet>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                let p = this.ApiProxy.CreateUpdateSet(name, parent);

                if (p)
                {
                    p.then((res) =>
                    {
                        if (res.data.result)
                        {
                            let r = new UpdateSet(res.data.result);
                            resolve(r);
                        }
                        else
                        {
                            reject(res.data);
                        }
                    }).catch((er) =>
                    {
                        reject(er);
                    });
                }
                else
                {
                    reject("axios Promise is null or undefined");
                }
            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * GetRecord, returns record metadata from instance
     */
    private GetRecordMetadata(record: ISysMetadata): Promise<ISysMetadata>
    {
        return new Promise((resolve, reject) =>
        {
            try
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
                        throw er;
                    });
                }
                else
                {
                    throw new Error("axios Promise is null or undefined");
                }
            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * Create and add record to workspace
     * @param type 
     * @param record 
     * @param template 
     */
    public async CreateRecord(type: SupportedRecords, record: any): Promise<ISysMetadataIWorkspaceConvertable>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                //get template
                let r = this.getTemplate(type, record);

                //create record upstream and return converted class
                if (r)
                {
                    if (this.ApiProxy)
                    {
                        let p = await this.ApiProxy.CreateRecord(type, r);
                        resolve(Converter.CastSysMetaData(p.data.result));
                    }
                    throw new Error("API proxy not found");
                }
                throw new Error("Template not found");
            } catch (error)
            {
                reject(error);
            }
        });
    }

    //returns an object for containing a template where applicable. 
    private getTemplate(type: SupportedRecords, record: any): Object | undefined
    {
        switch (type)
        {
            case SupportedRecords["Script Include"]:
                return {
                    name: record.name,
                    script:
                        `
var ${record.name} = Class.create();
newinclude.prototype = {
    initialize: function() {
    },

    type: '${record.name}'
};`
                };
            case SupportedRecords["Header or Footer Widget"]:
                return {
                    name: record.name,
                    script:
                        `
(function() {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    
    })();`,
                    css: ``,
                    client_script:
                        `
/**
 * @this {Controller}
 * @param {$Scope} $scope 
 */
function($scope) {
    /* widget controller */
    var c = this;
}`,
                    template:
                        `
<div>
<!-- your widget template -->
</div>`
                };
            case SupportedRecords["Mail Script"]:
                return {
                    name: record.name,
                    script:
                        `
(
    /**
    * @param {GlideRecord} current
    * @param {TemplatePrinter} template
    * @param {GlideEmailOutbound} email
    * @param {GlideRecord} email_action
    * @param {GlideRecord} event
    */
   function runMailScript(current, template, email, email_action, event) {

        // Add your code here

    }
)(current, template, email, email_action, event);`
                };
            case SupportedRecords.Processor:
                return {
                    name: record.name,
                    script:
                        `
(
    /**
     * @param {HttpServletRequest} g_request 
     * @param {HttpServletResponse} g_response 
     * @param {GlideScriptedProcessor} g_processor 
     */
    function process(g_request, g_response, g_processor)
    {
        // Add your code here
    }
)(g_request, g_response, g_processor);`

                };
            case SupportedRecords["Script Action"]:
                return {
                    name: record.name,
                    script:
                        `
/**
 * @type {GlideRecord} Event record
 */
var event = event;
/**
 * @type {GlideRecord} Record event is spawned for.
 */
var current = current;

//add your code`
                };
            case SupportedRecords["Scripted Rest API"]:
                return {
                    name: record.name,
                    http_method: record.http_method,
                    relative_path: "/",
                    web_service_definition: record.web_service_definition,
                    operation_script: `
(
    /**
     * @param {sn_ws.RESTAPIRequest} request 
     * @param {sn_ws.RESTAPIResponse} response 
     */
    function process(request, response)
    {
        try
        {
            //add your code
        }
        catch (error)
        {
            var err = new sn_ws_err.ServiceError();
            err.setStatus(500);
            err.setMessage(error);
            return err;
        };
    })(request, response);`
                };
            case SupportedRecords["Scripted Rest Definition"]:
                return {
                    name: record.name,
                    service_id: record.name.replace(' ', '_').toLowerCase()
                };
            case SupportedRecords["Stylesheet"]:
                return {
                    name: record.name,
                    css: ``
                };
            case SupportedRecords.Theme:
                return {
                    name: record.name,
                    css_variables: ``
                };
            case SupportedRecords["UI Script"]:
                return {
                    name: record.name,
                    script: ``
                };
            case SupportedRecords["UI Macro"]:
                return {
                    name: record.name,
                    xml: ``
                };
            case SupportedRecords["Fix Script"]:
                return {
                    name: record.name,
                    script: ``
                };
            case SupportedRecords["Angular Provider"]:
                return {
                    name: record.name,
                    script: ``,
                    type: record.type
                };
            case SupportedRecords["Angular Template"]:
                return {
                    name: record.sys_name,
                    id: record.id,
                    template: ``,
                };
            case SupportedRecords["Validation Script"]:
                return {
                    description: record.description,
                    script: ``,
                    internal_type: record.internal_type,
                    ui_type: record.ui_type,
                };
            case SupportedRecords["UI Page"]:
                return {
                    name: record.name,
                    client_script: ``,
                    processing_script: ``,
                    html: ``,
                    category: record.category
                };
            case SupportedRecords.Widget:
                return {
                    name: record.name,
                    id: record.name.toLowerCase().replace(' ', '-'),
                    script:
                        `
(function() {
/* populate the 'data' object */
/* e.g., data.table = $sp.getValue('table'); */

})();`,
                    css: ``,
                    client_script:
                        `
/**
* @this {Controller}
* @param {$Scope} $scope 
*/
function($scope) {
/* widget controller */
var c = this;
}`,
                    template:
                        `
<div>
<!-- your widget template -->
</div>`
                };
            case SupportedRecords["UI Action"]:
                return {
                    name: record.name,
                    script: "//Open in platform for final configuration"
                };
            default:
                console.error(`Supported record type: ${type} not recognize`);
                break;
        }
    }
}