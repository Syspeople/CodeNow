import * as fileSystem from 'fs';
import * as path from 'path';

import { Instance, Converter } from '../ServiceNow/all';
import { MetaData, WorkspaceStateManager, IWorkspaceConvertable } from './all';
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
                let arrEnum = Converter.getFileTypes();

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
                let msg = "Unable to find metadata in workspace. Add record to reload metadata for " + uri.fsPath;
                console.warn(msg);
                window.showWarningMessage(msg);
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
            let arrEnum = Converter.getFileTypes();

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

    public RefreshRecords(i: Instance): void
    {
        var pathIns = this.GetPathInstance(i);


        if (pathIns)
        {
            var allFiles = this.getFiles(pathIns.toString());


            allFiles.forEach(filePath =>
            {
                var uri = Uri.file(filePath);

                var recordLocal = this.GetRecord(uri);
                if (recordLocal)
                {
                    let r = i.GetRecord(recordLocal);
                    r.then((res) =>
                    {
                        this.UpdateRecord(res, uri);
                    }).catch((er) =>
                    {
                        console.error(er);
                    });
                }
            });

        }
    }

    public fileFromInstance(uri: Uri, instance: Instance): boolean
    {
        var pathIns = this.GetPathInstance(instance);

        if (pathIns)
        {
            var allFiles = this.getFiles(pathIns.toString());

            let match = allFiles.find((element) =>
            {
                return uri.fsPath === element;
            });
            if (match)
            {
                return true;
            }
        }
        return false;
    }

    /**
     * AddRecord a new record. 
     */
    public AddRecord<T extends ISysMetadataIWorkspaceConvertable>(record: T, instance: Instance): Promise<MetaData>
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let options = this.createMetadata(record, instance);

                if (options)
                {
                    //all supported files.
                    let arrEnum = Converter.getFileTypes();

                    for (let index = 0; index < arrEnum.length; index++)
                    {
                        let element = arrEnum[index];
                        //create files.
                        let uri = options.getFileUri(element);
                        if (uri)
                        {
                            await this.ensurePath(uri, instance);
                            let content = record.GetAttribute(element);
                            if (content || content === "")
                            {
                                await this.CreateFile(uri.fsPath, content);
                            }
                        }
                    }
                    resolve(options);
                }
            } catch (error)
            {
                reject(error);
            }
        });
    }

    /**
     * creates all parent folders if they do not exist. 
     * Only creates folders from the workspace root and downward.
     * @param uri 
     */
    private ensurePath(uri: Uri, instance: Instance): Promise<void>
    {
        return new Promise(async (resolve, reject) =>
        {
            if (this._delimiter)
            {
                let pathWorkspace = this.GetPathWorkspace();
                if (pathWorkspace)
                {

                    let folders = uri.fsPath.replace(pathWorkspace.uri.fsPath, '').trim().split(this._delimiter);

                    let path = pathWorkspace.uri.fsPath;

                    for (let index = 0; index < folders.length - 1; index++)
                    {
                        const element = folders[index];
                        if (element)
                        {
                            path = path + `${this._delimiter}${element}`;
                            await this.CreateFolder(path);

                        }
                    }
                    resolve();
                }
                reject(new Error("Unable to get workspace"));
            }
        });
    }

    public DeleteRecord(uri: string): void
    {
        var parentFolder = path.dirname(uri);
        var allFiles = this.getFiles(parentFolder);


        allFiles.forEach(filePath =>
        {
            this.DeleteFile(filePath);
        });

        this.DeleteFolder(path.dirname(uri));
    }

    /**
     * Creates a metadata object for local reference from a record. 
     * @param record 
     * @param instance 
     */
    private createMetadata(record: IWorkspaceConvertable, instance: Instance): MetaData | undefined
    {
        try
        {
            let meta = record.GetMetadata(record, instance);

            if (meta)
            {
                this._wsm.AddMetaData(meta);
                return meta;
            }
        } catch (error)
        {
            throw error;
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

    private CreateFolder(path: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                if (!this.FolderExist(path))
                {
                    fileSystem.mkdirSync(path);
                }
                //all oaky if already exist. 
                resolve();
            } catch (error)
            {
                reject(error);
            }
        });
    }

    private DeleteFolder(path: string)
    {
        if (typeof String)
        {
            if (this.FolderExist(path))
            {
                fileSystem.rmdir(path, (res) =>
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
            return fileSystem.existsSync(path);
        }
        //throws if no folder by that name exist
        catch (error)
        {
            throw error;
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

    private DeleteFile(path: string): void
    {
        if (this.FileExist(path))
        {
            fileSystem.unlink(path, (res) =>
            {
                //only exceptions is parsed on callback 
                if (res)
                {
                    window.showErrorMessage(res.message);
                }
            });
        }
        else
        {
            console.warn(`File not found: ${path}`);
        }
    }

    private async CreateFile(path: string, value: string): Promise<void>
    {
        return new Promise(async (resolve, reject) =>
        {
            if (!this.FileExist(path))
            {
                await this.WriteFile(path, value);
                resolve();
            }
            else
            {
                reject(new Error("Path to do not exist"));
            }
        });
    }

    // Get all files from directory and sub-directories.
    private getFiles(dir: string, files_?: Array<string>): Array<string>
    {

        files_ = files_ || [];
        var files = fileSystem.readdirSync(dir);
        for (var i in files)
        {
            var name = dir + this._delimiter + files[i];
            if (fileSystem.statSync(name).isDirectory())
            {
                this.getFiles(name, files_);
            } else
            {
                files_.push(name);
            }
        }
        return files_;
    }

    private WriteFile(path: string, value: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {//message is null
                fileSystem.writeFileSync(path, value);
                resolve();
            }
            catch (error)
            {
                reject(error);
            }
        });

    }

    private FileExist(path: string): boolean
    {
        try
        {
            return fileSystem.existsSync(path);
        }
        catch (error)
        {
            throw error;
        }
    }
}