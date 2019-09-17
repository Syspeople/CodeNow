import { Uri, ExtensionContext } from 'vscode';
import { StateKeys, MemCache, MetaData, IWorkspaceConvertable } from "./all";
import { UpdateSet, SupportedRecords, ISysMetadata, Application } from "../ServiceNow/all";

//get update and manage workpace state.
export class WorkspaceStateManager
{

    constructor(context: ExtensionContext)
    {
        this._context = context;
        this._memCache = new MemCache();
    }

    private _memCache: MemCache;
    private _context: ExtensionContext;

    /**
     * Removes instance specifik entries cached in workspace.
     */
    public ClearState(): void
    {
        this._context.workspaceState.update(StateKeys.url.toString(), undefined);
        this._context.workspaceState.update(StateKeys.user.toString(), undefined);
        this._context.workspaceState.update(StateKeys.updateSet.toString(), undefined);
        this._context.workspaceState.update(StateKeys.application.toString(), undefined);
    }

    /**
     * Returns the Codes Extensioncontext
     */
    getContext(): ExtensionContext
    {
        return this._context;
    }

    /**
     * HasInstanceInState
     */
    public HasInstanceInState(): boolean
    {
        if (this.GetUrl() && this.GetUserName())
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * SetUrl
     */
    public SetUrl(url: string): void
    {
        this._context.workspaceState.update(StateKeys.url.toString(), url);
    }

    /**
     * GetInstance get Url from state
     */
    public GetUrl(): string | undefined
    {
        return this._context.workspaceState.get(StateKeys.url.toString()) as string;
    }

    /**
     * SetUserName
     */
    public SetUserName(url: string): void
    {
        this._context.workspaceState.update(StateKeys.user.toString(), url);
    }

    /**
     * GetUserName get username from state
     */
    public GetUserName(): string | undefined
    {
        return this._context.workspaceState.get(StateKeys.user.toString()) as string;
    }

    public SetUpdateSet(us: UpdateSet): void
    {
        this._context.workspaceState.update(StateKeys.updateSet.toString(), us);
    }

    public GetUpdateSet(): UpdateSet | undefined
    {
        return this._context.workspaceState.get(StateKeys.updateSet.toString());
    }

    setApplication(app: Application): void
    {
        this._context.workspaceState.update(StateKeys.application.toString(), app);
    }

    getApplication(): Application | undefined
    {
        return this._context.workspaceState.get(StateKeys.application.toString());
    }

    /**
     * overwrite local metadata with provided array
     */
    public SetMetaData(metaData: Array<MetaData>): void
    {
        this._context.workspaceState.update(StateKeys.metaData.toString(), metaData);
    }

    /**
    * add a single metadata instance to local storage
    */
    public AddMetaData(metadata: MetaData): void
    {
        let local: Array<MetaData> | undefined;
        local = this.GetMetaDataAll();

        if (local)
        {
            //check if sys id already exist. if so reuse. 
            let md = local.findIndex(e =>
            {
                return e.sys_id === metadata.sys_id;
            });

            if (md !== -1)
            {
                local[md] = metadata;
            }
            else
            {
                local.push(metadata);
            }
        }
        else
        {
            local = new Array<MetaData>();
            local.push(metadata);
        }
        this.SetMetaData(local);
    }

    /**
     * Will update an existing metadata object.
     * @param meta Metadata object to update in local storage
     */
    public updateMetadata(meta: MetaData): void
    {
        let all = this.GetMetaDataAll();
        if (all)
        {
            let md = all.findIndex(e =>
            {
                return e.sys_id === meta.sys_id;
            });

            if (md !== -1)
            {
                all[md] = meta;
                this.SetMetaData(all);
            }
            else
            {
                throw new Error("Metadata not found in cache");
            }
        }
    }

    /**
     * retrieved all local record metadata.
     */
    public GetMetaDataAll(): Array<MetaData> | undefined
    {
        let md = this._context.workspaceState.get(StateKeys.metaData.toString());
        return <Array<MetaData>>md;
    }

    /**
     * GetMetaData from URI
     */
    public GetMetaData(uri: Uri): MetaData | undefined
    {
        let all = this.GetMetaDataAll();
        if (all)
        {

            for (let j = 0; j < all.length; j++)
            {
                const element = all[j];
                let md = MetaData.fromJson(element);
                if (md.ContainsFile(uri))
                {
                    return md;
                }
            }
        }
        return;
    }



    /**
     * Dynamically caches records from instance. overwrites existing elements.
     * @param type 
     * @param records 
     */
    public SetRecords(type: SupportedRecords, records: Array<IWorkspaceConvertable>): void
    {
        this._memCache.Set(type, records);
    }

    /**
     * dynamically retrieves cached records.
     * @param type 
     */
    public GetRecords(type: SupportedRecords): Array<ISysMetadata> | undefined
    {
        return this._memCache.Get<Array<ISysMetadata>>(type);
    }
}