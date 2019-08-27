import * as Axios from "axios";
import { Instance, ISysMetadata, ISysProperty, SysProperty, ISysUserSession, ISysUpdateSet, UpdateSet, SupportedRecords, ICodeSearchResult, IIdentifiable, ApplicationCollection } from "../ServiceNow/all";
import { IServiceNowResponse, ICookie } from "./all";
import * as qs from "querystring";
import { ISysMetadataIWorkspaceConvertable } from "../MixIns/all";
import { WorkspaceConfiguration } from "vscode";

export class Api
{
    private _HttpClient: Axios.AxiosInstance | undefined;
    private _username: string = "";
    private _password: string = "";
    private _Cookies: Array<ICookie> = [];
    private _csrfToken: string = "";
    private _Properties: Array<ISysProperty> = new Array<ISysProperty>();

    private _SNHost: string = "";
    private _SNApiEndpoint = "/api";

    private _SNTableSuffix: string = `${this._SNApiEndpoint}/now/table`;
    private _SNCodeSearchSuffix: string = `${this._SNApiEndpoint}/sn_codesearch/code_search`;
    private _SNXmlHttp: string = `xmlhttp.do`;
    private _SNUISuffix: string = `${this._SNApiEndpoint}/now/ui`;

    private _SNUserTable: string = `${this._SNTableSuffix}/sys_user`;
    private _SNMetaData: string = `${this._SNTableSuffix}/sys_metadata`;
    private _SNSysProperties: string = `${this._SNTableSuffix}/sys_properties`;
    private _SNSysUserSession: string = `${this._SNTableSuffix}/sys_user_session`;
    private _SNSysUpdateSet: string = `${this._SNTableSuffix}/sys_update_set`;

    private _SNCodeSearch: string = `${this._SNCodeSearchSuffix}/search`;

    private _SNApplication: string = `${this._SNUISuffix}/concoursepicker/application`;

    public storeCookies: boolean = true;


    private get _session_store(): string
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
        throw new Error("Cookie not set: glide_session_store");
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

            let timeout: number;

            if (Instance.Config)
            {
                timeout = <number>Instance.Config.timeout;
            }
            else
            {
                timeout = 10000;
            }

            this._HttpClient = Axios.default.create({
                baseURL: this._SNHost,
                timeout: timeout
            });

            /**
             * Keep session alive every 1.5 s. 
             */
            setInterval(async () =>
            {
                let apps = await this.getApplication();
                console.log(`keepAlive:`);
                console.log(apps);
                console.log('Current');
                console.log(apps.data.result.current);
            }, 10000);


            this._HttpClient.interceptors.request.use((r) =>
            {
                let cookie: string = "";
                this._Cookies.forEach(element =>
                {
                    cookie = cookie + `${element.name}=${element.value}; `;
                });

                r.headers["Cookie"] = cookie;

                //use cookie/token auth if csrf token is set. 
                if (this._csrfToken)
                {
                    r.headers["X-UserToken"] = `${this._csrfToken} `;
                }
                else
                {
                    if (r.url)
                    {
                        r.auth = {
                            username: this._username,
                            password: this._password
                        };
                    }
                }
                return r;
            });

            this._HttpClient.interceptors.response.use((r) =>
            {
                if (this.storeCookies)
                {
                    this.UpdateSessionCookies(<Array<string>>r.headers["set-cookie"]);
                }
                return r;
            });
        }
    }

    /**
     * Updates the Timmout using the config.
     */
    public setTimeout(config: WorkspaceConfiguration): void
    {
        if (this.HttpClient)
        {
            this.HttpClient.defaults.timeout = config.timeout;
        }
    }

    /**
     * Add or update cokkies.
     * @param cookies 
     */
    private UpdateSessionCookies(cookies: Array<string>): void
    {
        if (cookies)
        {
            cookies.forEach(newCookie =>
            {
                let splitcookie = newCookie.split(";")[0];

                let cookieobject = {
                    name: splitcookie.split("=")[0],
                    value: splitcookie.split("=")[1]
                };

                let index = this._Cookies.findIndex((cookie) =>
                {
                    return cookie.name === cookieobject.name;
                });

                if (index === -1)
                {
                    this._Cookies.push(cookieobject);
                }
                else
                {
                    this._Cookies[index] = cookieobject;
                }
            });
        }
    }

    private clearCookieAuth(): void
    {
        this._csrfToken = "";
    }

    /**
     * configures a persistent session for the api client. 
     * 
     * Required for cookie based authentication. persistent Session is used for all subsequent request. 
     * Remember to clearCookieAuth afterwards.
     */
    private useCookieAuth(): Promise<void>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                if (this.HttpClient)
                {
                    let ResponseCsrfToken = await this.HttpClient.get<IServiceNowResponse<Array<ISysUserSession>>>(`${this._SNSysUserSession}?id=${this._session_store}`);
                    this._csrfToken = ResponseCsrfToken.data.result[0].csrf_token;
                    resolve();
                }
                throw new Error("Httpclient undefined");
            }
            catch (error)
            {
                reject(error);
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
                var i = this.useCookieAuth();

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
                            this.clearCookieAuth();
                            resolve(<UpdateSet>us);
                        }).catch((err) =>
                        {
                            this.clearCookieAuth();
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

    public get HttpClient(): Axios.AxiosInstance
    {
        if (this._HttpClient)
        {
            return this._HttpClient;
        }
        else
        {
            throw new Error("Http Clinet undefined");
        }
    }

    public set HttpClient(v: Axios.AxiosInstance)
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
                reject(new Error("HTTPClient undefined"));
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
    public GetRecord<T extends ISysMetadata>(record: IIdentifiable): Axios.AxiosPromise<IServiceNowResponse<T>>
    {
        if (this.HttpClient)
        {
            return this.HttpClient.get<IServiceNowResponse<T>>(`${this._SNTableSuffix}/${record.sys_class_name}/${record.sys_id}`);
        }
        else
        {
            throw new Error("Httpclient not found");
        }
    }

    /**
     * Deletes the record.
    */
    public DeleteRecord(record: ISysMetadata): Axios.AxiosPromise<IServiceNowResponse<object>>
    {
        if (this.HttpClient)
        {
            let url = `${this._SNTableSuffix}/${record.sys_class_name}/${record.sys_id}`;
            return this.HttpClient.delete(url);
        }
        else
        {
            throw new Error("Httpclient not found");
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
     * Retrieves all eligible records of a specific type. 
     */
    public GetRecords(type: SupportedRecords): Axios.AxiosPromise<IServiceNowResponse<Array<ISysMetadata>>>
    {
        if (this.HttpClient)
        {
            let url = `${this._SNTableSuffix}/${type}`;
            //set specific queries where necessary
            //defualt is all writable elements.
            switch (type)
            {
                case SupportedRecords.Widget:
                    url = url + `?sysparm_query=internal=false^sys_policy=^sys_scope=global`;
                    break;
                case SupportedRecords["Header or Footer Widget"]:
                    url = url + `?sysparm_query=internal=false^sys_policy=^sys_scope=global`;
                    break;
                case SupportedRecords.Processor:
                    url = url + `?sysparm_query=sys_policy=^type=script^sys_scope=global`;
                    break;
                case SupportedRecords["Scripted Rest API"]:
                    url = url + `?sysparm_query=sys_policy=`;
                    break;
                case SupportedRecords["UI Action"]:
                    url = url + `?sysparm_query=sys_policy=&sysparm_fields=table,order,comments,active,script,condition,hint,name,sys_class_name,sys_id,sys_policy,sys_updated_on,sys_created_on,sys_package,sys_scope`;
                    break;
                default:
                    url = url + `?sysparm_query=sys_policy=^sys_scope=global^sys_class_name=${type}`;
                    break;
            }
            return this.HttpClient.get(url, { timeout: 20000 });
        }
        else
        {
            throw new Error("Httpclient not found");
        }
    }

    /**
     * Creates a new record on instance
     * @param type record type
     * @param body object representing the record to create
     */
    public CreateRecord(type: SupportedRecords, body: object): Axios.AxiosPromise<IServiceNowResponse<ISysMetadata>>
    {
        if (this.HttpClient)
        {
            let url = `${this._SNTableSuffix}/${type}`;
            return this.HttpClient.post(url, body);
        }
        else
        {
            throw new Error("Httpclient not found");
        }
    }

    /**
     * returns the list of applications.
     */
    public getApplication(): Axios.AxiosPromise<IServiceNowResponse<ApplicationCollection>>
    {
        if (this.HttpClient)
        {
            let url = `${this._SNApplication}`;
            return this.HttpClient.get(url);
        }
        else
        {
            throw new Error("Httpclient not found");
        }
    }

    /**
     * Sets the current application
     */
    public setApplication(app_id: string): Axios.AxiosPromise<IServiceNowResponse<{ app_id: string }>>
    {
        if (this.HttpClient)
        {
            let url = `${this._SNApplication}`;
            return this.HttpClient.put(url, { app_id: app_id });
        }
        else
        {
            throw new Error("Httpclient not found");
        }
    }

    /**
     * GetUpdateSets
     * 
     * Returns all update sets that are in progress, limited to global scope
     */
    public async GetUpdateSets(scopeId: string): Promise<Axios.AxiosResponse<IServiceNowResponse<Array<ISysUpdateSet>>>>
    {
        //update sets in global and in progress
        let url = `${this._SNSysUpdateSet}?sysparm_query=state=in progress^sys_scope=${scopeId}`;
        return await this.HttpClient.get(url);
    }

    /**
     * Create updateset on instance
     * @param name 
     * @param parent 
     */
    public CreateUpdateSet(name: string, parent: string): Axios.AxiosPromise<IServiceNowResponse<any>> | undefined
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let url = `${this._SNSysUpdateSet}`;
                if (this.HttpClient)
                {
                    await this.useCookieAuth();

                    //@ts-ignore already null checked
                    let response = await this.HttpClient.post(url, {
                        name: name,
                        parent: parent
                    });

                    resolve(response);
                    this.clearCookieAuth();
                }
                else
                {
                    throw new Error("Http client undefined");
                }
            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * Performs a code search accross all scopes.
     * Might take a while to finish.
     */
    public search(term: string): Axios.AxiosPromise<IServiceNowResponse<Array<ICodeSearchResult>>> | undefined
    {
        if (this.HttpClient)
        {
            let url = `${this._SNCodeSearch}?term=${term}&search_all_scopes=true`;
            return this.HttpClient.get(url, { timeout: 20000 });
        }
    }
}
