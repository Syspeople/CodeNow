'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { URL } from 'url';
import * as ServiceNow from './ServiceNow/all';
import * as Managers from './Manager/all';
import { StatusBarManager, NotifationState } from './Manager/all';
import { SupportedRecords } from './ServiceNow/all';

let token;
if (vscode.env.machineId === "someValue.machineId")
{
    //dev
    token = '48ec45ce7cb17e257d933d9cab2e0665';
}
else
{
    //prod
    token = 'dd31fdbf95e8a0bfb560cb8219b672f2';
}
const mixpanel = new Managers.Mixpanel(token);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    const wsm = new Managers.WorkspaceStateManager(context);
    const wm = new Managers.WorkspaceManager(wsm);
    const nm = new StatusBarManager();
    let instance: ServiceNow.Instance;
    let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("snsb");

    //vscode.env.machineId "someValue.machineId" means dev host.
    mixpanel.track("snsb.extension.activated");

    if (wsm.HasInstanceInState)
    {
        instance = new ServiceNow.Instance();

        vscode.window.showWarningMessage("Not connected to an instanse - Record synchronization disabled");
    }

    //Configure instance object
    let connect = vscode.commands.registerCommand('snsb.connect', () =>
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
                            mixpanel.track("snsb.extension.command.connect.success", {
                                username: instance.UserName,
                                instance: instance.Url,
                                newWorkspace: false
                            });
                        }).catch((er) =>
                        {
                            nm.SetNotificationState(NotifationState.NotConnected);
                            vscode.window.showErrorMessage(er.message);
                            mixpanel.track("snsb.extension.command.connect.fail", {
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
                                            mixpanel.track("snsb.extension.command.connect.success", {
                                                username: instance.UserName,
                                                instance: instance.Url,
                                                newWorkspace: true
                                            });

                                        }).catch((er) =>
                                        {
                                            wsm.ClearState();
                                            nm.SetNotificationState(NotifationState.NotConnected);
                                            vscode.window.showErrorMessage(er.message);
                                            mixpanel.track("snsb.extension.command.connect.fail", {
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

    let openInPlatformRecord = vscode.commands.registerCommand("snsb.openInPlatformRecord", (uri) =>
    {
        if (instance.IsInitialized())
        {
            var recordLocal = wm.GetRecord(uri);
            if (recordLocal)
            {
                instance.OpenInPlatformRecord(recordLocal);
                mixpanel.track('snsb.extension.command.openInPlatformRecord', {
                    sys_class_name: recordLocal.sys_class_name
                });
            }
        }
    });

    let openInPlatformList = vscode.commands.registerCommand("snsb.openInPlatformList", (uri) =>
    {
        if (instance.IsInitialized())
        {
            var recordLocal = wm.GetRecord(uri);
            if (recordLocal)
            {
                instance.OpenInPlatformList(recordLocal);
                mixpanel.track('snsb.extension.command.openInPlatformList', {
                    sys_class_name: recordLocal.sys_class_name
                });
            }
        }
    });

    let setUpdateSet = vscode.commands.registerCommand("snsb.setUpdateset", () =>
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

                                mixpanel.track('snsb.extension.command.setUpdateSet.success');
                            }).catch((er) =>
                            {
                                console.error(er);

                                mixpanel.track('snsb.extension.command.setUpdateSet.fail', {
                                    error: er
                                });
                            });
                        }
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
                mixpanel.track('snsb.extension.command.setUpdateSet.fail', {
                    error: er
                });
            });
        }
    });

    let addRecord = vscode.commands.registerCommand("snsb.addRecord", () =>
    {
        if (instance.IsInitialized())
        {
            let availableRecords = Object.keys(SupportedRecords);
            let p = vscode.window.showQuickPick(availableRecords, { placeHolder: "Select Record" });

            p.then((res) =>
            {
                if (res)
                {
                    //@ts-ignore index error false
                    let records = instance.GetRecords(SupportedRecords[res]);
                    records.then((res) =>
                    {
                        vscode.window.showQuickPick(res).then((item) =>
                        {
                            if (item)
                            {
                                wm.AddRecord(item, instance);
                                mixpanel.track('snsb.extension.command.addRecord.success', {
                                    sys_class_name: item.sys_class_name,
                                });
                            }
                        });
                    }).catch((er) =>
                    {
                        console.error(er);
                        mixpanel.track('snsb.extension.command.addRecord.fail', {
                            error: er
                        });
                    });
                }
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    let createRecord = vscode.commands.registerCommand('snsb.createRecord', () =>
    {
        if (instance.IsInitialized())
        {
            let availableRecords = Object.keys(SupportedRecords);
            let p = vscode.window.showQuickPick(availableRecords, { placeHolder: "Select Record" });
            p.then((recordtype) =>
            {
                if (recordtype)
                {
                    let n = vscode.window.showInputBox({ prompt: "Name of the Record" });
                    n.then((name) =>
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
                                mixpanel.track('snsb.extension.command.createRecord.success', {
                                    //@ts-ignore index any is a string.
                                    sys_class_name: SupportedRecords[recordtype]
                                });
                            } catch (error)
                            {
                                vscode.window.showErrorMessage(error);
                                mixpanel.track('snsb.extension.command.createRecord.fail', {
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
            mixpanel.track('snsb.extension.command.createRecord.fail', {
                error: "NotConnected"
            });
        }
    });

    let saveRecord = vscode.commands.registerCommand("snsb.saveRecord", (uri) =>
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

                            mixpanel.track('snsb.extension.command.saveRecord.success', {
                                sys_class_name: res.sys_class_name
                            });
                        }).catch((er) =>
                        {
                            vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);
                            mixpanel.track('snsb.extension.command.saveRecord.fail', {
                                error: er.error.message
                            });
                        });
                    }
                }
            }).catch((err) =>
            {
                vscode.window.showErrorMessage("Update set no longer in progress. Changes not saves to instance.");
                mixpanel.track('snsb.extension.command.saveRecord.break', {
                    reason: "UpdateSetNoLongerAvailable"
                });
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
            mixpanel.track('snsb.extension.command.saveRecord.fail', {
                error: "NotConnected"
            });
        }
    });

    let updateRecord = vscode.commands.registerCommand("snsb.updateRecord", (uri) =>
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
                    mixpanel.track('snsb.extension.command.updateRecord.success', {
                        sys_class_name: res.sys_class_name
                    });
                }).catch((er) =>
                {
                    console.error(er);
                    mixpanel.track('snsb.extension.command.updateRecord.fail', {
                        error: er
                    });
                });
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
            mixpanel.track('snsb.extension.command.updateRecord.fail', {
                error: "NotConnected"
            });
        }
    });

    let deleteRecord = vscode.commands.registerCommand("snsb.deleteRecord", (uri) =>
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

    let clearWorkState = vscode.commands.registerCommand("snsb.clearWorkSpaceState", () =>
    {
        wsm.ClearState();
        nm.SetNotificationState(NotifationState.NotConnected);
        mixpanel.track('snsb.extension.command.clearWorkSpaceState.success');
    });

    let rebuildCache = vscode.commands.registerCommand("snsb.rebuildCache", () =>
    {
        nm.SetNotificationState(NotifationState.NotConnected);
        instance.RebuildCache();
        mixpanel.track('snsb.extension.command.rebuildCache.success');
    });

    let createUpdateSet = vscode.commands.registerCommand("snsb.createUpdateSet", async () =>
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

                            mixpanel.track('snsb.extension.command.createUpdateSet.success', {
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
                mixpanel.track('snsb.extension.command.createUpdateSet.fail', {
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
                        let p = instance.IsLatest(record);

                        p.then((res) =>
                        {
                            vscode.window.showWarningMessage(`Newer Version of record ${res.sys_id} Found on instance`);

                            mixpanel.track('snsb.extension.event.onDidSaveTextDocument.break', {
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

                                        mixpanel.track('snsb.extension.event.onDidSaveTextDocument.success', {
                                            sys_class_name: res.sys_class_name
                                        });
                                    }).catch((er) =>
                                    {
                                        vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);

                                        mixpanel.track('snsb.extension.event.onDidSaveTextDocument.fail', {
                                            error: er.error.message
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            }).catch((err) =>
            {
                vscode.window.showErrorMessage("Update set no longer in progress. Changes not saves to instance.");
                mixpanel.track('snsb.extension.event.onDidSaveTextDocument.break', {
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

                            mixpanel.track('snsb.extension.event.onDidOpenTextDocument.success', {
                                sys_class_name: res.sys_class_name
                            });

                        }).catch((er) =>
                        {
                            console.error(er);

                            mixpanel.track('snsb.extension.event.onDidOpenTextDocument.fail', {
                                error: er
                            });
                        });
                    }).catch((e) =>
                    {
                        console.info("local Record Up to date");
                        mixpanel.track('snsb.extension.event.onDidOpenTextDocument.break', {
                            reason: "Local Record Up To Date"
                        });
                    });
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
        config = vscode.workspace.getConfiguration("snsb");
        //config setup. 
        mixpanel.track('snsb.extension.event.onDidChangeConfiguration', config);
    });

    context.subscriptions.push(addRecord);
    context.subscriptions.push(openInPlatformRecord);
    context.subscriptions.push(openInPlatformList);
    context.subscriptions.push(deleteRecord);
    context.subscriptions.push(setUpdateSet);
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
    mixpanel.track('snsb.extension.deactivate');
}