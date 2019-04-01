# Snippets
Snippest are code fragments that can be imported, the following can be used: 

- [ServiceNow Specific Snippets](#servicenow-specific-snippets)
  - [General Queries](#general-queries)
  - [Query Single](#QUERY-SINGLE)
  - [Insert](#insert)
  - [Update](#update)
  - [Service now Alerts Client/Server](#Servicenow-Alerts-Client/Server)
  - [ServiceNow Glide User Object SERVER (Service Now Objects)](#ServiceNow-Glide-User-Object-SERVER-(Service-Now-Objects))
  - [ServiceNow Glide User Object CLIENT (Service Now Objects)](#ServiceNow-Glide-User-Object-CLIENT-(Service-Now-Objects))
  - [ServiceNow-Glide-Form-Object-CLIENT](#ServiceNow-Glide-Form-Object-CLIENT)
- [Bootstrap 3 - Snippets](#Bootstrap-3---Snippets)
  - [Alerts](#alerts)
  - [Badges](#Badges)
  - [Breadcrumbs](#Breadcrumbs)
  - [Buttons](#buttons)
    - [Buttons: Block](#Buttons:-Block)
    - [Buttons: Block Link](#Buttons:-Block-Link)
    - [Buttons: Extra Small](#Buttons:-Extra-Small)
    - [Buttons: Extra Small Link](#Buttons:-Extra-Small-Link)
    - [Buttons: Small](#Buttons:-Small)
    - [Buttons: Small Link](#Buttons:-Small-Link)
    - [Buttons: Large](#Buttons:-Large)
    - [Buttons: Large Link](#Buttons:-Large-Link)
    - [Buttons: Link](#Buttons:-Link)
    - [Buttons: Groups & Toolbar](#Buttons:-Groups-&-Toolbar)
  - [Carousel](#Carousel)
  - [CDN Links](#CDN-Links)
  - [Clearfix](#Clearfix)
  - [Forms](#Forms)
  - [Form Inputs (Fields) & Select](#Form-Inputs-(Fields)-&-Select)
  - [Form Input Groups](#Form-Input-Groups)
  - [Grid: Container, Columns, Row](#Grid:-Container,-Columns,-Row)
  - [Icons](#Icons)
  - [Images](#Images)
  - [Jumbotron](#Jumbotron)
  - [Labels](#Labels)
  - [List Groups](#List-Groups)
  - [Local](#Local)
  - [Media Objects](#media-objects)
  - [Modal](#Modal)
  - [Navigation](#Navigation)
  - [Page Header](#Page-Header)
  - [Pagination](#Pagination)
  - [Panels](#Panels)
  - [Progress Bars](#Progress-Bars)
  - [Tables](#Tables)
  - [Tabs](#Tabs)
  - [Templates](#Templates)
  - [Wells](#Wells)


    


## ServiceNow Specific Snippets


### General Queries
| Command  | Description |
| ------------- | ------------- |
`sn_query`      | A standard GlideRecord query follows this format. Can also be used in Client scripts and UI policies
| `sn_query_with_Or_condition`  | Basic query with chained or condition to filter results |
| `sn_query_with_encoded`  | Basic query with encoded filters  |
| `sn_query_aggregate`  | Query aggregate data. ( Count, SUM, MIN, MAX, AVG )  |
|`sn_query_orderBy` | Query with order by|
| `sn_query_(not)null`  | Query to find where a field is null or not null  |
| `sn_query_rowcount_serverscript`  | Query to find the row count on a server side script  |
| `sn_query_rowcount_clientscript`  | Query to find the row count on a client side script |
| `sn_query_with_resultLimit`  |  "Specify a limit for the result count. |
| `sn_query_with_resultLimit_chooseWindow`  |  The chooseWindow(first,last) method lets you set the first and last row number that you want to retrieve and is typical for chunking-type operations. The rows for any given query result are numbered 0..(n-1), where there are n rows. The first parameter is the row number of the first result you’ll get. The second parameter is the number of the row after the last row to be returned. In the example below, the parameters (10, 20) will cause 10 rows to be returned: rows 10..19, inclusive. |


### QUERY SINGLE
| Command  | Description |
| ------------- | ------------- |
| `sn_query_single`  | Get a specfic record  |
| `sn_query_single_by_field/val`  | Get the first record matching the field value pair  |
| `sn_query_single_ref_record`  | Get the first record matching the field value pair.  |
| `sn_delete`  | How to delete a records.   |
| `sn_delete_ALL`  | How to delete all the records in a result set.  |


### INSERT
| Command  | Description |
| ------------- | ------------- |
| `sn_insert`  |  How to insert a new record |


### UPDATE
| Command  | Description |
| ------------- | ------------- |
| `sn_update`  |  How to update a record. |
| `sn_update_setWorkflow`  |  `setWorkflow` is used to enable/disable the running of any business rules that may be triggered by a particular update. |
| `sn_update_autoSysFields`  | `autoSysFields` is used to disable the update of ‘sys’ fields (Updated, Created, etc.) for a particular update. This really is only used in special situations. The primary example is when you need to perform a mass update of records to true up some of the data but want to retain the original update timestamps, etc.  |
| `sn_update_setForceUpdate`  |  `setForceUpdate` is used to update records without having to change a value on that record to get the update to execute. |

### ServiceNow Operators
| Command  | Description |
| ------------- | ------------- |
| `sn_addquery_startswith`  | Filter results that start with specified value.  |
| `sn_addquery_endswith`  | Filter results that end with specified value.  |
| `sn_addquery_contains`  | Filter results that contains specified value.  |
| `sn_addquery_does_not_contain`  | Filter results that does not contain specified value.  |
| `sn_addquery_in`  | Field must contain the value supplied anywhere in the string provided.  |



### ServiceNow Alerts Client/Server
| Command  | Description |
| ------------- | ------------- |
| `sn_alert_server_belowField`  | Business rule and other general use. Alert below field.  |
| `sn_alert_server_topscreen`  |  Business rule and other general use. Alert top screen. |
| `sn_alert_server_write_to_textlog`  | Business rule and other general use. Write to text log. |
| `sn_alert_server_log`  |  Business rule and other general use. Will write to the database and the log file. Too much of this can adversely affect performance |
| `sn_alert_client_popup`  |  Client Script - Will pop up a window with message and an 'OK' button. |
| `sn_alert_client_confirm`  | Client Script - Will pop up a window with message and a 'Ok' and 'Cancel' buttons.  |
| `sn_alert_client_errorNextToField`  | Client Script - Will put an error message below the specified field.   |
| `sn_alert_client_hide_errorNextToField`  | Client Script - Will hide error message next the specified field  |

### ServiceNow Glide User Object SERVER (Service Now Objects)
| Command  | Description |
| ------------- | ------------- |
| `sn_user_server_get_UserByID`  |  Returns a reference to the user object for the user ID (or sys_id) provided. |
| `sn_user_server_getCurrent_User`  | Returns a reference to the user object for the currently logged-in user  |
| `sn_user_server_getCurrent_UserName`  | Returns the User ID (user_name) for the currently logged-in user.e.g. `employee`  |
| `sn_user_server_getCurrent_DisplayName`  | Returns the display value for the currently logged-in user.e.g. `Joe Employe`  |
| `sn_user_server_getCurrent_ID`  | Returns the sys_id string value for the currently logged-in user. |
| `sn_user_server_getCurrent_FName`  | Returns the first name of the currently logged-in user.  |
| `sn_user_server_getCurrent_LName`  | Returns the last name of the currently logged-in user.  |
| `sn_user_server_getCurrent_Email`  | Returns the email of the currently logged-in user.  |
| `sn_user_server_getCurrent_departmentID`  | Returns the department id of the currently logged-in user.  |
| `sn_user_server_getCurrent_companyID`  |  Returns the company GlideRecord of the currently logged-in user. |
| `sn_user_server_getCurrent_listOfGroups`  |  Returns a list of all groups that the currently logged-in user is a member of. |
| `sn_user_server_getCurrent_isMemberOF`  |  Returns true if the user is a member of the given group, false otherwise. |


### ServiceNow Glide User Object CLIENT (Service Now Objects)
| Command  | Description |
| ------------- | ------------- |
| `sn_user_client_getCurrent_userName`  |  User name of the current user e.g. employee |
| `sn_user_client_getCurrent_FName`  |  First name of the current user e.g. Joe |
| `sn_user_client_getCurrent_LName`  |Last name of the current user e.g. Employee  |
| `sn_user_client_getCurrent_userID`  | sys_id of the current user e.g. 681ccaf9c0a8016400b98a06818d57c7  |
| `sn_user_client_getCurrent_hasRole`  |  True if the current user has the exact role specified, false otherwise, regardless of 'admin' role. Usage: g_user.hasRoleExactly('itil') |
| `sn_user_client_getCurrent_hasRoles`  |  True if the current user has at least one role specified, false otherwise. |


### ServiceNow Glide Form Object CLIENT
| Command  | Description |
| ------------- | ------------- |
| `sn_form_addDecoration`  | Adds an icon on a field’s label.  |
| `sn_form_flashColor`  |  Flashes the specified color the specified number of times. Used to draw attention to a particular field. |
| `sn_form_getLabelOf`  |  Gets the plain text value of the field label. |
| `sn_form_setVisibility`  | Toggles visiblity of a field in a form. |
| `sn_form_getFieldValue`  | Gets the value of a field on a form. |
| `sn_form_setFieldValue`  | Sets the value of a field on a form.|
| `sn_form_setMandatory`  |  Sets the Mandatory of a field on a form. |
| `sn_form_getMandatory`  |  Gets bool if field is mandatory.|
| `sn_form_clearField`  | Clears the value of a field  |
| `sn_form_setDisabled`  |  Enable/Disable a field. |
| `sn_form_setReadOnly`  |  Toggle read only on a field. Best Practice: Use UI Policy rather than this method whenever possible. |
| `sn_form_getIsNew`  |  Tells if this is a new record. |
| `sn_form_saveNstay`  | Saves the record and stays  |
| `sn_form_submit_gotoprevious`  | Submits and returns user to previous screen.  |


## Bootstrap 3 - Snippets

### Alerts

Trigger | Description
--- | ---
bs3-alert | Alert Box (Default)
bs3-alert:danger | Danger Alert Box
bs3-alert:info | Info Alert Box
bs3-alert:success | Success Alert Box
bs3-alert:warning | Warning Alert Box

### Badges

Trigger | Description
--- | ---
bs3-badge | Badge (Default)

### Breadcrumbs

Trigger | Description
--- | ---
bs3-breadcrumbs | Breadcrumbs

### Buttons

Trigger | Description
--- | ---
bs3-button | Button
bs3-button:default | Default Button
bs3-button:danger | Danger Button
bs3-button:disabled | Disabled Button
bs3-button:info | Info Button
bs3-button:primary | Primary Button
bs3-button:success | Success Button
bs3-button:warning | Warning Button

### Buttons: Block

Trigger | Description
--- | ---
bs3-block-button | Block Button
bs3-block-button:default | Default Block Button
bs3-block-button:danger | Danger Block Button
bs3-block-button:disabled | Disabled Block Button
bs3-block-button:info | Info Block Button
bs3-block-button:primary | Primary Block Button
bs3-block-button:success | Success Block Button
bs3-block-button:warning | Warning Block Button

### Buttons: Block Link

Trigger | Description
--- | ---
bs3-block-link-button | Block Link Button
bs3-block-link-button:default | Default Block Link Button
bs3-block-link-button:danger | Danger Block Link Button
bs3-block-link-button:disabled | Disabled Block Link Button
bs3-block-link-button:info | Info Block Link Button
bs3-block-link-button:primary | Primary Block Link Button
bs3-block-link-button:success | Success Block Link Button
bs3-block-link-button:warning | Warning Block Link Button

### Buttons: Extra Small

Trigger | Description
--- | ---
bs3-xs-button | Extra Small Button
bs3-xs-button:default | Extra Small Default Button
bs3-xs-button:danger | Extra Small Danger Button
bs3-xs-button:disabled | Extra Small Disabled Button
bs3-xs-button:info | Extra Small Info Button
bs3-xs-button:primary | Extra Small Primary Button
bs3-xs-button:success | Extra Small Success Button
bs3-xs-button:warning | Extra Small Warning Button

### Buttons: Extra Small Link

Trigger | Description
--- | ---
bs3-xs-link-button | Extra Small Link Button
bs3-xs-link-button:default | Default Extra Small Link Button
bs3-xs-link-button:danger | Danger Extra Small Link Button
bs3-xs-link-button:disabled | Disabled Extra Small Link Button
bs3-xs-link-button:info | Info Extra Small Link Button
bs3-xs-link-button:primary | Primary Extra Small Link Button
bs3-xs-link-button:success | Success Extra Small Link Button
bs3-xs-link-button:warning | Warning Extra Small Link Button

### Buttons: Small

Trigger | Description
--- | ---
bs3-sm-button | Small Button
bs3-sm-button:default | Small Default Button
bs3-sm-button:danger | Small Danger Button
bs3-sm-button:disabled | Small Disabled Button
bs3-sm-button:info | Small Info Button
bs3-sm-button:primary | Small Primary Button
bs3-sm-button:success | Small Success Button
bs3-sm-button:warning | Small Warning Button

### Buttons: Small Link

Trigger | Description
--- | ---
bs3-sm-link-button | Small Link Button
bs3-sm-link-button:default | Default Small Link Button
bs3-sm-link-button:danger | Danger Small Link Button
bs3-sm-link-button:disabled | Disabled Small Link Button
bs3-sm-link-button:info | Info Small Link Button
bs3-sm-link-button:primary | Primary Small Link Button
bs3-sm-link-button:success | Success Small Link Button
bs3-sm-link-button:warning | Warning Small Link Button

### Buttons: Large

Trigger | Description
--- | ---
bs3-lg-button | Large Button
bs3-lg-button:default | Large Default Button
bs3-lg-button:danger | Large Danger Button
bs3-lg-button:disabled | Large Disabled Button
bs3-lg-button:info | Large Info Button
bs3-lg-button:primary | Large Primary Button
bs3-lg-button:success | Large Success Button
bs3-lg-button:warning | Large Warning Button

### Buttons: Large Link

Trigger | Description
--- | ---
bs3-lg-link-button | Large Link Button
bs3-lg-link-button:default | Default Large Link Button
bs3-lg-link-button:danger | Danger Large Link Button
bs3-lg-link-button:disabled | Disabled Large Link Button
bs3-lg-link-button:info | Info Large Link Button
bs3-lg-link-button:primary | Primary Large Link Button
bs3-lg-link-button:success | Success Large Link Button
bs3-lg-link-button:warning | Warning Large Link Button

### Buttons: Link

Trigger | Description
--- | ---
bs3-link-button | Link Button
bs3-link-button:default | Default Link Button
bs3-link-button:danger | Danger Link Button
bs3-link-button:disabled | Disabled Link Button
bs3-link-button:info | Info Link Button
bs3-link-button:primary | Primary Link Button
bs3-link-button:success | Success Link Button
bs3-link-button:warning | Warning Link Button

### Buttons: Groups & Toolbar

Trigger | Description
--- | ---
bs3-group | Button Group
bs3-group:vertical | Vertical Button Group
bs3-link-group | Link Button Group
bs3-link-group:vertical | Vertical Link Button Group
bs3-toolbar | Toolbar for Button Groups

### Carousel

Trigger | Description
--- | ---
bs3-carousel | Carousel

### CDN Links

Trigger | Description
--- | ---
bs3-cdn | CDN Hosted Bootstrap Link: CSS & JS
bs3-cdn:css | CDN Hosted Bootstrap Link: CSS Only
bs3-cdn:js | CDN Hosted Bootstrap Link: JS Only

### Clearfix

Trigger | Description
--- | ---
bs3-clearfix | Clearfix

### Forms

Trigger | Description
--- | ---
bs3-form | Form
bs3-form:horizontal | Horizontal Form
bs3-form:inline | Inline Form

### Form Inputs (Fields) & Select

Trigger | Description
--- | ---
bs3-form:label | Form Input Label
bs3-input:hidden | Hidden Input
bs3-input:checkbox | Checkbox
bs3-input:color | Color Input
bs3-input:color:h | Color Input (Horizontal)
bs3-input:date | Date Input
bs3-input:date:h | Date Input (Horizontal)
bs3-input:email | Email Input
bs3-input:email:h | Email Input (Horizontal)
bs3-input:label | Input Label
bs3-input:month | Month Input
bs3-input:month:h | Month Input (Horizontal)
bs3-input:number | Number Input
bs3-input:number:h | Number Input (Horizontal)
bs3-input:password | Password Input
bs3-input:password:h | Password Input (Horizontal)
bs3-input:radio | Radio Input
bs3-input:range | Range Input
bs3-input:range:h | Range Input (Horizontal)
bs3-input:reset | Reset Input
bs3-input:reset:h | Reset Input (Horizontal)
bs3-input:search | Search Input
bs3-input:search:h | Search Input (Horizontal)
bs3-input:select | Select Input
bs3-input:select:h | Select Input (Horizontal)
bs3-input:submit | Submit Button
bs3-input:tel | Telephone Input
bs3-input:tel:h | Telephone Input (Horizontal)
bs3-input:text | Text Input
bs3-input:text:h | Text Input (Horizontal)
bs3-input:time | Time Input
bs3-input:time:h | Time Input (Horizontal)
bs3-input:url | URL Input
bs3-input:url:h | URL Input (Horizontal)
bs3-input:week | Week Input
bs3-input:week:h | Week Input (Horizontal)
bs3-select | Select
bs3-select:h | Select (Horizontal)
bs3-textarea | Textarea
bs3-textarea:h | Textarea (Horizontal)

### Form Input Groups

Trigger | Description
--- | ---
bs3-input-group | Input Group
bs3-input-group-addon | Input Group (addon)
bs3-input-group:addon:text | Input Group (addon & text-field)
bs3-input-group-btn | Input Group (button)
bs3-input-group:text:btn | Input Group (text-field & btn)


### Grid: Container, Columns, Row

Trigger | Description
--- | ---
bs3-container | Container
bs3-col | Column (no number specified)
bs3-col:1 | 1 Column
bs3-col:2 | 2 Columns
bs3-col:3 | 3 Columns
bs3-col:4 | 4 Columns
bs3-col:5 | 5 Columns
bs3-col:6 | 6 Columns
bs3-col:7 | 7 Columns
bs3-col:8 | 8 Columns
bs3-col:9 | 9 Columns
bs3-col:10 | 10 Columns
bs3-col:11 | 11 Columns
bs3-col:12 | 12 Columns
bs3-row | Row
bs3-row-col | Row & Column (no number specified)

### Icons

Trigger | Description
--- | ---
bs3-icon | Icon
bs3-icon:glyphicon | Glyphicon

### Images

Trigger | Description
--- | ---
bs3-image | Responsive Image
bs3-thumbnail | Thumbnail
bs3-thumbnail:content | Thumbnail (with Content)

### Jumbotron

Trigger | Description
--- | ---
bs3-jumbotron | Jumbotron

### Labels

Trigger | Description
--- | ---
bs3-label | Label
bs3-label:danger | Danger Label
bs3-label:default | Default Label
bs3-label:info | Info Label
bs3-label:success | Success Label
bs3-label:warning | Warning Label

### List Groups

Trigger | Description
--- | ---
bs3-list-group | List Group
bs3-list-group:badges | List Group (with Badges)
bs3-list-group:linked | List Group (with Linked List)
bs3-list-group:content | List Group (with Content)

### Local

Trigger | Description
--- | ---
bs3-local | Local Bootstrap Link

### Media Objects

Trigger | Description
--- | ---
bs3-media-object | Media Object

### Modal

Trigger | Description
--- | ---
bs3-modal | Modal

### Navigation

Trigger | Description
--- | ---
bs3-navbar | Navbar
bs3-navbar:basic | Navbar (Basic)
bs3-navbar:brand | Navbar Brand Element
bs3-navbar:button | Navbar Button
bs3-navbar:form | Navbar Form
bs3-navbar:link | Navbar Link
bs3-navbar:links | Navbar Links
bs3-navbar:text | Navbar Text
bs3-navbar:fixed-bottom | Navbar Fixed-Bottom
bs3-navbar:fixed-top | Navbar Fixed-Top
bs3-navbar:inverse | Navbar Inverse
bs3-navbar:responsive | Navbar Responsive
bs3-navbar:static-top | Navbar Static-Top

### Page Header

Trigger | Description
--- | ---
bs3-page-header | Page Header

### Pagination

Trigger | Description
--- | ---
bs3-pager | Pager
bs3-pager:aligned | Aligned Pager
bs3-pagination | Pagination
bs3-pagination:sm | Pagination (Small)
bs3-pagination:lg | Pagination (Large)

### Panels

Trigger | Description
--- | ---
bs3-panel | Panel
bs3-panel:heading | Panel (with Heading)
bs3-panel:footer | Panel (with Footer)
bs3-panel:table | Panel (with Table)
bs3-panel:danger | Panel (Danger)
bs3-panel:info | Panel (Info)
bs3-panel:primary | Panel (Primary)
bs3-panel:success | Panel (Success)
bs3-panel:warning | Panel (Warning)

### Progress Bars

Trigger | Description
--- | ---
bs3-progress | Progress Bar
bs3-progress-striped | Striped Progress Bar
bs3-progress:label | Progress Bar with Label
bs3-progress-striped:label | Striped Progress Bar with Label
bs3-progress:success | Progress Bar (Success)
bs3-progress-striped:success | Striped Progress Bar (Success)
bs3-progress:info | Progress Bar (Info)
bs3-progress-striped:info | Striped Progress Bar (Info)
bs3-progress:warning | Progress Bar (Warning)
bs3-progress-striped:warning | Striped Progress Bar (Warning)
bs3-progress:danger | Progress Bar (Danger)
bs3-progress-striped:danger | Striped Progress Bar (Danger)

### Tables

Trigger | Description
--- | ---
bs3-table | Table
bs3-table:bordered | Bordered Table
bs3-table:condensed | Condensed Table
bs3-table:hover | Hover Table
bs3-table:responsive | Responsive Table
bs3-table:striped | Striped Table

### Tabs

Trigger | Description
--- | ---
bs3-tabs | Tabs
	
### Templates

Trigger | Description
--- | ---
bs3-template:html5 | HTML5 Template Layout

### Wells

Trigger | Description
--- | ---
bs3-well | Well
bs3-well:sm | Small Well
bs3-well:lg | Large Well