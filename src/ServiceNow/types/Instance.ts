import { URL } from "url";
import { Record, ISysMetadata, UpdateSet, Converter, SupportedRecords, SearchResponse, IIdentifiable, SupportedRecordsHelper, ApplicationCollection, Application } from "../all";
import { Api } from "../../Api/all";
import { WorkspaceStateManager, StatusBarManager, Mixpanel } from "../../Manager/all";
import { ISysMetadataIWorkspaceConvertable } from "../../MixIns/all";
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

    //@ts-ignore
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
    public async Initialize(Url: URL, UserName: string, Password: string, wsm: WorkspaceStateManager, nm: StatusBarManager): Promise<void>
    {
        try
        {
            this._url = Url;
            this._userName = UserName;
            this._wsm = wsm;

            this._ApiProxy = new Api(this, Password);

            //disable cookies. in lack of a better way to handle cookkies with concurrent http requests.
            this.ApiProxy.storeCookies = false;
            let all = this.Cache();
            await all;
            this.ApiProxy.storeCookies = true;

            await this.initializeApplication(wsm, nm);

            await this.InitializeUpdateSet(wsm, nm);

            this.ApiProxy.KeepAlive = true;

            return;
        } catch (error)
        {
            console.error(error);
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

    private async setDefaultUpdateSet(): Promise<UpdateSet>
    {
        try
        {
            let updateSets = await this.GetUpdateSets();

            let defaultUs = updateSets.find((element) =>
            {
                return (element.is_default === "true");
            });

            if (defaultUs)
            {
                let updateset = await this.SetUpdateSet(defaultUs);
                return updateset;
            } else
            {
                throw new Error("Unable to find default updateset");
            }
        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }


    /**set last update or revert to default update set */
    private async InitializeUpdateSet(wsm: WorkspaceStateManager, nm: StatusBarManager): Promise<void>
    {
        try
        {
            //-ensure last update set is not from another scope. in case then default. 
            let LocalUpdateSetSysId = wsm.GetUpdateSet();

            //Only finds in progress updatesets
            let sets = await this.GetUpdateSets();

            let us: UpdateSet;

            if (LocalUpdateSetSysId)
            {
                let appPromise = this.getCurrentApplication();

                let UpdateSetActive = sets.find((element) =>
                {
                    //@ts-ignore LocalUpdateSetSysId already checked.
                    return element.sys_id === LocalUpdateSetSysId.sys_id;
                });

                //revert to default if we have a scope mismatch. 
                let app = await appPromise;

                if (LocalUpdateSetSysId.application.value !== app.sysId)
                {
                    us = await this.setDefaultUpdateSet();
                }

                if (UpdateSetActive)
                {
                    us = await this.SetUpdateSet(UpdateSetActive);
                }
                else
                {
                    //set default.
                    us = await this.setDefaultUpdateSet();
                }
            }
            else
            {
                us = await this.setDefaultUpdateSet();
            }

            nm.SetNotificationUpdateSet(us);

            return;
        } catch (error)
        {
            console.error(error);
            throw error;
        }
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
     * Ensures that the currently selected application is still set in ServiceNow.
     * if not then the application is set again.
     */
    public async ensureApplication(): Promise<void>
    {
        try
        {
            let currentappLocal = this.WorkspaceStateManager.getApplication();

            let apps = await this.ApiProxy.getApplication();

            if (currentappLocal && currentappLocal.sysId !== apps.data.result.current)
            {
                let i = this.setApplication(currentappLocal, false);
                await i;
                return;
            }
        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }


    /**
     * Verifies current update set. Ensures update set is still in progress before saving.
     */
    public async UpdateSetIsValid(): Promise<Boolean>
    {
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
                console.error(error);
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
     * returns all cached records of a specific type. Only returns Records that are in currently selected scope. 
     * @param type 
     */
    public async GetRecords(type: SupportedRecords): Promise<Array<ISysMetadataIWorkspaceConvertable>>
    {
        let rec = this.WorkspaceStateManager.GetRecords(type);
        if (rec)
        {
            let arrOut = new Array<ISysMetadataIWorkspaceConvertable>();

            rec.forEach(element =>
            {
                arrOut.push(Converter.CastSysMetaData(element));
            });

            return arrOut;
        }
        else
        {
            throw new Error(`No Cached Records found: ${type}`);
        }
    }

    /**
     * verifies that local IsLatest 
     * resolves if newer is found upstream
     * rejects if latest
     */
    public async IsLatest(record: ISysMetadata): Promise<Boolean>
    {
        try
        {
            //get upstream record
            let p = await this.GetRecordMetadata(record);

            var upstreamValue = p.sys_updated_on.valueOf();
            var localValue = record.sys_updated_on.valueOf();

            return (localValue >= upstreamValue);
        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }

    /**
     * RebuildCache
     */
    public async RebuildCache(): Promise<void>
    {
        //disable cookies and keepali
        this.ApiProxy.clearCookies();
        this.ApiProxy.KeepAlive = false;
        this.ApiProxy.storeCookies = false;
        let i = this.Cache();
        await i;
        this.ApiProxy.KeepAlive = true;
        this.ApiProxy.storeCookies = true;

        return;
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
            this.WorkspaceStateManager.getApplication();
            let app = this.WorkspaceStateManager.getApplication();

            if (!app)
            {
                app = await this.getCurrentApplication();
            }

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

    /**
     * Changes application on instance.
     * @param selectedApp Application to be set.
     * @param setDefault Set default updateset.
     */
    public async setApplication(selectedApp: Application, setDefault: boolean = true): Promise<Application>
    {
        try
        {
            await this.ApiProxy.setApplication(selectedApp.sysId);
            let currentApp = await this.getCurrentApplication();
            this.WorkspaceStateManager.setApplication(currentApp);

            //use Default updateset from scope.
            this.setDefaultUpdateSet();

            return currentApp;

        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }

    /**
     * Caches and retrieves all supported records
     */
    async Cache(): Promise<Array<Array<ISysMetadataIWorkspaceConvertable>>>
    {
        try
        {
            const promises = new Array<Promise<Array<ISysMetadataIWorkspaceConvertable>>>();
            let availableRecords = SupportedRecordsHelper.GetRecordsDisplayValue();

            availableRecords.forEach(element =>
            {
                //@ts-ignore Index error is false positive. 
                let type = SupportedRecords[element];
                promises.push(this.GetRecordsUpstream(type).then((res) =>
                {
                    //@ts-ignore Index error is false positive. 
                    this.WorkspaceStateManager.SetRecords(SupportedRecords[element], res);
                    return res;
                }).catch((e) =>
                {
                    console.error(e);
                    throw e;
                }));
            });

            return Promise.all(promises);
        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }

    async GetRecordsUpstream(type: SupportedRecords): Promise<Array<ISysMetadataIWorkspaceConvertable>>
    {
        try
        {
            let records = await this.ApiProxy.GetRecords(type);
            let arrOut = new Array<ISysMetadataIWorkspaceConvertable>();

            records.data.result.forEach((element) =>
            {
                arrOut.push(Converter.CastSysMetaData(element));
            });

            return arrOut;
        } catch (error)
        {
            throw error;
        }
    }

    /**
     * SetUpdateSet
     * 
     * Sets the update to the one provided.
     */
    public async SetUpdateSet(updateSet: UpdateSet): Promise<UpdateSet>
    {
        let us = await this.ApiProxy.SetUpdateSet(updateSet);
        this.WorkspaceStateManager.SetUpdateSet(us);
        return us;
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