import * as Axios from "axios";
import { Instance, ISysMetadata, ISysScriptInclude, ISpWidget, ISysProperty, SysProperty, ISpTheme, ISysUserSession, ISysUpdateSet } from "../ServiceNow/all";
import { IServiceNowResponse, ICookie } from "./all";
import * as qs from "querystring";

export class Api
{

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
    private _SNXmlHttp: string = `xmlhttp.do`;
    private _Properties: Array<ISysProperty> = new Array<ISysProperty>();

    private _Cookies: Array<ICookie> = [];

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

    private _csrfToken: string = "";

    private _username: string = "";
    private _password: string = "";

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

            this._HttpClient.interceptors.response.use((v) =>
            {
                //console.warn("###");
                if (v.data.result)
                {
                    if (v.data.result instanceof Array)
                    {
                        let arr = new Array<any>();
                        //@ts-ignore
                        v.data.result.forEach(element =>
                        {
                            element = this.fixDateOnRecord(element);
                            arr.push(element);
                        });
                        v.data.result = arr;
                    }
                    else
                    {
                        if (v.data.result)
                        {
                            v.data.result = this.fixDateOnRecord(v.data.result);
                        }
                    }
                }
                return v;
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
    public SetUpdateSet(us: ISysUpdateSet): Promise<void>
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
                            resolve();
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

    private _HttpClient: Axios.AxiosInstance | undefined;
    public get HttpClient(): Axios.AxiosInstance | undefined
    {
        return this._HttpClient;
    }
    public set HttpClient(v: Axios.AxiosInstance | undefined)
    {
        this._HttpClient = v;
    }


    // @ts-ignore
    private fixDateOnRecord(record)
    {
        if (record.sys_updated_on)
        {
            let date = record.sys_updated_on as string;

            record.sys_updated_on = this.getDateFromServiceNowTime(date);
        }
        if (record.sys_created_on)
        {
            let date = record.sys_created_on as string;

            record.sys_created_on = this.getDateFromServiceNowTime(date);
        }

        return record;
    }

    private getDateFromServiceNowTime(date: string): Date
    {
        let dt = date.split(' ');

        let d = dt[0];
        let t = dt[1];

        //new Date(year,month,day,hour,minute,sec)
        let DateFormat = this.GetDateFormat;
        let TimeFormat = this.GetTimeFormat;

        let f = new Date();

        //if display value is used
        if (DateFormat && TimeFormat)
        {
            f = this.GetDateFromFormat(d, DateFormat, t, TimeFormat);
        }

        //if system default is used.
        let dtNow = new Date(Date.now());

        if ((isNaN(f.getTime()) || f.getUTCFullYear() < (dtNow.getUTCFullYear() - 100) || f.getFullYear() > (dtNow.getUTCFullYear() + 100)) && TimeFormat)
        {
            f = this.GetDateFromFormat(d, "yyyy-MM-dd", t, TimeFormat);
        }

        return f;
    }

    private GetDateFromFormat(date: String, dateFormat: string, time: string, timeFormat: string): Date
    {
        let year: number;
        let month: number;
        let day: number;
        let hour: number;
        let minute: number;
        let sec: number;

        let indexYearFirst = dateFormat.indexOf("y");
        let indexYearLast = dateFormat.lastIndexOf("y") + 1;

        let indexMonthFirst = dateFormat.indexOf("M");
        let indexMonthLast = dateFormat.lastIndexOf("M") + 1;

        let indexDayFirst = dateFormat.indexOf("d");
        let indexDaylast = dateFormat.lastIndexOf("d") + 1;

        let indexHourFirst = timeFormat.indexOf("h");
        let indexHourlast = timeFormat.lastIndexOf("h") + 1;

        if (indexHourFirst === -1)
        {
            indexHourFirst = timeFormat.indexOf("H");
            indexHourlast = timeFormat.lastIndexOf("H") + 1;
        }

        let indeMinuteFirst = timeFormat.indexOf("m");
        let indeMinutelast = timeFormat.lastIndexOf("m") + 1;

        let indexSecondFirst = timeFormat.indexOf("s");
        let indexSecondlast = timeFormat.lastIndexOf("s") + 1;

        year = Number(date.substring(indexYearFirst, indexYearLast));
        month = Number(date.substring(indexMonthFirst, indexMonthLast));
        day = Number(date.substring(indexDayFirst, indexDaylast));

        hour = Number(time.substring(indexHourFirst, indexHourlast));
        minute = Number(time.substring(indeMinuteFirst, indeMinutelast));
        sec = Number(time.substring(indexSecondFirst, indexSecondlast));

        return new Date(Date.UTC(year, month - 1, day, hour, minute, sec));
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
    public PatchRecord<T extends ISysMetadata>(record: T): Axios.AxiosPromise<IServiceNowResponse<ISysMetadata>> | undefined
    {
        if (this.HttpClient)
        {
            let url: string;
            switch (record.sys_class_name)
            {
                case "sys_script_include":
                    //api/now/table/sys_script_include/e0085ebbdb171780e1b873dcaf96197e
                    url = `${this._SNScriptIncludeTable} /${record.sys_id}`;

                    //@ts-ignore
                    let si = record as ISysScriptInclude;
                    //trim data to speed up patch
                    return this.HttpClient.patch<IServiceNowResponse<ISysScriptInclude>>(url, {
                        "script": si.script
                    });

                case "sp_widget":
                    url = `${this._SNWidgetTable}/${record.sys_id}`;

                    //@ts-ignore
                    let widget = record as ISpWidget;
                    //trim data to speed up patch
                    return this.HttpClient.patch<IServiceNowResponse<ISpWidget>>(url, {
                        "script": widget.script,
                        "css": widget.css,
                        "client_script": widget.client_script,
                        'template': widget.template
                    });
                case "sp_theme":
                    //api/now/table/sys_script_include/e0085ebbdb171780e1b873dcaf96197e
                    url = `${this._SNSpThemeTable}/${record.sys_id}`;
                    //@ts-ignore
                    let theme = record as ISpTheme;
                    //trim data to speed up patch
                    return this.HttpClient.patch<IServiceNowResponse<ISpTheme>>(url, {
                        "css_variables": theme.css_variables
                    });

                default:
                    console.warn("PatchRecord: Record not Recognized");
                    break;
            }
        }
    }

    /**
     * return a promise with the full widget
     * @param record 
     */
    public GetRecord(record: ISysMetadata): Axios.AxiosPromise<IServiceNowResponse<ISysMetadata>> | undefined
    {
        if (this.HttpClient)
        {
            let sysid = record.sys_id;
            switch (record.sys_class_name)
            {
                case "sys_script_include":
                    return this.HttpClient.get<IServiceNowResponse<ISysScriptInclude>>(`${this._SNScriptIncludeTable}/${sysid}`);
                case "sp_widget":
                    return this.HttpClient.get<IServiceNowResponse<ISpWidget>>(`${this._SNWidgetTable}/${sysid}`);
                case "sp_theme":
                    return this.HttpClient.get<IServiceNowResponse<ISpTheme>>(`${this._SNSpThemeTable}/${sysid}`);
                default:
                    console.warn(`GetRecord: Record ${record.sys_class_name} not recognized`);
                    break;
            }
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
     * Returns all update sets that are in progress
     */
    public GetUpdateSets(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysUpdateSet>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNSysUpdateSet}?sysparm_query=application=global^state=in progress`;
            return this.HttpClient.get(url);
        }
    }
}