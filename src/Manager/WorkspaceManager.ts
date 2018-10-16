import * as fileSystem from 'fs';
import * as vscode from 'vscode';
import { ISysMetadata, Instance, ScriptInclude, ISysScriptInclude, ISpWidget, Widget, Theme, ISpTheme, StyleSheet } from '../ServiceNow/all';
//import { RecordOptions } from './Options';

export class WorkspaceManager
{

    constructor(context: vscode.ExtensionContext)
    {
        this.SetDelimiter(context);
    }

    private _delimiter: string | undefined;
    private SetDelimiter(context: vscode.ExtensionContext)
    {
        let storagePath = context.storagePath;

        if (storagePath)
        {
            if (storagePath.includes("/"))
            {
                this._delimiter = "/";
            }
            else
            {
                this._delimiter = "\\";
            }
        }
    }

    /**
     * Addinstance Creates the base folder structure in workspace.
     */
    public AddInstanceFolder(i: Instance): void
    {
        if (this.HasWorkspace())
        {
            let path = this.GetPathInstance(i);
            if (path)
            {
                this.CreateFolder(path);
            }
        }
    }
    /**
     * retrieves a record from workspace
     */
    public GetRecord(uri: vscode.Uri): ISysMetadata | undefined
    {
        try
        {
            let optionsPath = this.GetPathRecordOptions(uri);
            let content = this.ReadTextFile(optionsPath);

            if (content)
            {
                let serialized = JSON.parse(content) as ISysMetadata;

                switch (serialized.sys_class_name)
                {
                    case "sys_script_include":
                        let si = new ScriptInclude(<ISysScriptInclude>serialized);

                        //get script
                        let siScript = this.ReadTextFile(this.GetPathRecordScript(uri));

                        if (siScript)
                        {
                            si.script = siScript;
                        }
                        return si;

                    case "sp_widget":
                        let widget = new Widget(<ISpWidget>serialized);

                        //get script
                        let script = this.ReadTextFile(this.GetPathRecordScript(uri));
                        let clientScript = this.ReadTextFile(this.GetPathRecordClientScript(uri));
                        let css = this.ReadTextFile(this.GetPathRecordCss(uri));
                        let html = this.ReadTextFile(this.GetPathRecordHtmlTemplate(uri));

                        //take each individually empty can be valid.
                        if (script)
                        {
                            widget.script = script;
                        }
                        if (clientScript)
                        {
                            widget.client_script = clientScript;
                        }
                        if (html)
                        {
                            widget.template = html;
                        }
                        if (css || css === "")
                        {
                            widget.css = css;
                        }
                        return widget;

                    case "sp_theme":
                        let t = new Theme(<ISpTheme>serialized);

                        //get script
                        let tCss = this.ReadTextFile(this.GetPathRecordCss(uri));

                        if (tCss)
                        {
                            t.css_variables = tCss;
                        }
                        return t;
                    case "sp_css":
                        let styleSheet = new StyleSheet(<StyleSheet>serialized);

                        let ssCss = this.ReadTextFile(this.GetPathRecordCss(uri));

                        if (ssCss)
                        {
                            styleSheet.css = ssCss;
                        }

                        return styleSheet;
                    default:
                        console.warn(`GetRecord: Record ${serialized.sys_class_name} not recognized`);
                        break;
                }
            }
        }
        catch (e)
        {
            console.error(e.message);
        }
    }

    /**update record */
    public UpdateRecord(record: ISysMetadata, uri: vscode.Uri): void
    {
        switch (record.sys_class_name)
        {
            case "sys_script_include":
                this.OverwriteFile(`${this.GetPathRecordOptions(uri)}`, this.GetOptionsPretty(record));
                this.OverwriteFile(`${this.GetPathRecordScript(uri)}`, (<ISysScriptInclude>record).script);
                console.info(`${(<ISysScriptInclude>record).name} have been saved to workspace`);
                break;
            case "sp_widget":
                this.OverwriteFile(`${this.GetPathRecordOptions(uri)}`, this.GetOptionsPretty(record));
                this.OverwriteFile(`${this.GetPathRecordScript(uri)}`, (<ISpWidget>record).script);
                this.OverwriteFile(`${this.GetPathRecordClientScript(uri)}`, (<ISpWidget>record).client_script);
                this.OverwriteFile(`${this.GetPathRecordCss(uri)}`, (<ISpWidget>record).css);
                this.OverwriteFile(`${this.GetPathRecordHtmlTemplate(uri)}`, (<ISpWidget>record).template);
                console.info(`${(<ISpWidget>record).name} have been saved to workspace`);
                break;
            case "sp_theme":
                this.OverwriteFile(`${this.GetPathRecordOptions(uri)}`, this.GetOptionsPretty(record));
                this.OverwriteFile(`${this.GetPathRecordCss(uri)}`, (<ISpTheme>record).css_variables);
                break;
            case "sp_css":
                this.OverwriteFile(`${this.GetPathRecordOptions(uri)}`, this.GetOptionsPretty(record));
                this.OverwriteFile(`${this.GetPathRecordCss(uri)}`, (<StyleSheet>record).css);
                break;
            default:
                console.warn(`UpdateRecord: Record ${record.sys_class_name} not recognized`);
                break;
        }
    }

    /**
     * AddRecord
     */
    public AddRecord(record: ISysMetadata, instance: Instance)
    {
        let instancePath = this.GetPathInstance(instance);
        if (instancePath)
        {
            let recordPath = this.GetPathRecord(record, instance);
            let MetaDir: string;
            let recordName: string;

            switch (record.sys_class_name)
            {
                case "sys_script_include":

                    //let o = new RecordOptions(record, instance, this._context);

                    this.CreateFolder(recordPath);
                    recordName = (<ISysScriptInclude>record).name;
                    MetaDir = `${recordPath}${this._delimiter}${recordName}`;
                    this.CreateFolder(MetaDir);

                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.options.json`, this.GetOptionsPretty(record));
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.server_script.js`, (<ISysScriptInclude>record).script);
                    break;

                case "sp_widget":
                    this.CreateFolder(recordPath);
                    recordName = (<ISpWidget>record).name;
                    MetaDir = `${recordPath}${this._delimiter}${recordName}`;
                    this.CreateFolder(MetaDir);

                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.options.json`, this.GetOptionsPretty(record));
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.client_script.js`, (<ISpWidget>record).client_script);
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.server_script.js`, (<ISpWidget>record).script);
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.scss`, (<ISpWidget>record).css);
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.html`, (<ISpWidget>record).template);
                    break;

                case "sp_theme":
                    this.CreateFolder(recordPath);
                    recordName = (<ScriptInclude>record).name;
                    MetaDir = `${recordPath}${this._delimiter}${recordName}`;
                    this.CreateFolder(MetaDir);

                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.options.json`, this.GetOptionsPretty(record));
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.scss`, (<ISpTheme>record).css_variables);
                    break;
                case "sp_css":
                    this.CreateFolder(recordPath);
                    recordName = (<StyleSheet>record).name;
                    MetaDir = `${recordPath}${this._delimiter}${recordName}`;
                    this.CreateFolder(MetaDir);

                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.options.json`, this.GetOptionsPretty(record));
                    this.CreateFile(`${MetaDir}${this._delimiter}${recordName}.scss`, (<StyleSheet>record).css);
                    break;
                default:
                    console.warn(`AddRecord: Record ${record.sys_class_name} not recognized`);
                    break;
            }
        }
    }

    /**
     * ConfigureWorkspace
     */
    public ConfigureWorkspace(context: vscode.ExtensionContext)
    {
        if (this.HasWorkspace)
        {
            let path = this.GetPathWorkspace();
            if (path)
            {
                let fileNameSrvApi = "serverSideAPI.d.ts";
                // let fileNameCliApi = "ClientSideApi.d.ts";
                let fileNameJsConf = "jsconfig.json";

                let pathWorkSpaceSrvApi = `${path.uri.fsPath}${this._delimiter}${fileNameSrvApi}`;
                let pathWorkSpaceJsConf = `${path.uri.fsPath}${this._delimiter}${fileNameJsConf}`;

                let contentSrvApi = this.ReadTextFile(`${context.extensionPath}${this._delimiter}out${this._delimiter}config${this._delimiter}${fileNameSrvApi}`);
                let contentJsConf = this.ReadTextFile(`${context.extensionPath}${this._delimiter}out${this._delimiter}config${this._delimiter}${fileNameJsConf}`);
                if (contentSrvApi)
                {
                    //file that should be overwritten
                    if (this.FileExist(pathWorkSpaceSrvApi))
                    {
                        this.OverwriteFile(pathWorkSpaceSrvApi, contentSrvApi);
                    }
                    else
                    {
                        this.CreateFile(pathWorkSpaceSrvApi, contentSrvApi);
                    }
                }

                //files that should not be overwritten
                if (contentJsConf)
                {
                    if (!this.FileExist(pathWorkSpaceJsConf))
                    {
                        this.CreateFile(pathWorkSpaceJsConf, contentJsConf);
                    }
                }
            }
        }
    }


    private GetOptionsPretty(record: ISysMetadata): string
    {
        return JSON.stringify(record, null, 2);
    }

    private GetPathInstance(i: Instance): string | undefined
    {
        let workspaceRoot = this.GetPathWorkspace();

        if (workspaceRoot && i.Url)
        {
            let path = `${workspaceRoot.uri.fsPath}${this._delimiter}${i.Url.host}`;
            return path;
        }
    }

    /**returns the designated main path in workspace for any given record type */
    private GetPathRecord<T extends ISysMetadata>(record: T, instance: Instance)
    {
        let p = this.GetPathInstance(instance);
        return `${p}${this._delimiter}${record.sys_class_name}`;
    }


    private GetPathParent(Uri: vscode.Uri): string
    {
        let nameLength = this.GetFileName(Uri).length;
        return Uri.fsPath.substring(0, Uri.fsPath.length - nameLength - 1);
    }

    private GetFileName(Uri: vscode.Uri): string
    {
        let split = Uri.fsPath.split(`${this._delimiter}`);
        return split[split.length - 1];
    }

    private GetPathRecordScript(uri: vscode.Uri): string
    {
        let parentPath = this.GetPathParent(uri);
        let recordName = this.GetFileName(uri);

        return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.server_script.js`;
    }

    private GetPathRecordClientScript(uri: vscode.Uri): string
    {
        let parentPath = this.GetPathParent(uri);

        let recordName = this.GetFileName(uri);

        return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.client_script.js`;
    }

    //returns the path of hte option.json that should reside in same dir. 
    private GetPathRecordOptions(uri: vscode.Uri): string
    {
        let parentPath = this.GetPathParent(uri);

        let recordName = this.GetFileName(uri);

        return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.options.json`;
    }

    private GetPathRecordCss(uri: vscode.Uri): string
    {
        let parentPath = this.GetPathParent(uri);

        let recordName = this.GetFileName(uri);

        return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.scss`;
    }

    private GetPathRecordHtmlTemplate(uri: vscode.Uri): string
    {
        let parentPath = this.GetPathParent(uri);

        let recordName = this.GetFileName(uri);

        return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.html`;
    }

    private GetPathWorkspace(): vscode.WorkspaceFolder | undefined
    {
        if (this.HasWorkspace)
        {
            if (vscode.workspace.workspaceFolders !== undefined)
            {
                let workspaceRoot = vscode.workspace.workspaceFolders[0];
                return workspaceRoot;
            }
        }
    }

    //read text files
    private ReadTextFile(path: string, encoding: string = "utf8"): string | undefined
    {
        try
        {
            let content = fileSystem.readFileSync(path, "utf8");
            return content;
        }
        catch (e)
        {
            console.error(e.message);
        }
    }



    private HasWorkspace(): boolean
    {
        if (vscode.workspace.name !== undefined)
        {
            return true;
        }
        else
        {
            vscode.window.showErrorMessage("a workspace is required");
            return false;
        }
    }

    private CreateFolder(path: string)
    {
        if (!this.FolderExist(path))
        {
            fileSystem.mkdir(path, (res) =>
            {
                //only exceptions is parsed on callback 
                if (res)
                {
                    vscode.window.showErrorMessage(res.message);
                }
            });
        }
    }

    private FolderExist(path: string): boolean
    {
        try
        {
            fileSystem.readdirSync(path);
            console.warn(`Folder Already Exist: ${path}`);
            return true;
        }
        //throws if no folder by that name exist
        catch (error)
        {

            return false;
        }
    }

    private OverwriteFile(path: string, value: string): void
    {
        if (this.FileExist(path))
        {
            this.WriteFile(path, "");
            this.WriteFile(path, value);
        }
        else
        {
            console.warn(`File not found: ${path}`);
        }
    }

    private CreateFile(path: string, value: string): void
    {
        if (!this.FileExist(path))
        {
            this.WriteFile(path, value);
        }
    }

    private WriteFile(path: string, value: string): void
    {
        try
        {
            fileSystem.writeFile(path, value, 'utf8', (err) => { console.error(err.message); });
        }
        catch (e)
        {
            console.error(e);
        }
    }

    private FileExist(path: string): boolean
    {
        try
        {
            fileSystem.readFileSync(path);
            console.warn(`File Already Exist: ${path}`);
            return true;
        }
        catch (error)
        {
            return false;
        }
    }
}