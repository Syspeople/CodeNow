# SNSB Contribution Guide
This guide will provide an overview of the steps needed to make a contribution to the extension.

## Step 1
Add Record Interface to the *ServiceNow* folder.

## Step 2
Add the export of the record interface to **all.ts** in the *ServiceNow* folder.

```javascript
export * from './ISysMailScript';
```

## Step 3
Add Record that implements the interface to the *ServiceNow* folder

## Step 4
Add the export of the implemented record class to **all.ts** in the *ServiceNow* folder.

```javascript
export * from './MailScript';
```

## Step 5
Add the class(record) to the **Api.ts** file in the *Api* folder.

Create private variable: 

```javascript
private _SNSysEmailScript: string = `${this._SNTableSuffix}/sys_script_email`;
```

The following functions need the class: 

- GetRecord
- Patch record

And the add function to return all records:

```javascript
    public GetEmailScripts(): Axios.AxiosPromise<IServiceNowResponse<Array<ISysMailScript>>> | undefined
    {
        if (this.HttpClient)
        {
            //update sets in global and in progress
            let url = `${this._SNSysEmailScript}?sys_policy=""`;
            return this.HttpClient.get(url);
        }
    }
```
## Step 6

Add the record to the **WorkspaceManager.ts** file in the *Manager* folder.

The class should be added to the functions: 

- GetRecord
- createMetadata

## Step 7
Add the records to the **StateKeys.ts** in *Manager* folder.
## Step 8
Add getters and setters in **WorkspaceStateManager.ts** in *Manager* folder.

```javascript
    public SetMailScript(ms: Array<MailScript>): void
    {
        this._memCache.Set(StateKeys.MailScripts, ms);
    }

    public GetMailScript(): Array<MailScript> | undefined
    {
        return this._memCache.Get<Array<MailScript>>((StateKeys.MailScripts));
    }
```
## Step 9
Add record to in **Instance.ts** in *ServiceNow* folder.
-	SaveRecord 
-	Get Record

Add Get function for record 

Add Get Upstream function

Add record to cache.

## Step 10
Add command to **package.json.**

## Step 11
Add getter in **extension.ts**