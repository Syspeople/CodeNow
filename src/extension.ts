'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { URL } from 'url';
import * as ServiceNow from './ServiceNow/all';
import * as Managers from './Manager/all';
import { StatusBarManager, NotifationState } from './Manager/all';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    console.info("SNSB Activated");

    const wsm = new Managers.WorkspaceStateManager(context);
    const wm = new Managers.WorkspaceManager(wsm);
    const nm = new StatusBarManager();
    let config: vscode.WorkspaceConfiguration;

    let instance: ServiceNow.Instance;
    if (wsm.HasInstanceInState)
    {
        instance = new ServiceNow.Instance();
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
                        }).catch((er) =>
                        {
                            nm.SetNotificationState(NotifationState.NotConnected);
                            vscode.window.showErrorMessage(er.message);
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
                                        }).catch((er) =>
                                        {
                                            wsm.ClearState();
                                            nm.SetNotificationState(NotifationState.NotConnected);
                                            vscode.window.showErrorMessage(er.message);
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
                            }).catch((er) =>
                            {
                                console.error(er);
                            });
                        }
                    }
                });
            }).catch((er) => console.error(er));
        }
    });

    /**
     * add include to workspace
     */
    let getInclude = vscode.commands.registerCommand("snsb.getInclude", () =>
    {
        if (instance.IsInitialized())
        {
            console.log("get includes");
            let includes = instance.GetScriptIncludes();
            includes.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add widget to workspace
     */
    let getWidget = vscode.commands.registerCommand("snsb.getWidget", () =>
    {
        if (instance.IsInitialized())
        {
            console.log("Get Widgets");
            let widgets = instance.GetWidgets();
            widgets.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add theme to workspace
     */
    let getTheme = vscode.commands.registerCommand("snsb.getTheme", () =>
    {
        if (instance.IsInitialized())
        {
            let themes = instance.GetThemes();
            themes.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add style sheet to workspace
     */
    let getStyleSheet = vscode.commands.registerCommand("snsb.getStyleSheet", () =>
    {
        if (instance.IsInitialized())
        {
            let themes = instance.getStyleSheets();
            themes.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add ui script to workspace
     */
    let getUiScript = vscode.commands.registerCommand("snsb.getUiScript", () =>
    {
        if (instance.IsInitialized())
        {
            let themes = instance.GetUiScripts();
            themes.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add mail script to workspace
     */
    let getMailScript = vscode.commands.registerCommand("snsb.getMailScript", () =>
    {
        if (instance.IsInitialized())
        {
            let themes = instance.GetMailScripts();
            themes.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add header an footer widgets to workspace
     */
    let getHeadersAndFooters = vscode.commands.registerCommand("snsb.getHeadersAndFooters", () =>
    {
        if (instance.IsInitialized())
        {
            let hf = instance.GetHeadersAndFooters();
            hf.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });

    /**
     * add scripted API to workspace
     */
    let getScriptedApiResource = vscode.commands.registerCommand("snsb.getScriptedRestApiResource", () =>
    {
        if (instance.IsInitialized())
        {
            let themes = instance.GetSriptedApiResources();
            themes.then((res) =>
            {
                vscode.window.showQuickPick(res).then((item) =>
                {
                    if (item)
                    {
                        wm.AddRecord(item, instance);
                    }
                });
            }).catch((er) =>
            {
                console.error(er);
            });
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
        }
    });


    let saveRecord = vscode.commands.registerCommand("snsb.saveRecord", (uri) =>
    {
        if (instance.IsInitialized())
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
                    }).catch((er) =>
                    {
                        vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);
                    });
                }
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance");
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
                }).catch((er) =>
                {
                    console.error(er);
                });
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
    });

    let rebuildCache = vscode.commands.registerCommand("snsb.rebuildCache", () =>
    {
        nm.SetNotificationState(NotifationState.NotConnected);
        instance.RebuildCache();
    });

    var listenerOnDidSave = vscode.workspace.onDidSaveTextDocument((e) =>
    {
        if (instance.IsInitialized())
        {
            config = vscode.workspace.getConfiguration("snsb");
            if (config.uploadOnSave)
            {
                let record = wm.GetRecord(e.uri);

                if (record)
                {
                    let p = instance.IsLatest(record);

                    p.then((res) =>
                    {
                        vscode.window.showWarningMessage(`Newer Version of record ${res.sys_id} Found on instance`);
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
                                }).catch((er) =>
                                {
                                    vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);
                                });
                            }
                        }
                    });
                }
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance - File not saved to ServiceNow");
        }
    });

    var listenerOnDidOpen = vscode.workspace.onDidOpenTextDocument((e) =>
    {
        if (instance.IsInitialized())
        {
            config = vscode.workspace.getConfiguration("snsb");
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
                        }).catch((er) =>
                        {
                            console.error(er);
                        });
                    }).catch((e) =>
                    {
                        console.info("local Record Up to date");
                    });
                }
            }
        }
        else
        {
            vscode.window.showErrorMessage("Connect to an instance - File not updated");
        }
    });

    context.subscriptions.push(openInPlatformRecord);
    context.subscriptions.push(openInPlatformList);
    context.subscriptions.push(setUpdateSet);
    context.subscriptions.push(connect);
    context.subscriptions.push(getInclude);
    context.subscriptions.push(getWidget);
    context.subscriptions.push(getTheme);
    context.subscriptions.push(getStyleSheet);
    context.subscriptions.push(getUiScript);
    context.subscriptions.push(getMailScript);
    context.subscriptions.push(getScriptedApiResource);
    context.subscriptions.push(getHeadersAndFooters);
    context.subscriptions.push(saveRecord);
    context.subscriptions.push(updateRecord);
    context.subscriptions.push(clearWorkState);
    context.subscriptions.push(rebuildCache);
    context.subscriptions.push(listenerOnDidSave);
    context.subscriptions.push(listenerOnDidOpen);
}
// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext)
{
}