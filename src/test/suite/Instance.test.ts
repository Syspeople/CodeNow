import * as assert from 'assert';
import { Instance } from '../../ServiceNow/all';
import { workspace, WorkspaceConfiguration, env, extensions } from "vscode";
import { WorkspaceManager, WorkspaceStateManager, StatusBarManager } from '../../Manager/all';

// Defines a Mocha test suite to group tests of similar kind together
suite("Instance Tests", function ()
{
    let extension = extensions.getExtension("ambsoerensen.cn");

    const nm = new StatusBarManager();
    const wsm = new WorkspaceStateManager({
        extensionPath: extension.extensionPath,

    });
    const wm = new WorkspaceManager(wsm);

    let config: WorkspaceConfiguration;
    let instance: Instance;

    test("Instantiates", () =>
    {
        assert.doesNotThrow(() =>
        {
            config = workspace.getConfiguration("cn");
            instance = new Instance(config);
        });
    });

    test("instance Initializes", () =>
    {
        instance.Initialize(i, u, p, wsm, nm);
    });
});