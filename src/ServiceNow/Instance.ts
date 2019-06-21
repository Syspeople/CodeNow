import { URL } from "url";
import { Record, ISysMetadata, UpdateSet, Converter, SupportedRecords } from "./all";
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
    public SaveRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T): Promise<ISysMetadataIWorkspaceConvertable> | undefined
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
                        resolve(Converter.CastSysMetaData(res.data.result));
                    }).catch((er) =>
                    {
                        reject(er);
                    });
                }
            }
        });
    }

    /**
     * Deletes the record to from instance and workspace
     * @param record 
     * @returns new record object from instance. if failed undefined.
     */
    public DeleteRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T): Promise<any> | undefined
    {
        return new Promise((resolve, reject) =>
        {
            if (this.ApiProxy)
            {
                let p = this.ApiProxy.DeleteRecord(record);
                if (p)
                {
                    p.then((res) =>
                    {
                        resolve(true);
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
                        resolve(Converter.CastSysMetaData(res.data.result));
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

    /**
     * Caches and retrieves all supported records
     */
    private Cache(): void
    {
        if (this.IsInitialized)
        {
            let availableRecords = Object.keys(SupportedRecords);

            availableRecords.forEach(element =>
            {
                //@ts-ignore Index error is false positive. 
                let records = this.GetRecordsUpstream(SupportedRecords[element]);

                records.then((res) =>
                {
                    if (this._wsm)
                    {
                        //@ts-ignore Index error is false positive. 
                        this._wsm.SetRecords(SupportedRecords[element], res);
                    }
                }).catch((e) =>
                {
                    console.error(e);
                });
            });
        }
    }

    GetRecordsUpstream(type: SupportedRecords): Promise<Array<ISysMetadataIWorkspaceConvertable>>
    {
        return new Promise((resolve, reject) =>
        {
            let errMsg: string | undefined;

            if (this.ApiProxy)
            {
                let records = this.ApiProxy.GetRecords(type);

                if (records)
                {
                    records.then((res) =>
                    {
                        let arrOut = new Array<ISysMetadataIWorkspaceConvertable>();
                        res.data.result.forEach((element) =>
                        {
                            arrOut.push(Converter.CastSysMetaData(element));
                        });
                        resolve(arrOut);
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
            if (this.ApiProxy)
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
                        console.error(er);
                    });
                }
                else
                {
                    reject("axios Promise is null or undefined");
                }
            } else
            {
                reject("API Proxy is null or undefined");
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

    /**
     * Create and add record to workspace
     * @param type 
     * @param record 
     * @param template 
     */
    public CreateRecord(type: SupportedRecords, record: any): Promise<ISysMetadataIWorkspaceConvertable>
    {
        return new Promise((resolve, reject) =>
        {
            //get template
            let r = this.getTemplate(type, record);

            //create record upstream and return converted class
            if (r)
            {
                if (this.ApiProxy)
                {
                    let p = this.ApiProxy.CreateRecord(type, r);
                    if (p)
                    {
                        p.then((res) =>
                        {
                            resolve(Converter.CastSysMetaData(res.data.result));
                        }).catch((err) =>
                        {
                            console.error(err);
                            reject(err);
                        });
                    }
                }
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