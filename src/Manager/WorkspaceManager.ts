import * as fileSystem from 'fs';
import { ISysMetadata, Instance, ISysScriptInclude, ISpWidget, ISpTheme, ISpCss, ISysUiScript, ISysMailScript, ISpHeaderFooter, IScriptedRestAPIResource, Converter, ISysEventScriptAction, ISysProcessor } from '../ServiceNow/all';
import { MetaData, KeyValuePair, WorkspaceStateManager, FileTypes } from './all';
import { Uri, ExtensionContext, window, WorkspaceFolder, workspace } from 'vscode';
import { ISysMetadataIWorkspaceConvertable } from '../MixIns/all';

export class WorkspaceManager
{

    constructor(wsm: WorkspaceStateManager)
    {
        this._wsm = wsm;
        this.SetDelimiter(this._wsm.getContext());
    }
    private _wsm: WorkspaceStateManager;
    private _delimiter: string | undefined;

    private SetDelimiter(context: ExtensionContext)
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
    public GetRecord(uri: Uri): ISysMetadataIWorkspaceConvertable | undefined
    {
        try
        {
            let md = this._wsm.GetMetaData(uri);

            if (md)
            {
                let record = Converter.CastSysMetaData(md);

                //read files into object
                let arrEnum = MetaData.getFileTypes();

                if (record)
                {
                    for (let index = 0; index < arrEnum.length; index++)
                    {
                        const element = arrEnum[index];
                        let uri = md.getFileUri(element);
                        if (uri && record)
                        {
                            let content = this.ReadTextFile(uri.fsPath);
                            if (content)
                            {
                                record.SetAttribute(content, element);
                            }
                        }
                    }
                    return record;
                }
            }
            else
            {
                console.warn("Unable to find metadataa in local storage for " + uri.fsPath);
            }
        }
        catch (e)
        {
            console.error(e.message);
        }
    }

    /**update record */
    public UpdateRecord(record: ISysMetadataIWorkspaceConvertable, uri: Uri): void
    {
        let meta = this._wsm.GetMetaData(uri);

        if (meta)
        {
            //all supported files.
            let arrEnum = MetaData.getFileTypes();

            for (let index = 0; index < arrEnum.length; index++)
            {
                const element = arrEnum[index];
                //create files.
                let uri = meta.getFileUri(element);
                if (uri)
                {
                    let content = record.GetAttribute(element);
                    if (content || content === "")
                    {
                        this.WriteFile(uri.fsPath, content);
                    }
                }
            }

            //update updated on timestamp
            meta.sys_updated_on = record.sys_updated_on;
            this._wsm.updateMetadata(meta);
        }
    }

    /**
     * AddRecord a new record. 
     */
    public AddRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T, instance: Instance): MetaData | undefined
    {
        let options = this.createMetadata(record, instance);

        if (options)
        {
            //ensure sysclass folder.
            let uriSys = options.getSysClassUri();
            this.CreateFolder(uriSys.fsPath);

            //ensure record Folder
            let uriRecord = options.getRecordUri();
            this.CreateFolder(uriRecord.fsPath);

            //all supported files.
            let arrEnum = MetaData.getFileTypes();

            for (let index = 0; index < arrEnum.length; index++)
            {
                const element = arrEnum[index];
                //create files.
                let uri = options.getFileUri(element);
                if (uri)
                {
                    let content = record.GetAttribute(element);
                    if (content || content === "")
                    {
                        this.CreateFile(uri.fsPath, content);
                    }
                }
            }
            return options;
        }
    }

    /**
     * Creates a metadata object for local reference from a record. 
     * @param record 
     * @param instance 
     */
    private createMetadata(record: ISysMetadata, instance: Instance): MetaData | undefined
    {
        let recordName: string;
        let f = new Array<KeyValuePair<FileTypes, Uri>>();
        let meta: MetaData | undefined;
        let instanceName: string;

        if (instance.Url)
        {
            instanceName = instance.Url.host;
        }
        else
        {
            throw new Error("Instance url undefined");
        }

        //add new records here
        switch (record.sys_class_name)
        {
            case "sys_script_include":
                recordName = (<ISysScriptInclude>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sp_widget":
                recordName = (<ISpWidget>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                f.push(new KeyValuePair(FileTypes.clientScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.clientScript)}`)));
                f.push(new KeyValuePair(FileTypes.styleSheet, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.styleSheet)}`)));
                f.push(new KeyValuePair(FileTypes.html, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.html)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sp_theme":
                recordName = (<ISpTheme>record).name;

                f.push(new KeyValuePair(FileTypes.styleSheet, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.styleSheet)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sp_css":
                recordName = (<ISpCss>record).name;

                f.push(new KeyValuePair(FileTypes.styleSheet, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.styleSheet)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sys_ui_script":
                recordName = (<ISysUiScript>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sp_header_footer":
                recordName = (<ISpHeaderFooter>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                f.push(new KeyValuePair(FileTypes.clientScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.clientScript)}`)));
                f.push(new KeyValuePair(FileTypes.styleSheet, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.styleSheet)}`)));
                f.push(new KeyValuePair(FileTypes.html, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.html)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sys_script_email":
                recordName = (<ISysMailScript>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sys_ws_operation":
                recordName = (<IScriptedRestAPIResource>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sysevent_script_action":
                recordName = (<ISysEventScriptAction>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            case "sys_processor":
                recordName = (<ISysProcessor>record).name;

                f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${recordName}.${this.getFileTypeExtension(FileTypes.serverScript)}`)));
                meta = new MetaData(record, f, instanceName, recordName);
                break;
            default:
                console.warn(`createMetadata: Record ${record.sys_class_name} not recognized`);
                break;
        }

        if (meta)
        {
            this._wsm.AddMetaData(meta);
            return meta;
        }
        else
        {
            console.warn("Metadata undefined");
        }
    }

    private getFileTypeExtension(type: FileTypes): string
    {
        switch (type)
        {
            case FileTypes.serverScript:
                return "server_script.js";
            case FileTypes.clientScript:
                return "client_script.js";
            case FileTypes.styleSheet:
                return "scss";
            case FileTypes.html:
                return "html";
            default:
                throw new Error("FileType not recognized");
        }
    }

    /**
     * ConfigureWorkspace
     */
    public ConfigureWorkspace(context: ExtensionContext)
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

    private GetPathInstance(i: Instance): string | undefined
    {
        let workspaceRoot = this.GetPathWorkspace();

        if (workspaceRoot && i.Url)
        {
            let path = `${workspaceRoot.uri.fsPath}${this._delimiter}${i.Url.host}`;
            return path;
        }
    }

    private GetPathWorkspace(): WorkspaceFolder | undefined
    {
        if (this.HasWorkspace)
        {
            if (workspace.workspaceFolders !== undefined)
            {
                let workspaceRoot = workspace.workspaceFolders[0];
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
        if (workspace.name !== undefined)
        {
            return true;
        }
        else
        {
            window.showErrorMessage("a workspace is required");
            return false;
        }
    }

    private CreateFolder(path: string)
    {
        if (typeof String)
        {
            if (!this.FolderExist(path))
            {
                fileSystem.mkdir(path, (res) =>
                {
                    //only exceptions is parsed on callback 
                    if (res)
                    {
                        window.showErrorMessage(res.message);
                    }
                });
            }
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
        {//message is null
            fileSystem.writeFile(path, value, 'utf8', (err) => { if (err) { console.error(err); } });
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