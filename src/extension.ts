'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { URL } from 'url';
import * as ServiceNow from './ServiceNow/all';
import * as Managers from './Manager/all';
import { StatusBarManager, NotifationState } from './Manager/all';
import { SupportedRecords } from './ServiceNow/all';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    console.info("SNSB Activated");

    const wsm = new Managers.WorkspaceStateManager(context);
    const wm = new Managers.WorkspaceManager(wsm);
    const nm = new StatusBarManager();
    let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("snsb");

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
            let includes = instance.GetRecords(SupportedRecords["Script Include"]);
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
            let widgets = instance.GetRecords(SupportedRecords.Widget);
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
            let themes = instance.GetRecords(SupportedRecords.Theme);
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
            let themes = instance.GetRecords(SupportedRecords["UI Script"]);
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
            let themes = instance.GetRecords(SupportedRecords["UI Script"]);
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
            let themes = instance.GetRecords(SupportedRecords["Mail Script"]);
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
            let hf = instance.GetRecords(SupportedRecords["Header or Footer Widget"]);
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
            let themes = instance.GetRecords(SupportedRecords["Scripted Rest API"]);
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
     * add Script Actions to workspace
     */
    let getScriptAction = vscode.commands.registerCommand("snsb.getScriptAction", () =>
    {
        if (instance.IsInitialized())
        {
            let sa = instance.GetRecords(SupportedRecords["Script Action"]);
            sa.then((res) =>
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

    let getProcessor = vscode.commands.registerCommand("snsb.getProcessor", () =>
    {
        if (instance.IsInitialized())
        {
            let proc = instance.GetRecords(SupportedRecords.Processor);
            proc.then((res) =>
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
    let getAngularProvider = vscode.commands.registerCommand("snsb.getAngularProvider", () =>
    {
        if (instance.IsInitialized())
        {
            let themes = instance.GetRecords(SupportedRecords["Angular Provider"]);
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
                        }).catch((er) =>
                        {
                            vscode.window.showErrorMessage(`Save Failed: ${er.error.message}`);
                        });
                    }
                }
            }).catch((err) =>
            {
                vscode.window.showErrorMessage("Update set no longer in progress. Changes not saves to instance.");
            });
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
                        // //select template
                        // let templates = config.templates.find((element: object) =>
                        // {
                        //     //@ts-ignore already null checked and string value can only be valid or undefined.
                        //     return element.class_name === SupportedRecords[recordtype];
                        // });
                        // let t = vscode.window.showQuickPick(config.templates);

                        if (name)
                        {
                            //@ts-ignore already null checked
                            var r = instance.CreateRecord(SupportedRecords[recordtype], name);
                            r.then((newRecord) =>
                            {
                                wm.AddRecord(newRecord, instance);
                            }).catch((err) =>
                            {
                                vscode.window.showErrorMessage(err);
                            });
                        }
                    });
                }
            });
        }
    });

    let createUpdateSet = vscode.commands.registerCommand("snsb.createUpdateSet", () =>
    {
        //vscode.window.showInformationMessage('Hello World!');
        if (instance.IsInitialized())
        {
            let option = new Object() as vscode.InputBoxOptions;
            option.prompt = "Enter update-set name";

            let updateSetPromise = vscode.window.showInputBox(option);
            updateSetPromise.then((res) =>
            {
                if (res !== undefined)
                {
                    vscode.window.showQuickPick(["Yes", "No"], {
                        placeHolder: "Choose Parent Update-Set"
                    }).then((item) =>
                    {
                        if (item === "Yes")
                        {
                            let updatesets = instance.GetUpdateSets();
                            updatesets.then((result) =>
                            {
                                vscode.window.showQuickPick(result).then((item) =>
                                {
                                    if (item)
                                    {
                                        let parent = item.sys_id;
                                        let p = instance.CreateUpdateSet(res, parent);

                                        if (p)
                                        {
                                            p.then((res) =>
                                            {
                                                vscode.window.showInformationMessage(`Update set: ${res.name} created`);
                                            }).catch((err) =>
                                            {
                                                vscode.window.showErrorMessage("Update-set not created");
                                            });
                                        }
                                    }
                                });
                            }).catch((er) =>
                            {
                                console.error(er);
                            });
                        } else
                        {
                            let p = instance.CreateUpdateSet(res, "");
                            if (p)
                            {
                                p.then((res) =>
                                {
                                    vscode.window.showInformationMessage(`Update set: ${res.name} created`);
                                }).catch((err) =>
                                {
                                    vscode.window.showErrorMessage("Update-set not created");
                                });
                            }
                        }
                    });
                }
            });
        }
    });

    let createUpdateSetAndSetAsCurrent = vscode.commands.registerCommand("snsb.createUpdateSetAndSetAsCurrent", () =>
    {
        if (instance.IsInitialized())
        {
            let option = new Object() as vscode.InputBoxOptions;
            option.prompt = "Enter update-set name";

            let updateSetPromise = vscode.window.showInputBox(option);
            updateSetPromise.then((res) =>
            {
                if (res !== undefined)
                {
                    vscode.window.showQuickPick(["Yes", "No"], {
                        placeHolder: "Choose Parent Update-Set"
                    }).then((item) =>
                    {
                        if (item === "Yes")
                        {
                            let updatesets = instance.GetUpdateSets();
                            updatesets.then((result) =>
                            {
                                vscode.window.showQuickPick(result).then((item) =>
                                {
                                    if (item)
                                    {
                                        let parent = item.sys_id;
                                        let p = instance.CreateUpdateSet(res, parent);

                                        if (p)
                                        {
                                            p.then((res) =>
                                            {
                                                let set = instance.SetUpdateSet(res);

                                                if (set)
                                                {
                                                    set.then((us) =>
                                                    {
                                                        wsm.SetUpdateSet(us);
                                                        nm.SetNotificationUpdateSet(us);
                                                        let msg = `UpdateSet Created and set as current: ${us.name}`;
                                                        console.log(msg);
                                                        vscode.window.showInformationMessage(msg);
                                                    }).catch((er) =>
                                                    {
                                                        console.error(er);
                                                    });
                                                }
                                            }).catch((err) =>
                                            {
                                                vscode.window.showErrorMessage("Update-set not created");
                                            });
                                        }
                                    }
                                });
                            }).catch((er) =>
                            {
                                console.error(er);
                            });
                        } else
                        {
                            let p = instance.CreateUpdateSet(res, "");

                            if (p)
                            {
                                p.then((res) =>
                                {
                                    let set = instance.SetUpdateSet(res);

                                    if (set)
                                    {
                                        set.then((us) =>
                                        {
                                            wsm.SetUpdateSet(us);
                                            nm.SetNotificationUpdateSet(us);
                                            let msg = `UpdateSet Created and set as current: ${us.name}`;
                                            console.log(msg);
                                            vscode.window.showInformationMessage(msg);
                                        }).catch((er) =>
                                        {
                                            console.error(er);
                                        });
                                    }
                                }).catch((err) =>
                                {
                                    vscode.window.showErrorMessage("Update-set not created");
                                });
                            }
                        }
                    });
                }
            });
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
            }).catch((err) =>
            {
                vscode.window.showErrorMessage("Update set no longer in progress. Changes not saves to instance.");
            });
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

    let listeneronDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration((e) =>
    {
        config = vscode.workspace.getConfiguration("snsb");
    });

    context.subscriptions.push(openInPlatformRecord);
    context.subscriptions.push(openInPlatformList);
    context.subscriptions.push(setUpdateSet);
    context.subscriptions.push(connect);
    context.subscriptions.push(createRecord);
    context.subscriptions.push(createUpdateSet);
    context.subscriptions.push(createUpdateSetAndSetAsCurrent);
    context.subscriptions.push(clearWorkState);
    context.subscriptions.push(getInclude);
    context.subscriptions.push(getWidget);
    context.subscriptions.push(getTheme);
    context.subscriptions.push(getStyleSheet);
    context.subscriptions.push(getUiScript);
    context.subscriptions.push(getMailScript);
    context.subscriptions.push(getScriptedApiResource);
    context.subscriptions.push(getHeadersAndFooters);
    context.subscriptions.push(getScriptAction);
    context.subscriptions.push(getProcessor);
    context.subscriptions.push(getAngularProvider);
    context.subscriptions.push(listenerOnDidSave);
    context.subscriptions.push(listenerOnDidOpen);
    context.subscriptions.push(listeneronDidChangeConfiguration);
    context.subscriptions.push(openInPlatformRecord);
    context.subscriptions.push(openInPlatformList);
    context.subscriptions.push(rebuildCache);
    context.subscriptions.push(saveRecord);
    context.subscriptions.push(updateRecord);
}
// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext)
{
}