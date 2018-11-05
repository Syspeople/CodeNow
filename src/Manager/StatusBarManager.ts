import { StatusBarItem, window, StatusBarAlignment } from "vscode";
import { UpdateSet } from "../ServiceNow/all";

export class StatusBarManager
{

    /**
     * Manage status bar notifications. 
     */
    constructor()
    {
        this.state = window.createStatusBarItem(StatusBarAlignment.Left, -500);
        this.SetNotificationState(NotifationState.NotConnected);
        this.updateSet = window.createStatusBarItem(StatusBarAlignment.Left, -501);
        this.updateSet.command = "snsb.setUpdateset";
    }

    private state: StatusBarItem;
    private updateSet: StatusBarItem;


    /**
     * SetNotificationUpdateSet
     */
    public SetNotificationUpdateSet(us: UpdateSet)
    {
        this.updateSet.text = us.name;
        this.updateSet.tooltip = "Change Update Set";
        this.updateSet.show();
    }

    /**
     * SetNotificationState
     */
    public SetNotificationState(state: NotifationState): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            switch (state)
            {
                case NotifationState.NotConnected:
                    this.state.text = `$(stop)`;
                    this.state.tooltip = "Not Connected to ServiceNow";
                    this.state.command = "snsb.connect";
                    break;
                case NotifationState.Downloading:
                    this.state.text = `$(cloud-download)`;
                    this.state.tooltip = "Caching Ressources";
                    break;
                case NotifationState.Connected:
                    this.state.text = `$(globe)`;
                    this.state.tooltip = "Connected to ServiceNow";
                    window.showInformationMessage("Connected");
                    break;
                default:
                    reject("failed to set state");
                    break;
            }
            this.state.show();
            resolve();
        });
    }
}

export enum NotifationState
{
    NotConnected,
    Connected,
    Downloading
}