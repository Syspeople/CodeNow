# SNSB
ServiceNow Scripting Bridge.
the Vs Code Extension extension that allows you to develop against the ServiceNow platform.

No ServiceNow configuration required.

NB: Only Basic auth is currently available. 

# Features
* Work with multiple ServicNow entities.
* Automatically saves to your instance.
* Automatically updates from your instance.
* Intellisense for ServiceNow Class.
* Change update Set.

# How to
Add screenshots and stuff. 

# Try it
the only way to currently try the extension is to compile from the source.

You need to have [Node.js](https://nodejs.org/en/) installed.

1. Clone and open repository
2. rebuild module dependencies using command "npm install" (make sure you are located in the workspace root)
3. start debugger
4. when debugging open a workspace
5. invoke command: Connect to ServiceNow

# Additional Extensions
Extensions that go very well with this extension

* [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) - for proper css intellisense i HTML. 


## Supported Records
Records types currently supported. 

* Script includes.
* Service Portal Themes.
* Service Portal widgets.

## Intellisense
Currently there is intellisense for the following API's.

### Server API's

* GlideRecord
* GlideSystem (gs)
* GlideSPScriptable ($sp)

### Client API's


## Available commands
### Connect to ServiceNow
prompts for url, username and password.

if the workspace is already associated with a ServiceNow instance only the password is required.

**NB: only Basic auth is supported**

### Change Update Set
Choose an active UpdateSet and set is as your working update set. Only in progress update sets in the global scope is available. 

**IMPORTANT** Update set changes do not apply to active sessions. Be sure to validate your update set in your browser if working in UI and in VsCode at the same time.
The extension will automatically use the previusly selected update set. if it has been closed default i selected. 


### Add Script Include To Workspace
Imports a script include into the workspace for edit.

Read only and restricted script includes is not available.

### Add Widget to Workspace
imports a widget into the the workspace.

Read only and restricted widgets is not available.

### Add Theme to Workspace
imports a theme into the workspace

Read only and restricted themes is not available.

### Open Record in platform
Right click a record to open it in the platform. 

### Open list in platform
Right click a record to open the associated list.



### Clear Instance
clear workspace data. eg. cached records, urls, username.

make sure to reconnect to service and refresh records or reload vscode.

### Refresh Records
Reloads caches records from you instance.

if you missing a script in the list when trying to load one use this command to retreive all from instance.

## Options
### uploadOnSave
Enable or disable automatic upload on save. 

default: true

### addOnOpen
Enable or disable automatic import on document open if newer exists.

default: true