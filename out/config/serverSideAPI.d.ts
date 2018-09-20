
declare class GlideRecord
{
    /**Creates an instance of the GlideRecord class for the specified table. */
    constructor(tableName: string);
    /**
     * Adds a filter to return active records.
     */
    addActiveQuery(): GlideQueryCondition;
    /**
     * Adds an encoded query to other queries that may have been set.
    */
    addEncodedQuery(query: string): void;
    /**Adds a filter to return records based on a relationship in a related table. */
    addJoinQuery(joinTable: string, primaryField: object, joinTableField: object): GlideQueryCondition
    /**A filter that specifies records where the value of the field passed in the parameter is not null. */
    addNotNullQuery(fieldName: string): GlideQueryCondition;
    /**Adds a filter to return records where the value of the specified field is null. */
    addNullQuery(fieldName: string): GlideQueryCondition;
    /**Provides the ability to build a request, which when executed, returns the rows from the specified table, that match the request. */
    addQuery(fieldName: string, operator: string, value: object): GlideQueryCondition;
    /**Provides the ability to build a request, which when executed, returns the rows from the specified table, that match the request. */
    addQuery(fieldName: string, value: object): GlideQueryCondition;
    /**Provides the ability to build a request, which when executed, returns the rows from the specified table, that match the request. */
    addQuery(fieldName: string): GlideQueryCondition;
    /**Determines if the Access Control Rules, which include the user's roles, permit inserting new records in this table. */
    canCreate(): boolean;
    /**Determines if the Access Control Rules, which include the user's roles, permit deleting records in this table. */
    canDelete(): boolean;
    /**Determines if the Access Control Rules, which include the user's roles, permit reading records in this table. */
    canRead(): boolean;
    /**Determines if the Access Control Rules, which include the user's roles, permit editing records in this table. */
    canWrite(): boolean;
    /**Determines if the Access Control Rules, which include the user's roles, permit editing records in this table. */
    chooseWindow(firstRow: number, lastRow: number, forceCount: boolean): void;
    /**Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT for a duration field.
     * Does not require the creation of a GlideDateTime object because the duration field is already a GlideDateTime object. */
    dateNumericValue(): number;
    /**Deletes multiple records that satisfy the query condition.
     * This method does not delete attachments. */
    deleteMultiple(): void;
    /**Deletes the current record. */
    deleteRecord(): void;
    /**Defines a GlideRecord based on the specified expression of 'name = value'.
     * This method is expected to be used to query for single records, so a 'next' operation on the recordset is performed by this method before returning. */
    get(name: object, value: object): boolean;
    /**Returns the dictionary attributes for the specified field. */
    getAttribute(fieldName: string): boolean;
    /**Returns the table's label. */
    getClassDisplayValue(): string;
    /**Returns the element's descriptor. */
    getED(): GlideElementDescriptor;
    /**Retrieves the GlideElement object for the specified field. */
    getElement(columnName: string): GlideElement;
    /**Retrieves the query condition of the current result set as an encoded query string. */
    getEncodedQuery(): string;
    /**Returns the field's label.*/
    getLabel(): string;
    /**Retrieves the last error message. If there is no last error message, null is returned. */
    getLastErrorMessage(): string;
    /**Retrieves a link to the current record. */
    getLink(noStack: boolean): string;
    /**Retrieves the class name for the current record. */
    getRecordClassName(): string;
    /**Retrieves the number of rows in the query result. */
    getRowCount(): number;
    /**Retrieves the name of the table associated with the GlideRecord. */
    getTableName(): string;
    /**Gets the primary key of the record, which is usually the sys_id unless otherwise specified. */
    getUniqueValue(): string;
    /**Retrieves the string value of an underlying element in a field. */
    getValue(name: string): string;
    /**Determines if there are any more records in the GlideRecord object. */
    hasNext(): boolean;
    /**Creates an empty record suitable for population before an insert. */
    initialize(): void;
    /**Inserts a new record using the field values that have been set for the current record.
     */
    insert(): string
    /**Checks to see if the current database action is to be aborted.*/
    isActionAborted(): boolean;
    /**Checks if the current record is a new record that has not yet been inserted into the database. */
    isNewRecord(): boolean;
    /**Determines if the table exists. */
    isValid(): boolean;
    /**Determines if the specified field is defined in the current table. */
    isValidField(columnName: string): boolean;
    /**Determines if current record is a valid record. */
    isValidRecord(): boolean;
    /**Creates a new GlideRecord record, sets the default values for the fields, and assigns a unique ID to the record. */
    newRecord(): boolean;
    /**Moves to the next record in the GlideRecord object. */
    next(): boolean;
    /**Retrieves the current operation being performed, such as insert, update, or delete. */
    operation(): string;
    /**Specifies an orderBy column.
     * Call this method more than once to order by multiple columns. Results are arranged in ascending order, see orderByDesc(String name) to arrange records in descending order. */
    orderBy(name: string): void;
    /**Specifies a decending orderBy column. */
    orderByDesc(name: string): void;
    /**Runs the query against the table based on the filters specified by addQuery, addEncodedQuery, etc.
     * If name/value pair is specified, "name=value" condition is added to the query.
     */
    query(field?: object, value?: object): void;
    /**Sets a flag to indicate if the next database action (insert, update, delete) is to be aborted. This is often used in business rules.
     * Use in an onBefore business rule to prevent the database action from being done.
     * The business rule continues to run after setAbortAction() is called. Calling setAbortAction() does not stop subsequent business rules from executing.
     * Calling this method only prevents the database action from occurring. */
    setAbortAction(b: boolean): void;
    /**Sets the duration field to a number of milliseconds since January 1, 1970, 00:00:00 GMT for a duration field.
     * Does not require the creation of a GlideDateTime object because the duration field is already a GlideDateTime object. */
    setDateNumericValue(milliseconds: number): void;
    /**Sets the limit for number of records are fetched by the GlideRecord query. */
    setLimit(maxNumRecords: number): void;
    /**Sets sys_id value for the current record. */
    setNewGuidValue(guid: string): void;

    /**Sets the value of the field with the specified name to the specified value.
     * Normally the script does a gr.category = value. However, if the element name is itself a variable then gr.setValue(elementName, value) can be used.*/
    setValue(name: string, value: object): void;
    /**Enables or disables the running of business rules, script engines, and audit.
     * 
     * @param enable If true (default), enables business rules. If false, disables business rules.
     */
    setWorkflow(enable: boolean): void;
    /**Updates the GlideRecord with any changes that have been made. If the record does not already exist, it is inserted.
     * 
     * @param reason The reason for the update. The reason is displayed in the audit record.
     * @returns Unique ID of the new or updated record. Returns null if the update fails.
     */
    update(reason: string): string

    /**
     * Updates each GlideRecord in the list with any changes that have been made.
     * 
     * When changing field values, use **setValue()** instead of directly setting the field (field = something).
     * 
     * When using updateMultiple(), directly setting the field (gr. state = 4) results in all records in the table being updated instead of just the records returned by the query.
     * 
     * **Do not** use this method with the chooseWindow() or setLimit() methods when working with large tables.
     */
    updateMultiple(): void

    /**Provides the same functionality as next(), it is intended to be used in cases where the GlideRecord has a column named next. */
    _next(): boolean;

    /**Identical to query(). This method is intended to be used on tables where there is a column named query, which would interfere with using the query() method.*/
    _query(): void;
}

declare class GlideElement
{
    /** The Scoped GlideElement API provides a number of convenient script methods for dealing with fields and their values. Scoped GlideElement methods are available for the fields of the current GlideRecord.
     * **Not fully Documented**
     */
    constructor();
}

declare class GlideElementDescriptor
{
    /**
     * There is no constructor for this class.
     * Use the GlideElement getED() method to obtain a GlideElementDescriptor object.
     */
    constructor();
    /**Returns the encryption type used for attachments on the element's table. 
     * This method is for use with the Edge Encryption plugin. */
    getAttachmentEncryptionType(): string;
    /**Returns the element's encryption type.
     * This method is for use with the Edge Encryption plugin. */
    getEncryptionType(): string;
    /**Returns the element's internal data type. */
    getInternalType(): string;
    /**Returns the element's label.*/
    getLabel(): string;
    /**Returns the element's length. */
    getLength(): number;
    /**Returns the element's name. */
    getName(): string;
    /**Returns the element's plural label. */
    getPlural(): String
    /**Returns true if an encrypted attachment has been added to the table.
     * This method is for use with the Edge Encryption plugin. */
    hasAttachmentsEncrypted(): Boolean;
    /**Returns true if the element is an automatically generated or system field.
     * Automatically generated and system fields cannot be encrypted. This method is for use with the Edge Encryption plugin. */
    isAutoOrSysID(): boolean;
    /**Returns true if an element is encrypted.
     * This method is for use with the Edge Encryption plugin. */
    isEdgeEncrypted(): boolean;
    /**Returns true if the element is a virtual element.
     * A virtual element is a calculated field as set by the dictionary definition of the field. Virtual fields cannot be encrypted. */
    isVirtual(): boolean;

}

declare class GlideQueryCondition
{
    /**This class has no constructor.
     * A GlideQueryCondition object is returned by the following methods:
     * * addActiveQuery()
     * * addInactiveQuery()
     * * addJoinQuery()
     * * addNotNullQuery()
     * * addNullQuery()
     * * addQuery()
     */
    constructor();
    /**Adds an AND condition to the current condition. */
    addCondition(name: string, operation: string, value: object): GlideQueryCondition;
    /**Appends a 2-or-3 parameter OR condition to an existing GlideQueryCondition. */
    addOrCondition(name: string, operation: string, value: object): GlideQueryCondition;
}

declare class GlideUser
{
    /**
     * Does not have Constructor. 
     * 
     * Retrieve GlideUser object with gs.getUser().
     */
    constructor();

    /**
     * Returns the current user's company sys_id.
     */
    getCompanyID(): string;

    /**
     * Returns the current user's display name.
     */
    getDisplayName(): string;

    /**
     * Returns the user's email address.
     */
    getEmail(): string;

    /**
     * Returns the user's first name.
     */
    getFirstName(): string;

    /**
     * Gets the sys_id of the current user.
     */
    getID(): string;

    /**
     * Returns the user's last name.
     */
    getLastName(): string;

    /**
     * Returns the user ID, or login name, of the current user.
     */
    getName(): string;

    /**
     * Gets the specified user preference value for the current user.
     * @param name The name of the preference.
     */
    getPreference(name: string): string;

    /**
     * Returns a list of roles that includes explicitly granted roles, inherited roles, and roles acquired by group membership.
     */
    getRoles(): Array<string>;

    /**
     * Returns the list of roles explicitly granted to the user.
     */
    getUserRoles(): Array<string>;

    /**
     * Determines if the current user has the specified role.
     * @param role Role to check
     */
    hasRole(role: string): boolean;

    /**
     * Determines if the current user is a member of the specified group.
     * @param group Group to check
     */
    isMemberOf(group: string): boolean;

    /**
     * Saves a user preference value to the database.
     * @param name The preference to save.
     * @param value The preference value.
     */
    savePreference(name: string, value: string): void;
}

declare class GlideSession
{
    /**
     * No constructor.
     * 
     * retrieve with gs.getSession()
     */
    constructor();

    /**
     * Returns a session client value previously set with putClientData().
     * 
     * This method is used in a client script to retrieve data values that were set by a server script that used the putClientData() method.
     * @param paramName Name of the client data to retrieve.
     */
    getClientData(paramName: string): string;

    /**
     * Sets a session client value that can be retrieved with getClientData(). This method is used in a server side script that runs when a form is created.
     * @param paramName Name of the client data to set.
     * @param paramValue Value of the client data.
     */
    putClientData(paramName: string, paramValue: string): void;

    /**
     * Returns the client IP address.
     */
    getClientIP(): string;

    /**
     * Returns the application currently selected in the application picker.
     * 
     * This method requires admin privileges.
     */
    getCurrentApplicationId(): string;

    /**
     * Returns the session's language code.
     */
    getLanguage(): string;

    /**
     * Returns the session token.
     */
    getSessionToken(): string;

    /**
     * Returns the name of the session's time zone.
     */
    getTimeZoneName(): string;

    /**
     * Returns the URL on the stack. Returns null if the stack is empty.
     */
    getUrlOnStack(): string;

    /**
     * Returns true if the user is impersonating another user.
     */
    isImpersonating(): boolean;

    /**
     * Returns true if the session is interactive.
     * An interactive session is one that involves an end-user interacting with a user interface that then retrieves information from a server. 
     */
    isInteractive(): boolean;

    /**
     * Returns true if the user is logged in.
     */
    isLoggedIn(): boolean;


}
declare var $sp: GlideSPScriptable;
declare class GlideSPScriptable
{
    /**
     * No constructor availble
     * 
     * use via global variable: $sp
     */
    constructor();

    /**
     * Returns true if the user can read the specified GlideRecord.
     * 
     * If the record type is kb_knowledge, sc_cat_item, or sc_category, the method checks if the user can view the item.
     * @param gr The GlideRecord to check.
     */
    canReadRecord(gr: GlideRecord): boolean;

    /**
     * Returns true if the user can read the specified GlideRecord.
     * 
     * If the record type is kb_knowledge, sc_cat_item, or sc_category, the method checks if the user can view the item.
     * @param table Name of the table to query.
     * @param sysId Sys_id of the record to query.
     */
    canReadRecord(table: string, sysId: string): boolean;

    /**
     * Returns a model and view model for a sc_cat_item or sc_cat_item_guide.
     * 
     * This method is a quick way to get the data necessary to render and order a catalog item using <sp-model />. If you just need to get a catalog item to show its picture or name, use GlideRecord to query the sc_cat_item table.
     * @param sysId The sys_id of the catalog item (sc_cat_item) or order guide (sc_cat_item_guide).
     * @param isOrdering When true, uses create roles security check. When false, uses write roles security check. When users are ordering an item or have it in their cart, check using the create roles. If users are not ordering, for example, somebody is looking at a requested item to see the variables associated with that item, then check using the write roles.
     */
    getCatalogItem(sysId: string, isOrdering?: boolean): object;

    /**
     * Returns the display value of the specified field (if it exists and has a value) from either the widget's sp_instance or the sp_portal record.
     * @param fieldName Name of the field
     */
    getDisplayValue(fieldName: string): string;

    /**
     * Returns information about the specified field in the specified GlideRecord.
     * @param gr The GlideRecord to check
     * @param fieldName The field to find information for
     */
    getField(gr: GlideRecord, fieldName: string): object

    /**
     * Checks the specified list of field names, and returns an array of valid field names.
     * @param gr The GlideRecord to check
     * @param fieldNames A comma separated list of field names.
     */
    getFields(gr: GlideRecord, fieldNames: string): Array<string>;

    /**
     * Checks the specified list of field names and returns an object of valid field names.
     * @param gr The GlideRecord to check
     * @param fieldNames A comma separated list of field names.
     */
    getFieldsObject(gr: GlideRecord, fieldNames: string): object;

    /**
     * Return the form.
     * @param tableName The name of the table.
     * @param sysId The form's sys_id.
     */
    getForm(tableName: string, sysId: string): object;
}

declare var gs: GlideSystem;
declare class GlideSystem
{
    /**
     *Does not have an constructor. available via global variable: gs
     */
    constructor();
    /**
     * Adds an error message for the current session.
     * @param message 
     */
    addErrorMessage(message: object): void;
    /**
     * Adds an info message for the current session. This method is not supported for asynchronous business rules
     * @param message 
     */
    addInfoMessage(message: object): void;

    /**
     * Returns an ASCII string from the specified base64 string.
     * @param source A base64 encoded string.
     */
    base64Decode(source: String): string;

    /**
     * Creates a base64 string from the specified string.
     * @param source The string to be encoded.
     */
    base64Encode(source: string): string;

    /**
     * Returns the date and time for the beginning of last month in GMT. in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfLastMonth(): string;

    /**
     * Returns the date and time for the beginning of last week in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfLastWeek(): string;

    /**
     * Returns the date and time for the beginning of next month in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfNextMonth(): string;

    /**
     * Returns the date and time for the beginning of next week in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfNextWeek(): string;

    /**
     * Returns the date and time for the beginning of next year in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfNextYear(): string;

    /**
     * Returns the date and time for the beginning of this month in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisMonth(): string;

    /**
     * Returns the date and time for the beginning of this quarter in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisQuarter(): string;

    /**
     * Returns the date and time for the beginning of this week in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisWeek(): string;

    /**
     * Returns the date and time for the beginning of this year in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisYear(): string;

    /**
     * Generates a date and time for the specified date in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param date Format: yyyy-mm-dd
     * @param range start, end, or a time in the 24 hour format hh:mm:ss.
     */
    dateGenerate(date: string, range: string): string;

    /**
     * Returns the date and time for a specified number of days ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param days Integer number of days
     */
    daysAgo(days: number): string;

    /**
     * Returns the date and time for the end of the day a specified number of days ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param days Integer number of days
     */
    daysAgoEnd(days: string): string

    /**
     * Returns the date and time for the beginning of the day a specified number of days ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param days Integer number of days
     */
    daysAgoStart(days: number): string;

    /**
     * Writes a debug message to the system log.
     * @param message The log message with place holders for any variable arguments.
     * @param parm1 (Optional) First variable argument.
     * @param parm2 (Optional) Second variable argument.
     * @param parm3 (Optional) Third variable argument.
     * @param parm4 (Optional) Fourth variable argument.
     * @param parm5 (Optional) Fifth variable argument.
     */
    debug(message: string, parm1?: object, parm2?: object, parm3?: object, parm4?: object, parm5?: object): void;

    /**
     * Returns the date and time for the end of last month in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfLastMonth(): string;

    /**
     * Returns the date and time for the end of last week in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfLastWeek(): string;

    /**
     * Returns the date and time for the end of last year in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfLastYear(): string;

    /**
     * Returns the date and time for the end of next month in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfNextMonth(): string;

    /**
     * Returns the date and time for the end of next week in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfNextWeek(): string;

    /**
     * Returns the date and time for the end of next year in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfNextYear(): string;

    /**
     * Returns the date and time for the end of this month in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfThisMonth(): string;

    /**
     * endOfThisQuarter()
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfThisQuarter(): string;

    /**
     * Returns the date and time for the end of this week in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfThisWeek(): string;

    /**
     * Returns the date and time for the end of this year in GMT.
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    endOfThisYear(): string;

    /**
     * Writes an error message to the system log.
     * This method accepts up to five variable arguments (varargs) in the message using the Java MessageFormat placeholder replacement pattern.
     * @param message The log message with place holders for any variable arguments.
     * @param parm1 (Optional) First variable argument.
     * @param parm2 (Optional) Second variable argument.
     * @param parm3 (Optional) Third variable argument.
     * @param parm4 (Optional) Fourth variable argument.
     * @param parm5 (Optional) Fifth variable argument.
     */
    error(message: string, parm1?: object, parm2?: object, parm3?: object, parm4?: object, parm5?: object): void

    /**
     * Queues an event for the event manager.
     * @param name Name of the event being queued.
     * @param instance GlideRecord object, such as "current".
     * @param parm1 Saved with the instance if specified.
     * @param parm2 Saved with the instance if specified.
     * @param queue Name of the queue.
     */
    eventQueue(name: string, instance: object, parm1?: string, parm2?: string, queue?: string): void;

    /**
     * Queues an event for the event manager at a specified date and time.
     * @param name 
     * @param instance 
     * @param parm1 
     * @param parm2 
     * @param expiration 
     */
    eventQueueScheduled(name: string, instance: object, parm1: string, parm2: string, expiration: object): void;

    /**
     * Executes a job for a scoped application.
     * @param job 	The job to be run.
     * @returns the sysID of the scheduled job. Returns null if the job is global.
     */
    executeNow(job: GlideRecord): string;

    /**
     * Generates a GUID that can be used when a unique identifier is required.
     */
    generateGUID(): string;

    /**
     * Gets the caller scope name; returns null if there is no caller.
     */
    getCallerScopeName(): string;

    /**
     * Gets a string representing the cache version for a CSS file.
     */
    getCssCacheVersionString(): string

    /**
     * Gets the ID of the current application as set using the Application Picker.
     */
    getCurrentApplicationId(): string;

    /**
     * Gets the name of the current scope.
     */
    getCurrentScopeName(): string;

    /**
     * Returns the list of error messages for the session that were added by addErrorMessage().
     */
    getErrorMessages(): string;

    /**
     * Retrieves a message from UI messages with HTML special characters replaced with escape sequences, for example, & becomes &amp;.
     * @param id The ID of the message.
     * @param args (Optional) a list of strings or other values defined by java.text.MessageFormat, which allows you to produce language-neutral messages for display to users.
     */
    getEscapedMessage(id: string, args?: Array<string>): string;

    /**
     * Retrieves a message from UI messages.
     * @param id The ID of the message.
     * @param args a list of strings or other values defined by java.text.MessageFormat, which allows you to produce language-neutral messages for display to users.
     */
    getMessage(id: string, args?: Array<string>): string;

    /**
     * Gets the value of a Glide property. If the property is not found, returns an alternate value.
     * @param key The key for the property whose value should be returned.
     * @param alt (Optional) Alternate object to return if the property is not found.
     */
    getProperty(key: string, alt?: object): string;

    /**
     * Gets a reference to the current Glide session.
     */
    getSession(): GlideSession;

    /**
     * Retrieves the GlideSession session ID.
     */
    getSessionID(): string;

    /**
     * DEPRECATED
     * 
     * This method is no longer available. Instead, use gs.getSession().getSessionToken().
     */
    getSessionToken(): string;

    /**
     * Returns the name of the time zone associated with the current user.
     */
    getTimeZoneName(): string;

    /**
     * Gets the current URI for the session.
     */
    getUrlOnStack(): string;

    /**
     * Returns a reference to the scoped GlideUser object for the current user.
     */
    getUser(): GlideUser;

    /**
     * Gets the display name of the current user.
     */
    getUserDisplayName(): string;

    /**
     * Gets the sys_id of the current user.
     */
    getUserID(): string;

    /**
     * Gets the user name, or user id, of the current user.
     */
    getUserName(): string;

    /**
     * Determines if the current user has the specified role.
     * 
     * always returns true for users with the admin role.
     * @param role The role to check.
     */
    hasRole(role: string): boolean;

    /**
     * Returns the date and time for a specified number of hours ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param hours Integer number of hours
     */
    hoursAgo(hours: number): string;

    /**
     * Returns the date and time for the end of the hour a specified number of hours ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param hours Integer number of hours
     */
    hoursAgoEnd(hours: number): string;

    /**
     * Returns the date and time for the start of the hour a specified number of hours ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param hours Integer number of hours 
     */
    hoursAgoStart(hours: number): string;

    /**
     * Provides a safe way to call from the sandbox, allowing only trusted scripts to be included.
     * @param name 	The name of the script to include.
     */
    include(name: string): boolean;

    /**
     * Writes an info message to the system log.
     * @param message The log message with place holders for any variable arguments.
     * @param parm1 (Optional) First variable argument.
     * @param parm2 (Optional) Second variable argument.
     * @param parm3 (Optional) Third variable argument.
     * @param parm4 (Optional) Fourth variable argument.
     * @param parm5 (Optional) Fifth variable argument.
     */
    info(message: string, parm1?: object, parm2?: object, parm3?: object, parm4?: object, parm5?: object): void;

    /**
     * Determines if debugging is active for a specific scope.
     */
    isDebugging(): boolean;

    /**
     * Checks if the current session is interactive.
     * An example of an interactive session is when a user logs in normally.
     */
    isInteractive(): boolean;

    /**
     * Determines if the current user is currently logged in.
     */
    isLoggedIn(): boolean;

    /**
     * You can determine if a request comes from a mobile device.
     * 
     * This method can be used in UI action conditions and business rules.
     */
    isMobile(): boolean;

    /**
     * Returns the date and time for the end of the minute a specified number of minutes ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param minutes Integer number of minutes 
     */
    minutesAgoEnd(minutes: number): string;

    /**
     * Returns the date and time for the start of the minute a specified number of minutes ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param minutes Integer number of hours 
     */
    minutesAgoStart(minutes: number): string;

    /**
     * Returns the date and time for a specified number of months ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param months Integer number of months
     */
    monthsAgo(months: number): string;

    /**
     * Returns the date and time for the start of the month a specified number of months ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param months Integer number of months
     */
    monthsAgoStart(months: number): string;

    /**
     * Queries an object and returns true if the object is null, undefined, or contains an empty string.
     * @param o The object to be checked.
     */
    nil(o: object): boolean;

    /**
     * Returns the date and time for the last day of the quarter for a specified number of quarters ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param quarters 	Integer number of quarters
     */
    quartersAgoEnd(quarters: number): string;

    /**
     * Returns the date and time for the first day of the quarter for a specified number of quarters ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param quarters 	Integer number of quarters
     */
    quartersAgoStart(quarters: number): string;

    /**
     * Sets the specified key to the specified value if the property is within the script's scope.
     * @param key The key for the property to be set.
     * @param value The value of the property to be set
     * @param description A description of the property.
     */
    setProperty(key: string, value: string, description: string): void;

    /**
     * Sets the redirect URI for this transaction, which then determines the next page the user will see.
     * @param o URI object or URI string to set as the redirect
     */
    setRedirect(o: string | object): void;

    /**
     * Determines if a database table exists.
     * @param name Name of the table to check for existence.
     */
    tableExists(name: string): boolean;

    /**
     * Replaces UTF-8 encoded characters with ASCII characters.
     * @param url A string with UTF-8 percent (%) encoded characters.
     */
    urlDecode(url: string): string;

    /**
     * Encodes non-ASCII characters, unsafe ASCII characters, and spaces so the returned string can be used on the Internet.
     * Uses UTF-8 encoding. Uses percent (%) encoding.
     * @param url The string to be encoded.
     */
    urlEncode(url: string): string;

    /**
     * Writes a warning message to the system log.
     * @param message The log message with place holders for any variable arguments.
     * @param parm1 (Optional) First variable argument.
     * @param parm2 (Optional) Second variable argument.
     * @param parm3 (Optional) Third variable argument.
     * @param parm4 (Optional) Fourth variable argument.
     * @param parm5 (Optional) Fifth variable argument.
     */
    warn(message: string, parm1?: object, parm2?: object, parm3?: object, parm4?: object, parm5?: object): void;

    /**
     * Takes an XML string and returns a JSON object.
     * @param xmlString The XML string to be converted.
     */
    xmlToJSON(xmlString: string): object;

    /**
     * Returns a date and time for a certain number of years ago.
     * 
     * format yyyy-mm-dd hh:mm:ss
     * @param years An integer number of years
     */
    yearsAgo(years: number): string;

    /**
     * Returns yesterday's time (24 hours ago).
     * 
     * format yyyy-mm-dd hh:mm:ss
     */
    yesterday(): string;

}

declare namespace sn_ws
{
    class RestMessagev2
    {
        /**
         * Instantiates an empty RESTMessageV2 object. 
         * When using an object instantiated this way, you must manually specify an HTTP method and endpoint.
         */
        constructor()
        /**
         * Instantiates a RESTMessageV2 object using information from a REST message record.
         * You must have a REST message record defined before you can use this constructor.
         * @param name The name of the REST message record.
         * @param methodName The name of the HTTP method to use, such as GET or PUT.
         */
        constructor(name: string, methodName: string);
        /**
         * Sends the REST message to the endpoint.
         */
        execute(): RestResponseV2;

        /**
         * Sends the REST message to the endpoint asynchronously. The instance does not wait for a response from the web service provider when making asynchronous calls.
         */
        executeAsync(): RestResponseV2;

        /**
         * Returns the URL of the endpoint for the REST message.
         */
        getEndpoint(): string;

        /**
         * Returns the content of the REST message body.
         */
        getRequestBody(): string

        /**
         * Returns the value for an HTTP header specified in the REST message.
         * By default, this method cannot return the value for a header set automatically by the system.
         * @param headerName The request header you want to get the value for.
         */
        getRequestHeader(headerName: string): string

        /**
         * Returns HTTP headers that were set by the REST client and the associated values.
         * This method does not return headers set automatically by the system
         */
        getRequestHeaders(): object;

        /**
         * Configures the REST message to save the returned response body as an attachment record.
         * @param tableName Specify the table that contains the record you want to attach the saved file to.
         * @param recordSysId Specify the sys_id of the record you want to attach the saved file to.
         * @param fileName 	Specify the file name to give to the saved file.
         */
        saveResponseBodyAsAttachment(tableName: string, recordSysId: string, fileName: string): void;

        /**
         * Configure the REST message to save the returned response body as an encrypted attachment record.
         * @param tableName Specify the table that contains the record you want to attach the saved file to.
         * @param recordSysId Specify the sys_id of the record you want to attach the saved file to.
         * @param fileName Specify the file name to give to the saved file.
         * @param encryptContext Specify the sys_id of an encryption context. The saved file is encrypted using this context.
         */
        saveResponseBodyAsAttachment(tableName: string, recordSysId: string, fileName: string, encryptContext: string): void;

        /**
         * Sets the credentials for the REST message using an existing basic auth or OAuth 2.0 profile.
         * @param type he type of authentication profile to use. Valid values are 'basic' to use basic authentication, or 'oauth2' to use OAuth 2.0.
         * @param profileId he sys_id of an authentication profile record.
         */
        setAuthenticationProfile(type: string, profileId: string): void;

        /**
         * Sets basic authentication headers for the REST message.
         * Setting security values using this method overrides basic authentication values defined for the REST message record.
         * @param userName The username you want to use to authenticate the REST message.
         * @param userPass The password for the specified user.
         */
        setBasicAuth(userName: string, userPass: string): void;

        /**
         * Associates outbound requests and the resulting response record in the ECC queue. This method only applies to REST messages sent through a MID Server.
         * @param correlator A unique identifier
         */
        setEccCorrelator(correlator: string): void;

        /**
         * Overrides a value from the database by writing to the REST message payload. This method only applies to REST messages sent through a MID Server.
         * @param name The name of the parameter, such as source.
         * @param value The value to assign to the specified parameter.
         */
        setEccParameter(name: string, value: string): void;

        /**
         * Set the endpoint for the REST message.
         * By default, the REST message uses the endpoint specified in the REST message record.
         * @param endpoint The URL of the REST provider you want to interface with.
         */
        setEndpoint(endpoint: string): void;

        /**
         * The HTTP method this REST message performs, such as GET or PUT.
         * @param method The HTTP method to perform.
         */
        setHttpMethod(method: string): void;

        /**
         * Sets the amount of time the REST message waits for a response from the web service provider before the request times out.
         * @param timeoutMs The amount of time, in milliseconds, before the call to the REST provider times out.
         */
        setHttpTimeout(timeoutMs: number): void;

        /**
         * Set the log level for this message and the corresponding response.
         * Setting a log level using the RESTMessageV2 API overrides the log level configured on the REST message record. 
         * @param level The log level. Valid values are basic, elevated, and all.
         */
        setLogLevel(level: string): void;

        /**
         * Configures the REST message to communicate through a MID Server
         * @param midServer The name of the MID Server to use. Your instance must have an active MID Server with the specified name.
         */
        setMIDServer(midServer: string): void;

        /**
         * Sets the mutual authentication protocol profile for the REST message.
         * Setting a protocol profile using this method overrides the protocol profile selected for the REST message record.
         * @param profileName The Name of the protocol profile to use for mutual authentication.
         */
        setMutualAuth(profileName: string): void;

        /**
         * Append a parameter to the end of the request URL with the form name=value.
         * @param name The name of the URL parameter to pass.
         * @param value The value to assign the URL parameter.
         */
        setQueryParameter(name: string, value: string): void;

        /**
         * Set the body content to send to the web service provider when using PUT or POST HTTP methods
         * @param body The request body to send.
         */
        setRequestBody(body: string): void;

        /**
         * Sets the request body using an existing attachment record.
         * @param attachmentSysId The sys_id of the Attachment [sys_attachment] record you want to send in this REST message.
         */
        setRequestBodyFromAttachment(attachmentSysId: string): void;

        /**
         * Set the body content of a PUT or POST message using a binary stream.
         * @param stream The binary data to send, such as an attachment or a stream from a 3rd-party service.
         */
        setRequestBodyFromStream(stream: object): void;

        /**
         * Sets an HTTP header in the REST message to the specified value.
         * @param name The name of the header.
         * @param value The value to assign to the specified header.
         */
        setRequestHeader(name: string, value: string): void;

        /**
         * Override the default requestor profile for the REST message in order to retrieve an OAuth access token associated with a different requestor.
         * This method applies only to REST messages configured to use OAuth 2.0 authentication
         * @param requestorContext 
         * @param requestorId 
         */
        setRequestorProfile(requestorContext: string, requestorId: string): void;

        /**
         * Sets a REST message function variable with the specified name from the REST message record to the specified value.
         * @param name The name of the REST message variable. This parameter must be defined in the REST message record before you can assign a value to it.
         * @param value The value to assign the variable.
         */
        setStringParameter(name: string, value: string): void;

        /**
         * Sets a REST message function variable with the specified name from the REST message record to the specified value.
         * This method is equivalent to setStringParameter but does not escape XML reserved characters.
         * @param name The name of the REST message variable. This parameter must be defined in the REST message record before you can assign a value to it.
         * @param value The value to assign the variable.
         */
        setStringParameterNoEscape(name: string, value: string): void;
    }

    class RestResponseV2
    {
        /**
         * The RESTResponseV2 API allows you to use the data returned by an outbound REST message in JavaScript code.
         * A RESTResponseV2 object is returned by the RESTMessageV2 functions execute() and executeAsync().
         */
        constructor()
        /**Return all headers contained in the response, including any duplicate headers. */
        getAllHeader(): Array<GlideHTTPHeader>;

        /**
         * Get the content of the REST response body.
         * Use this function when you want to get the request body as text content. Do not use this method when saving the response as a binary attachment. 
         */
        getBody(): string;

        /**
         * Returns all cookies included in the response.
         */
        getCookies(): Array<object>;

        /**
         * Get the numeric error code if there was an error during the REST transaction.
         * This error code is specific to the Now Platform, it is not an HTTP error code.
         */
        getErrorCode(): number;

        /**
         * Get the error message if there was an error during the REST transaction.
         */
        getErrorMessage(): string;

        /**
         * Get the value for a specified header.
         * @param name The name of the header that you want the value for, such as Set-Cookie.
         */
        getHeader(name: string): string;

        /**
         * Get all headers returned in the REST response and the associated values.
         * If a header is present more than once in the response, such as a Set-Cookie header, this function returns only the last of the duplicate headers.
         */
        getHeaders(): object

        /**
         * Get the fully-resolved query sent to the REST endpoint.
         * This query contains the endpoint URL as well as any values assigned to variables in the REST message.
         * Use this method only with responses to direct requests.
         * This method is not supported for requests sent asynchronously, or requests sent using a MID server.
         */
        getQueryString(): string;

        /**
         * Get the sys_id value of the attachment created from the response body content.
         * Use this function when you want to perform additional operations with the new attachment record.
         */
        getResponseAttachmentSysid(): string

        /**
         * Get the numeric HTTP status code returned by the REST provider.
         */
        getStatusCode(): number

        /**
         * Indicate if there was an error during the REST transaction.
         */
        haveError(): boolean;

        /**
         * Set the amount of time the instance waits for a response from the web service provider.
         * This method overrides the property glide.rest.outbound.ecc_response.timeout for this REST response.
         * @param timeoutSecs The amount of time, in seconds, to wait for this response.
         */
        waitForResponse(timeoutSecs: number): void;
    }
    //Not documentet
    class GlideHTTPHeader { }
}
