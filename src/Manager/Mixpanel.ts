import * as vscode from 'vscode';
import * as mp from 'mixpanel';

export class Mixpanel
{
    constructor(token: string)
    {
        this.mixpanel = mp.init(token, {
            protocol: 'https'
        });

        this.distinct_id = vscode.env.machineId;
        this.language = vscode.env.language;
        this.session = vscode.env.sessionId;
    }

    isDev: boolean = false;
    mixpanel: mp.Mixpanel;
    distinct_id: string;
    language: string;
    session: string;

    /**
     * Send event to mixpanel. Using this function ensures mandatory properties get attached to the event.
     * 
     * Adds distinct id, vs env language, and vs env sessionid to all events.
     * 
     * @param name name of the event
     * @param properties custom properties to attach to an event.
     */
    track(name: string, properties: any = {}): void
    {
        properties.distinct_id = this.distinct_id;
        properties.language = this.language;
        properties.session = this.session;
        this.mixpanel.track(name, properties);
    }

}