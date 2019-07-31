'use strict';
import * as vscode from 'vscode';
//import { URL } from 'url';
import { Md5 } from "md5-typescript";
import * as ServiceNow from './ServiceNow/all';
import * as Managers from './Manager/all';
import { StatusBarManager, NotifationState } from './Manager/all';
import { SupportedRecords, ISysWsOperation, SupportedRecordsHelper } from './ServiceNow/all';
import { ISysMetadataIWorkspaceConvertable } from './MixIns/all';
import { URL } from 'url';
import { TreeDataProviderCodeSearch } from './Providers/all';

const mixpanel = new Managers.Mixpanel();

export function activate(context: vscode.ExtensionContext)
{
    const wsm = new Managers.WorkspaceStateManager(context);
    const wm = new Managers.WorkspaceManager(wsm);
    const nm = new StatusBarManager();

    let instance: ServiceNow.Instance;
    let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("cn");
    let searchProvider: TreeDataProviderCodeSearch = new TreeDataProviderCodeSearch();

    mixpanel.track("cn.extension.activated");

    if (wsm.HasInstanceInState)
    {
        instance = new ServiceNow.Instance(config);

        vscode.window.showWarningMessage("Not connected to an instanse - Record synchronization disabled");
    }

    //Configure instance object
    let connect = vscode.commands.registerCommand('cn.connect', () =>
    {
        wm.ConfigureWorkspace(context);

        let option = new Object() as vscode.InputBoxOptions;

        if (wsm.HasInstanceInState())
        {
            option.prompt = "Enter Password";
            option.password = true;
            let promisePassword = vscode.window.showInputBox(option);

            promisePassword.then((res) =>
            {
                if (res !== undefined)
                {
                    let url = wsm.GetUrl();
                    let usr = wsm.GetUserName();
                    if (url && usr)
                    {
                        let p = instance.Initialize(new URL(url), usr, res, wsm, nm);
                        nm.SetNotificationState(NotifationState.Downloading);
                        p.then(() =>
                        {
                            wm.AddInstanceFolder(instance);
                            nm.SetNotificationState(NotifationState.Connected);
                            wm.RefreshRecords(instance);
                            mixpanel.track("cn.extension.command.connect.success", {
                                username: Md5.init(instance.UserName),
                                instance: instance.Url,
                                newWorkspace: false
                            });
                        }).catch((er) =>
                        {
                            nm.SetNotificationState(NotifationState.NotConnected);
                            vscode.window.showErrorMessage(er.message);
                            mixpanel.track("cn.extension.command.connect.fail", {
                                error: er.message
                            });
                        });
                    }
                }
            });
        }
        else
        {
            option.prompt = "ServiceNow Instance Name";
            let PromiseUrl = vscode.window.showInputBox(option);

            PromiseUrl.then((res) =>
            {
                if (res !== undefined)
                {
                    wsm.SetUrl(`https://${res}.service-now.com`);

                    option.prompt = "Enter User Name";
                    let PromiseUserName = vscode.window.showInputBox(option);

                    PromiseUserName.then((res) =>
                    {
                        if (res !== undefined)
                        {
                            wsm.SetUserName(res);

                            option.prompt = "Enter Password";
                            option.password = true;
                            let PromisePassword = vscode.window.showInputBox(option);

                            PromisePassword.then((res) =>
                            {
                                if (res !== undefined)
                                {
                                    let usr = wsm.GetUserName();
                                    let url = wsm.GetUrl();
                                    let pw = res;

                                    if (url && usr)
                                    {
                                        let p = instance.Initialize(new URL(url), usr, pw, wsm, nm);
                                        nm.SetNotificationState(NotifationState.Downloading);
                                        p.then(() =>
                                        {
                                            wm.AddInstanceFolder(instance);
                                            nm.SetNotificationState(NotifationState.Connected);
                                            mixpanel.track("cn.extension.command.connect.success", {
                                                username: Md5.init(instance.UserName),
                                                instance: instance.Url,
                                                newWorkspace: true
                                            });
                                        }).catch((er) =>
                                        {
                                            wsm.ClearState();
                                            nm.SetNotificationState(NotifationState.NotConnected);
                                            vscode.window.showErrorMessage(er.message);
                                            mixpanel.track("cn.extension.command.connect.fail", {
                                                error: er.message
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    let openInPlatformRecord = vscode.commands.registerCommand("cn.openInPlatformRecord", (uri) =>
    {
        if (instance.IsInitialized())
        {
            var recordLocal = wm.GetRecord(uri);
            if (recordLocal)
            {
                instance.OpenInPlatformRecord(recordLocal);
                mixpanel.track('cn.extension.command.openInPlatformRecord', {
                    sys_class_name: recordLocal.sys_class_name
                });
            }
        }
    });

    let openInPlatformList = vscode.commands.registerCommand("cn.openInPlatformList", (uri) =>
    {
        if (instance.IsInitialized())
        {
            var recordLocal = wm.GetRecord(uri);
            if (recordLocal)
            {
                instance.OpenInPlatformList(recordLocal);
                mixpanel.track('cn.extension.command.openInPlatformList', {
                    sys_class_name: recordLocal.sys_class_name
                });
            }
        }
    });

    let setUpdateSet = vscode.commands.registerCommand("cn.setUpdateset", () =>
    {
        if (instance.IsInitialized())
        {
            let us = instance.GetUpdateSets();

            us.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        let set = instance.SetUpdateSet(item);

                        if (set)
                        {
                            set.then((us) =>
                            {
                                wsm.SetUpdateSet(us);

                                nm.SetNotificationUpdateSet(us);
                                let msg = `UpdateSet Changed: ${us.name}`;
                                console.log(msg);
                                vscode.window.showInformationMessage(msg);

                                mixpanel.track('cn.extension.command.setUpdateSet.success');
                            }).catch((er) =>
                            {
                                console.error(er);

                                mixpanel.track('cn.extension.command.setUpdateSet.fail', {
                                    error: er
                                });
                            });
                        }
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
                mixpanel.track('cn.extension.command.setUpdateSet.fail', {
                    error: er
                });
            });
        }
    });

    let addRecord = vscode.commands.registerCommand("cn.addRecord", () =>
    {
        if (instance.IsInitialized())
        {
            //remove Scripted rest definitions. Not selecetable but required for caching purposes. 
            let availableRecordsFiltered = SupportedRecordsHelper.GetRecordsDisplayValueFiltered();

            let p = vscode.window.showQuickPick(availableRecordsFiltered, { placeHolder: "Select Record" });

            p.then(async (res) =>
            {
                if (res)
                {
                    try
                    {
                        let className: string = "";

                        //@ts-ignore index error false
                        let recordType: SupportedRecords = SupportedRecords[res];

                        switch (recordType)
                        {
                            //handle rest api identically
                            case SupportedRecords["Scripted Rest API"]:
                                let restDefs = await instance.GetRecords(SupportedRecords["Scripted Rest Definition"]);
                                let restDef = await vscode.window.showQuickPick(restDefs);

                                if (restDef)
                                {
                                    let restOps = await instance.GetRecords(SupportedRecords["Scripted Rest API"]);

                                    if (restOps)
                                    {
                                        let ops = restOps as Array<ISysWsOperation>;

                                        let restOp = await vscode.window.showQuickPick(ops.filter((e) =>
                                        {
                                            //@ts-ignore restDef already nullchecked
                                            return e.web_service_definition.value === restDef.sys_id;
                                        }));

                                        if (restOp)
                                        {
                                            wm.AddRecord(restOp, instance);
                                            className = restOp.sys_class_name;
                                        }
                                    }
                                }
                                break;
                            default:
                                let records = await instance.GetRecords(recordType);

                                let record = await vscode.window.showQuickPick(records);

                                if (record)
                                {
                                    wm.AddRecord(record, instance);
                                    className = record.sys_class_name;
                                }
                                break;
                        }
                        mixpanel.track('cn.extension.command.addRecord.success', {
                            sys_class_name: className
                        });
                    }
                    catch (error)
                    {
                        console.error(error);
                        mixpanel.track('cn.extension.command.addRecord.fail', {
                            error: error
                        });
                    }
                }
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    let createRecord = vscode.commands.registerCommand('cn.createRecord', () =>
    {
        //add rest
        if (instance.IsInitialized())
        {
            //remove Scripted rest definitions. Not selecetable but required for caching purposes. 
            let availableRecordsFiltered = SupportedRecordsHelper.GetRecordsDisplayValueFiltered();

            let p = vscode.window.showQuickPick(availableRecordsFiltered, { placeHolder: "Select Record" });
            p.then((recordtype) =>
            {
                if (recordtype)
                {
                    let n = vscode.window.showInputBox({ prompt: "Name of the Record" });
                    n.then(async (name) =>
                    {
                        if (name)
                        {
                            try
                            {
                                switch (recordtype)
                                {
                                    case "Angular Provider": {
                                        vscode.window.showQuickPick(["Directive", "Service", "Factory"], {
                                            placeHolder: "Choose Type"
                                        }).then((item) =>
                                        {
                                            let r = instance.CreateRecord(SupportedRecords[recordtype], {
                                                'name': name,
                                                'type': item
                                            });

                                            //@ts-ignore already null checked
                                            r.then((newRecord) =>
                                            {
                                                wm.AddRecord(newRecord, instance);
                                            }).catch((err) =>
                                            {
                                                throw new Error(err);
                                            });
                                        });
                                        break;
                                    }
                                    case "UI Page": {
                                        vscode.window.showQuickPick(["Content Management", "General", "Home Pages", "HTML Editor", "Knowledge Base", "Service Catalog"], {
                                            placeHolder: "Choose Category"
                                        }).then((item) =>
                                        {
                                            let r = instance.CreateRecord(SupportedRecords[recordtype], {
                                                'name': name,
                                                'category': item
                                            });

                                            //@ts-ignore already null checked
                                            r.then((newRecord) =>
                                            {
                                                wm.AddRecord(newRecord, instance);
                                            }).catch((err) =>
                                            {
                                                throw new Error(err);
                                            });
                                        });
                                        break;
                                    }
                                    case "Validation Script": {
                                        vscode.window.showQuickPick(["Approval Rules", "Audio", "Auto Number", "Basic Date/Time", "Basic Image", "Basic Time",
                                            "Bootstrap Color", "Breakdown Element", "Catalog Preview", "Char", "Choice", "Collection", "Color", "Color Display", "Composite Field", "Composite Name",
                                            "Compressed", "Condition String", "Conditions", "Counter", "CSS", "Currency", "Data Array", "Data Object", "Data Structure",
                                            "Date", "Date/Time", "Day of Week", "Days of Week", "Decimal", "Document ID", "Documentation Field", "Domain ID", "Domain Path", "Due Date", "Duration",
                                            "Email", "Email Script", "External Names", "Field List", "Field Name", "File Attachment", "Floating Point Number", "Formula",
                                            "Glide Var", "Glyph Icon (Bootstrap)", "HTML", "HTML Script", "HTML Template", "Icon", "Image", "Index Name", "Integer", "Integer Date", "Integer String", "Integer Time", "Integer Type",
                                            " IP Address", "IP Address (Validated IPV4, IPV6)", "Journal", "Journal Input", "Journal List", "JSON",
                                            "List", "Long", "Long Integer String", "Mask Code", "Metric Absolute", "Metric Counter", "Metric Derive", "Metric Gauge", "MID Server Configuration", "Month of Year", "Multiple Line Small Text Area",
                                            "Name-Value Pairs", "Name/Values", "NL Task Integer 1", "Order Index", "Other Date", "Password (1 Way Encrypted)", "Password (2 Way Encrypted)", "Percent Complete", "Phone Number", "Phone Nymber (E164)",
                                            "Phone Number (Unused)", "Precise Time", "Price", "Properties", "Radio Button Choice", "Records", "Reference", "Reference Name", "Related Tags",
                                            "Reminder Field Name", "Repeat Count", "Repeat Type", "Replication Payload", "Schedule Date/Time", "Script", "Script (Plain)", "Script (server side)",
                                            "Short Field Name", "Short Table Name", "Slush Bucket", "Snapshot Template Value", "Source ID", "Source Name", "Source Table", "String", "String (Full UTF-8)", "string_boolean", "Sys ID (GUID)", "System Class Name", "System Class path", "System Event Name", "System Rule Field Name",
                                            "Table Name", "Template Value", "Time", "Timer", "Translated", "Translated HTML", "Translated Text", "Tree Code", "Tree Path", "True/False", "Two Line Text Area",
                                            "UI Action List", "URL", "User Input", "User Roles", "Variable Conditions", "Variable template value", "Variables",
                                            "Version", "Video", "Week of Month", "Wide Text", "Wiki", "WMS Job", "Workflow", "Workflow Conditions", "XML"], {
                                                placeHolder: "Choose Type"
                                            }).then((item) =>
                                            {
                                                let r = instance.CreateRecord(SupportedRecords[recordtype], {
                                                    'description': name,
                                                    'internal_type': item
                                                });

                                                //@ts-ignore already null checked
                                                r.then((newRecord) =>
                                                {
                                                    wm.AddRecord(newRecord, instance);
                                                }).catch((err) =>
                                                {
                                                    throw new Error(err);
                                                });
                                            });

                                        break;
                                    }
                                    case "Scripted Rest API":
                                        //select http method.

                                        let method = await vscode.window.showQuickPick(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], { placeHolder: "Select HTTP method" });

                                        //Create or use existing rest service
                                        let existing = await vscode.window.showQuickPick(['Existing Rest Service', 'New Rest Service'], { placeHolder: "Select Rest Service" });

                                        if (existing)
                                        {
                                            let definition: ISysMetadataIWorkspaceConvertable | undefined;
                                            if (existing === "New Rest Service")
                                            {
                                                let restServiceName = await vscode.window.showInputBox({ prompt: "Name of the service" });

                                                if (restServiceName)
                                                {
                                                    definition = await instance.CreateRecord(SupportedRecords["Scripted Rest Definition"], {
                                                        'name': restServiceName
                                                    });
                                                }
                                            }
                                            else
                                            {

                                                let definitions = await instance.GetRecords(SupportedRecords["Scripted Rest Definition"]);

                                                if (definitions)
                                                {
                                                    definition = await vscode.window.showQuickPick(definitions, { placeHolder: "Select Rest Service" });
                                                }
                                            }

                                            //create operation
                                            if (definition)
                                            {
                                                let newOperation = await instance.CreateRecord(SupportedRecords["Scripted Rest API"], {
                                                    'name': name,
                                                    'web_service_definition': definition.sys_id,
                                                    'http_method': method,
                                                });

                                                if (newOperation)
                                                {
                                                    wm.AddRecord(newOperation, instance);
                                                }
                                            }
                                        }
                                        break;
                                    default: {
                                        //@ts-ignore index error false
                                        let r = instance.CreateRecord(SupportedRecords[recordtype], {
                                            'name': name
                                        });
                                        //@ts-ignore already null checked

                                        r.then((newRecord) =>
                                        {
                                            wm.AddRecord(newRecord, instance);
                                        }).catch((err) =>
                                        {
                                            throw new Error(err);
                                        });
                                        break;
                                    }
                                }
                                mixpanel.track('cn.extension.command.createRecord.success', {
                                    //@ts-ignore index any is a string.
                                    sys_class_name: recordtype
                                });
                            } catch (error)
                            {
                                vscode.window.showErrorMessage(error);
                                mixpanel.track('cn.extension.command.createRecord.fail', {
                                    error: error
                                });
                            }
                        }
                    });
                }
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
            mixpanel.track('cn.extension.command.createRecord.fail', {
                error: "NotConnected"
            });
        }
    });

    let saveRecord = vscode.commands.registerCommand("cn.saveRecord", (uri) =>
    {
        if (instance.IsInitialized())
        {
            let p = instance.UpdateSetIsValid();

            p.then((res) =>
            {
                let record = wm.GetRecord(uri);

                if (record)
                {
                    let o = instance.SaveRecord(record);
                    if (o)
                    {
                        o.then((res) =>
                        {
                            vscode.window.showInformationMessage(`Saved`);
                            wm.UpdateRecord(res, uri);

                            mixpanel.track('cn.extension.command.saveRecord.success', {
                                sys_class_name: res.sys_class_name
                            });
                        }).catch((er) =>
                        {
                            vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);
                            mixpanel.track('cn.extension.command.saveRecord.fail', {
                                error: er.error.message
                            });
                        });
                    }
                }
            }).catch((err) =>
            {
                vscode.window.showErrorMessage("Update set no longer in progress. Changes not saves to instance.");
                mixpanel.track('cn.extension.command.saveRecord.break', {
                    reason: "UpdateSetNoLongerAvailable"
                });
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
            mixpanel.track('cn.extension.command.saveRecord.fail', {
                error: "NotConnected"
            });
        }
    });

    let updateRecord = vscode.commands.registerCommand("cn.updateRecord", (uri) =>
    {
        if (instance.IsInitialized())
        {
            var recordLocal = wm.GetRecord(uri);
            if (recordLocal)
            {
                let r = instance.GetRecord(recordLocal);
                r.then((res) =>
                {
                    wm.UpdateRecord(res, uri);
                    mixpanel.track('cn.extension.command.updateRecord.success', {
                        sys_class_name: res.sys_class_name
                    });
                }).catch((er) =>
                {
                    console.error(er);
                    mixpanel.track('cn.extension.command.updateRecord.fail', {
                        error: er
                    });
                });
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
            mixpanel.track('cn.extension.command.updateRecord.fail', {
                error: "NotConnected"
            });
        }
    });

    let deleteRecord = vscode.commands.registerCommand("cn.deleteRecord", (uri) =>
    {
        if (instance.IsInitialized())
        {
            let record = wm.GetRecord(uri);

            if (record)
            {
                let o = instance.DeleteRecord(record);
                if (o)
                {
                    o.then((res) =>
                    {
                        vscode.window.showInformationMessage(`Record Deleted`);

                        wm.DeleteRecord(uri.fsPath);
                    }).catch((er) =>
                    {
                        vscode.window.showErrorMessage(`Delete Failed: ${er.error.message}`);
                    });
                }
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    let clearWorkState = vscode.commands.registerCommand("cn.clearWorkSpaceState", () =>
    {
        wsm.ClearState();
        instance = new ServiceNow.Instance(config);
        nm.SetNotificationState(NotifationState.NotConnected);
        mixpanel.track('cn.extension.command.clearWorkSpaceState.success');
    });

    let rebuildCache = vscode.commands.registerCommand("cn.rebuildCache", () =>
    {
        instance.RebuildCache();
        mixpanel.track('cn.extension.command.rebuildCache.success');
    });

    let codeSearch = vscode.commands.registerCommand("cn.codeSearch", async () =>
    {
        if (instance.IsInitialized())
        {
            var term = await vscode.window.showInputBox({ placeHolder: "Search Term" });

            if (term)
            {
                vscode.window.withProgress<number>({
                    location: vscode.ProgressLocation.Notification,
                    title: "Code Search"
                }, async (progress) =>
                    {
                        progress.report({ message: `Searching for: ${term}` });

                        //@ts-ignore term already null checked
                        var res = await instance.search(term);

                        mixpanel.track('cn.extension.command.codeSearch.success');

                        //@ts-ignore term already null checked
                        return searchProvider.addSearch(res, term);
                    });
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    let codeSearchClear = vscode.commands.registerCommand("cn.codeSearchClear", async () =>
    {
        if (instance.IsInitialized())
        {
            searchProvider.clearSearch();
            mixpanel.track('cn.extension.command.codeSearchClear.success');
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    let codeSearchOpenInPlatform = vscode.commands.registerCommand("cn.codeSearchOpenInPlatform", async (item) =>
    {
        //command only available after successfull connection and retrival of search result.
        if (instance.IsInitialized())
        {
            instance.OpenInPlatformRecord(item);
        }
    });

    let codeSearchOpenInCode = vscode.commands.registerCommand("cn.codeSearchOpenInCode", async (item) =>
    {
        console.log("Open the record in code");
        console.log(item);

        let record = await instance.GetRecord(item);
        console.log(record);
        if (!record.canWrite)
        {
            vscode.window.showWarningMessage(`Record Read Only, Protection Policy: ${record.sys_policy}`);
        }
        wm.AddRecord(record, instance);
    });

    let createUpdateSet = vscode.commands.registerCommand("cn.createUpdateSet", async () =>
    {
        //vscode.window.showInformationMessage('Hello World!');
        if (instance.IsInitialized())
        {
            try
            {
                let UpdateSetName = await vscode.window.showInputBox({ prompt: "Enter update-set name" });

                if (UpdateSetName)
                {
                    let setAsCurrent = await vscode.window.showQuickPick(["Yes", "No"], {
                        placeHolder: "Set as current?"
                    });

                    if (setAsCurrent)
                    {
                        let SelectParent = await vscode.window.showQuickPick(["Yes", "No"], {
                            placeHolder: "Set Parent Update-Set?"
                        });

                        if (SelectParent)
                        {
                            //get parent sys id if chosen
                            let parentId = "";
                            let userSkip = false;
                            if (SelectParent === "Yes")
                            {
                                let getUpdateset = await instance.GetUpdateSets();
                                let parent = await vscode.window.showQuickPick(getUpdateset);

                                if (parent)
                                {
                                    parentId = parent.sys_id;
                                }
                                else
                                {
                                    //if user breaks when selecting update set do not continue. 
                                    userSkip = true;
                                }
                            }

                            if (!userSkip)
                            {
                                //create update set.
                                let newUpdateset = await instance.CreateUpdateSet(UpdateSetName, parentId);

                                if (setAsCurrent === "Yes")
                                {
                                    let set = await instance.SetUpdateSet(newUpdateset);
                                    if (set)
                                    {
                                        wsm.SetUpdateSet(set);

                                        nm.SetNotificationUpdateSet(set);
                                        let msg = `UpdateSet Created and set as current: ${set.name}`;
                                        console.log(msg);
                                        vscode.window.showInformationMessage(msg);
                                    }
                                }
                                else
                                {
                                    let msg = `UpdateSet Created: ${newUpdateset.name}`;
                                    console.log(msg);
                                    vscode.window.showInformationMessage(msg);
                                }
                            }

                            mixpanel.track('cn.extension.command.createUpdateSet.success', {
                                "parent": (SelectParent === "Yes"),
                                "setAsCurrent": (setAsCurrent === "Yes"),
                                "breakByUser": userSkip
                            });
                        }
                    }
                }
            } catch (error)
            {
                console.error(error);
                mixpanel.track('cn.extension.command.createUpdateSet.fail', {
                    error: error.message
                });
            }
        }
    });

    var listenerOnDidSave = vscode.workspace.onDidSaveTextDocument((e) =>
    {
        if (instance.IsInitialized())
        {
            let p = instance.UpdateSetIsValid();

            p.then((res) =>
            {
                if (config.uploadOnSave)
                {
                    let record = wm.GetRecord(e.uri);

                    if (record)
                    {
                        if (record.canWrite)
                        {
                            let p = instance.IsLatest(record);

                            p.then((res) =>
                            {
                                vscode.window.showWarningMessage(`Newer Version of record ${res.sys_id} Found on instance`);

                                mixpanel.track('cn.extension.event.onDidSaveTextDocument.break', {
                                    reason: "Local Record outdated"
                                });
                            }).catch((er) =>
                            {
                                if (record)
                                {
                                    let o = instance.SaveRecord(record);

                                    if (o)
                                    {
                                        o.then((res) =>
                                        {
                                            vscode.window.showInformationMessage(`Saved`);
                                            wm.UpdateRecord(res, e.uri);

                                            mixpanel.track('cn.extension.event.onDidSaveTextDocument.success', {
                                                sys_class_name: res.sys_class_name
                                            });
                                        }).catch((er) =>
                                        {
                                            vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);

                                            mixpanel.track('cn.extension.event.onDidSaveTextDocument.fail', {
                                                error: er.error.message
                                            });
                                        });
                                    }
                                }
                            });
                        }
                        else
                        {
                            vscode.window.showWarningMessage(`Record Protection policy: ${record.sys_policy}, Not saved`);

                            mixpanel.track('cn.extension.event.onDidSaveTextDocument.break', {
                                reason: "Record Policy Read Only"
                            });
                        }
                    }
                }
            }).catch((err) =>
            {
                vscode.window.showErrorMessage("Update set no longer in progress. Changes not saves to instance.");
                mixpanel.track('cn.extension.event.onDidSaveTextDocument.break', {
                    reason: "Updateset No Longer Available"
                });
            });
        }
        else
        {
            console.warn("Connect to an instance - File not saved to ServiceNow");
        }
    });

    var listenerOnDidOpen = vscode.workspace.onDidOpenTextDocument((e) =>
    {
        if (instance.IsInitialized())
        {
            if (wm.fileFromInstance(e.uri, instance))
            {
                if (config.addOnOpen)
                {
                    var recordLocal = wm.GetRecord(e.uri);
                    if (recordLocal)
                    {
                        var p = instance.IsLatest(recordLocal);

                        p.then((res) =>
                        {
                            let r = instance.GetRecord(res);
                            r.then((res) =>
                            {
                                wm.UpdateRecord(res, e.uri);

                                mixpanel.track('cn.extension.event.onDidOpenTextDocument.success', {
                                    sys_class_name: res.sys_class_name
                                });

                            }).catch((er) =>
                            {
                                console.error(er);

                                mixpanel.track('cn.extension.event.onDidOpenTextDocument.fail', {
                                    error: er
                                });
                            });
                        }).catch((e) =>
                        {
                            console.info("local Record Up to date");
                            mixpanel.track('cn.extension.event.onDidOpenTextDocument.break', {
                                reason: "Local Record Up To Date"
                            });
                        });
                    }
                }
            }
        }
        else
        {
            console.warn("Connect to an instance - File not updated");
        }
    });

    let listeneronDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration((e) =>
    {
        config = vscode.workspace.getConfiguration("cn");

        instance.setConfig(config);

        //config setup. 
        mixpanel.track('cn.extension.event.onDidChangeConfiguration', config);
    });

    let codeSearchProvider = vscode.window.registerTreeDataProvider('searchResults', searchProvider);

    context.subscriptions.push(addRecord);
    context.subscriptions.push(openInPlatformRecord);
    context.subscriptions.push(openInPlatformList);
    context.subscriptions.push(deleteRecord);
    context.subscriptions.push(setUpdateSet);
    context.subscriptions.push(codeSearch);
    context.subscriptions.push(codeSearchClear);
    context.subscriptions.push(codeSearchProvider);
    context.subscriptions.push(codeSearchOpenInPlatform);
    context.subscriptions.push(codeSearchOpenInCode);
    context.subscriptions.push(connect);
    context.subscriptions.push(createRecord);
    context.subscriptions.push(createUpdateSet);
    context.subscriptions.push(clearWorkState);
    context.subscriptions.push(listenerOnDidSave);
    context.subscriptions.push(listenerOnDidOpen);
    context.subscriptions.push(listeneronDidChangeConfiguration);
    context.subscriptions.push(rebuildCache);
    context.subscriptions.push(saveRecord);
    context.subscriptions.push(updateRecord);
}
// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext)
{
    mixpanel.track('cn.extension.deactivate');
}