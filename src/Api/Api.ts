import * as Axios from "axios";
import { Instance, ISysMetadata, ISysScriptInclude, ISpWidget, ISysProperty, SysProperty, ISpTheme, ISysUserSession, ISysUpdateSet, ISpCss, UpdateSet, IScriptedRestAPIResource, ISysEventScriptAction, ISysProcessor, SupportedRecords } from "../ServiceNow/all";
import { IServiceNowResponse, ICookie } from "./all";
import * as qs from "querystring";
import { ISysUiScript } from "../ServiceNow/ISysUiScript";
import { ISpHeaderFooter } from "../ServiceNow/ISpHeaderFooter";
import { ISysMailScript } from "../ServiceNow/ISysMailScript";
import { ISysMetadataIWorkspaceConvertable } from "../MixIns/all";

export class Api
{
    private _HttpClient: Axios.AxiosInstance | undefined;
    private _SNHost: string = "";
    private _SNApiEndpoint = "/api";
    private _SNTableSuffix: string = `${this._SNApiEndpoint}/now/table`;
    private _SNUserTable: string = `${this._SNTableSuffix}/sys_user`;
    private _SNMetaData: string = `${this._SNTableSuffix}/sys_metadata`;
    private _SNScriptIncludeTable: string = `${this._SNTableSuffix}/sys_script_include`;
    private _SNWidgetTable: string = `${this._SNTableSuffix}/sp_widget`;
    private _SNSysProperties: string = `${this._SNTableSuffix}/sys_properties`;
    private _SNSpThemeTable: string = `${this._SNTableSuffix}/sp_theme`;
    private _SNSysUserSession: string = `${this._SNTableSuffix}/sys_user_session`;
    private _SNSysUpdateSet: string = `${this._SNTableSuffix}/sys_update_set`;
    private _SNSpStyleSheet: string = `${this._SNTableSuffix}/sp_css`;
    private _SNSysUiScript: string = `${this._SNTableSuffix}/sys_ui_script`;
    private _SNHeaderFooter: string = `${this._SNTableSuffix}/sp_header_footer`;
    private _SNSysEmailScript: string = `${this._SNTableSuffix}/sys_script_email`;
    private _SNScriptedRestApiResource: string = `${this._SNTableSuffix}/sys_ws_operation`;
    private _SNSysEventScriptAction: string = `${this._SNTableSuffix}/sysevent_script_action`;
    private _SNProcessor: string = `${this._SNTableSuffix}/sys_processor`;
    private _SNXmlHttp: string = `xmlhttp.do`;
    private _Properties: Array<ISysProperty> = new Array<ISysProperty>();
    private _Cookies: Array<ICookie> = [];
    private _csrfToken: string = "";
    private _username: string = "";
    private _password: string = "";

    private get _session_store(): string | undefined
    {
        if (this._Cookies.length > 0)
        {
            let cookie = this._Cookies.find((element) =>
            {
                return element.name === "glide_session_store";
            });
            if (cookie)
            {
                return cookie.value;
            }
        }
    }

    /**
         * Setup class, Currently only basic auth.
         */
    constructor(Instance: Instance, Password: string)
    {
        if (Instance.Url && Instance.UserName)
        {
            this._username = Instance.UserName;
            this._password = Password;
            let host: string;
            if (Instance.Url.href.endsWith('/'))
            {
                host = Instance.Url.href.slice(0, Instance.Url.href.length - 1);
            }
            else
            {
                host = Instance.Url.href;
            }

            this._SNHost = host;

            this._HttpClient = Axios.default.create({
                baseURL: this._SNHost,
                timeout: 3000
            });

            this._HttpClient.interceptors.request.use((r) =>
            {
                //set cookies if any is stored. 

                if (this._Cookies.length > 0)
                {

                    let cookie: string = "";

                    this._Cookies.forEach(element =>
                    {
                        cookie = cookie + `${element.name}=${element.value};`;
                    });

                    r.headers["Cookie"] = cookie;
                }

                if (this._csrfToken)
                {
                    r.headers["X-UserToken"] = `${this._csrfToken}`;
                }

                //add auth for apis where required.
                if (r.url && r.url.startsWith(this._SNTableSuffix))
                {
                    r.auth = {
                        username: this._username,
                        password: this._password
                    };
                }
                return r;
            });
        }
    }

    private UpdateSessionCookies(cookies: Array<string>): void
    {
        this._Cookies = [];

        cookies.forEach(element =>
        {
            let cookie = element.split(";")[0];
            this._Cookies.push({
                name: cookie.split("=")[0],
                value: cookie.split("=")[1]
            });
        });
    }

    private ClearSessionCookies(): void
    {
        this._Cookies = [];
    }

    /**
     * configures a persistent session for the api client. 
     * 
     * Required for cookie based authentication. persistent Session is used for all subsequent request. 
     * 
     * use ClearSessionCookies() to stop using persistent session. 
     */
    public NewSession(): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.HttpClient)
            {
                let p = this.HttpClient.get(`${this._SNSysUserSession}?sysparm_limit=1`);

                if (p)
                {
                    p.then((res) =>
                    {
                        if (this.HttpClient)
                        {
                            this.UpdateSessionCookies(<Array<string>>res.headers["set-cookie"]);
                            let pToken = this.HttpClient.get<IServiceNowResponse<Array<ISysUserSession>>>(`${this._SNSysUserSession}?id=${this._session_store}`);
                            //let pToken = this.GetCsrfToken(this._session_store);
                            if (pToken)
                            {
                                pToken.then((resToken) =>
                                {
                                    this.UpdateSessionCookies(<Array<string>>res.headers["set-cookie"]);
                                    this._csrfToken = resToken.data.result[0].csrf_token;
                                    resolve(true);
                                }).catch((er) =>
                                {
                                    console.error(er);
                                });
                            }
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
     * Sets an update set to the one provided.
     * 
     * @param sysId sys id of the updateset
     */
    public SetUpdateSet(us: ISysUpdateSet): Promise<UpdateSet>
    {
        return new Promise((resolve, reject) =>
        {
            let url = `${this._SNHost}/${this._SNXmlHttp}`;

            if (this.HttpClient)
            {
                var i = this.NewSession();

                i.then((res) =>
                {
                    let data = {
                        sysparm_processor: "UpdateSetAjax",
                        sysparm_scope: "global",
                        sysparm_want_session_messages: false,
                        sysparm_type: "changeUpdateSet",
                        sysparm_value: us.sys_id
                    };

                    if (this.HttpClient)
                    {
                        let setUpdateSet = this.HttpClient.post(url, qs.stringify(data), {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });

                        setUpdateSet.then((result) =>
                        {
                            this.ClearSessionCookies();
                            resolve(<UpdateSet>us);
                        }).catch((err) =>
                        {
                            this.ClearSessionCookies();
                            console.error(err);
                            reject(err);
                        });
                    }
                }).catch((er) =>
                {
                    console.error(er);
                });
            }
        });

    }

    /**
     * return date format for connected instance
     */
    public get GetDateFormat(): string | undefined
    {
        let dateFormat = this._Properties.find((element) =>
        {
            return element.name === "glide.sys.date_format";
        });

        if (dateFormat)
        {
            return dateFormat.value;
        }
    }

    /**
     * return the Time format of connected instance
     */
    public get GetTimeFormat(): string | undefined
    {
        let dateFormat = this._Properties.find((element) =>
        {
            return element.name === "glide.sys.time_format";
        });

        if (dateFormat)
        {
            return dateFormat.value;
        }
    }

    public get HttpClient(): Axios.AxiosInstance | undefined
    {
        return this._HttpClient;
    }

    public set HttpClient(v: Axios.AxiosInstance | undefined)
    {
        this._HttpClient = v;
    }

    /**
     * GetSystemProperties
     */
    public GetSystemProperties(): Promise<Array<ISysProperty>>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.HttpClient)
            {
                let url = `${this._SNSysProperties}?sysparm_query=nameSTARTSWITHglide.sys`;
                let o = this.HttpClient.get<IServiceNowResponse<Array<ISysProperty>>>(url);

                o.then((res) =>
                {
                    res.data.result.forEach((element) =>
                    {
                        this._Properties.push(new SysProperty(<ISysProperty>element));
                    });
                    resolve(this._Properties);
                }).catch((er) =>
                {
                    console.error(er);
                });
            }
            else
            {
                reject("HTTPClient undefined");
            }
        });
    }

    /**
     * GetUser
     * Returns a deserialized json object form the sys_user rest api. 
     */
    public GetUser(Username: string): Axios.AxiosPromise<IServiceNowResponse<Array<ISysMetadata>>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNUserTable}?sysparm_limit=1&user_name=${Username} `;
            return this.HttpClient.get(url);
        }
    }

    /**
     * Patch a record.
     * 
     */
    public PatchRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T): Axios.AxiosPromise<IServiceNowResponse<T>> | undefined
    {
        if (this.HttpClient)
        {
            //trim data to speed up patch
            let url: string = `${this._SNTableSuffix}/${record.sys_class_name}/${record.sys_id}`;
            return this.HttpClient.patch<IServiceNowResponse<T>>(url, record.GetPatchable());
        }
    }

    /**
     * return a promise with a single full Record
     * @param record 
     */
    public GetRecord<T extends ISysMetadata>(record: ISysMetadata): Axios.AxiosPromise<IServiceNowResponse<T>> | undefined
    {
        if (this.HttpClient)
        {
            return this.HttpClient.get<IServiceNowResponse<T>>(`${this._SNTableSuffix}/${record.sys_class_name}/${record.sys_id}`);
        }
    }

    /**
     * GetRecord, returns record from sys_metadata
     */
    public GetRecordMetadata(record: ISysMetadata): Axios.AxiosPromise<IServiceNowResponse<ISysMetadata>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNMetaData}/${record.sys_id}`;
            return this.HttpClient.get(url);
        }
    }

    /**
     * GetWidgets
     * returns all widgets that are editable
     */
    public GetWidgets(): Axios.AxiosPromise<IServiceNowResponse<Array<ISpWidget>>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNWidgetTable}?internal=false&sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
     * GetWidgets
     * returns all themes that are editable
     */
    public GetThemes(): Axios.AxiosPromise<IServiceNowResponse<Array<ISpTheme>>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNSpThemeTable}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
     * GetScriptIncludes lists all available script includes
     * only returns includes that are not restricted by sys policy
     */
    public GetScriptIncludes(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysScriptInclude>>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNScriptIncludeTable}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
     * GetUpdateSets
     * 
     * Returns all update sets that are in progress, limited to global scope
     */
    public GetUpdateSets(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysUpdateSet>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNSysUpdateSet}?sysparm_query=state=in progress`;
            return this.HttpClient.get(url);
        }
    }

    /**
    * GetStyleSheets
    * 
    */
    public GetStyleSheets(): Axios.AxiosPromise<IServiceNowResponse<Array<ISpCss>>> | undefined
    {
        if (this.HttpClient)
        {
            //style sheets thats is not protected or read only.
            let url = `${this._SNSpStyleSheet}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
    * GetUiScripts
    * 
    */
    public GetUiScripts(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysUiScript>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNSysUiScript}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
    * GetHeaderAndFooters
    * 
    */
    public GetHeadersAndFooters(): Axios.AxiosPromise<IServiceNowResponse<Array<ISpHeaderFooter>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNHeaderFooter}?internal=false&sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }


    /**
    * GetEmailScripts
    * 
    */
    public GetEmailScripts(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysMailScript>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNSysEmailScript}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
    * GetEmailScripts
    * 
    */
    public GetScriptedApiResources(): Axios.AxiosPromise<IServiceNowResponse<Array<IScriptedRestAPIResource>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNScriptedRestApiResource}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }

    /**
    * GetScriptActions
    * 
    */
    public GetScriptActions(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysEventScriptAction>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNSysEventScriptAction}?sysparm_query=sys_policy=`;
            return this.HttpClient.get(url);
        }
    }

    /**
    * processors
    * 
    */
    public GetProcessors(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysProcessor>>> | undefined
    {
        if (this.HttpClient)
        {
            //Processors that are not readonly and of the type === script.
            let url = `${this._SNProcessor}?sysparm_query=sys_policy=^type=script`;
            return this.HttpClient.get(url);
        }
    }

    public CreateRecord(type: SupportedRecords, body: object): Axios.AxiosPromise<IServiceNowResponse<ISysMetadata>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNTableSuffix}/${type}`;
            return this.HttpClient.post(url, body);
        }
    }

    public CreateUpdateSet(name: string, parent: string): Axios.AxiosPromise<IServiceNowResponse<any>> | undefined
    {
        return new Promise((resolve, reject) =>
        {
            let url = `${this._SNSysUpdateSet}`;
            var i = this.NewSession();

            i.then((res) =>
            {
                if (this.HttpClient)
                {
                    this.HttpClient.post(url, {
                        name: name,
                        parent: parent
                    })
                        .then(function (response)
                        {
                            resolve(response);
                        })
                        .catch(function (error)
                        {
                            console.log(error);
                        });
                }
            }).catch((er) =>
            {
                console.error(er);
                reject(er);
            });
        });
    }
}
