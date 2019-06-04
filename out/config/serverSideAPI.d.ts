/* SN SERVERSIDE */

declare class GlideRecord
{
    /**
     * Creates an instance of the GlideRecord class for the specified table. 
     */
    constructor(tableName: string);

    /**
     * Adds a filter to return active records.
     */
    addActiveQuery(): GlideQueryCondition;

    /**
    * Adds an encoded query to other queries that may have been set.
    */
    addEncodedQuery(query: string): void;

    /**
     * Adds a filter to return records based on a relationship in a related table.
     */
    addJoinQuery(joinTable: string, primaryField: object, joinTableField: object): GlideQueryCondition

    /**
     * A filter that specifies records where the value of the field passed in the parameter is not null.
     */
    addNotNullQuery(fieldName: string): GlideQueryCondition;

    /**
     * Adds a filter to return records where the value of the specified field is null.
     */
    addNullQuery(fieldName: string): GlideQueryCondition;

    /**
     * Provides the ability to build a request, which when executed, returns the rows from the specified table, that match the request.
     */
    addQuery(fieldName: string, operator: string, value: object): GlideQueryCondition;

    /**
     * Provides the ability to build a request, which when executed, returns the rows from the specified table, that match the request.
     */
    addQuery(fieldName: string, value: object): GlideQueryCondition;

    /**
     * Provides the ability to build a request, which when executed, returns the rows from the specified table, that match the request.
     */
    addQuery(fieldName: string): GlideQueryCondition;

    /**
     * Determines if the Access Control Rules, which include the user's roles, permit inserting new records in this table.
     */
    canCreate(): boolean;

    /**
     * Determines if the Access Control Rules, which include the user's roles, permit deleting records in this table.
     */
    canDelete(): boolean;

    /**
     * Determines if the Access Control Rules, which include the user's roles, permit reading records in this table. 
     */
    canRead(): boolean;

    /**
     * Determines if the Access Control Rules, which include the user's roles, permit editing records in this table. 
     */
    canWrite(): boolean;

    /**
     * Determines if the Access Control Rules, which include the user's roles, permit editing records in this table.
     */
    chooseWindow(firstRow: number, lastRow: number, forceCount: boolean): void;

    /**
     * Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT for a duration field.
     * Does not require the creation of a GlideDateTime object because the duration field is already a GlideDateTime object.
     */
    dateNumericValue(): number;

    /**
     * Deletes multiple records that satisfy the query condition.
     * This method does not delete attachments.
     */
    deleteMultiple(): void;

    /**
     * Deletes the current record. 
     */
    deleteRecord(): void;

    /**
     * Defines a GlideRecord based on the specified expression of 'name = value'.
     * This method is expected to be used to query for single records, so a 'next' operation on the recordset is performed by this method before returning.
     */
    get(name: object, value: object): boolean;

    /**
     * Returns the dictionary attributes for the specified field. 
     */
    getAttribute(fieldName: string): boolean;

    /**
     * Returns the table's label.
     */
    getClassDisplayValue(): string;

    /**
     * Returns the element's descriptor. 
     */
    getED(): GlideElementDescriptor;

    /**
     * Retrieves the GlideElement object for the specified field. 
     */
    getElement(columnName: string): GlideElement;

    /**
     * Retrieves the query condition of the current result set as an encoded query string. 
     */
    getEncodedQuery(): string;

    /**
     * Returns the field's label.
     */
    getLabel(): string;

    /**
     * Retrieves the last error message. If there is no last error message, null is returned. 
     */
    getLastErrorMessage(): string;

    /**
     * Retrieves a link to the current record.
     */
    getLink(noStack: boolean): string;

    /**
     * Retrieves the class name for the current record.
     */
    getRecordClassName(): string;

    /**
     * Retrieves the number of rows in the query result.
     */
    getRowCount(): number;

    /**
     * Retrieves the name of the table associated with the GlideRecord. 
     */
    getTableName(): string;

    /**
     * Gets the primary key of the record, which is usually the sys_id unless otherwise specified. 
     */
    getUniqueValue(): string;

    /**
     * Retrieves the string value of an underlying element in a field. 
     */
    getValue(name: string): string;

    /**
     * Returns the display value for the field provided.
     * @param name field name
     */
    getDisplayValue(name: string): string;

    /**
     * Determines if there are any more records in the GlideRecord object. 
     */
    hasNext(): boolean;

    /**
     * Creates an empty record suitable for population before an insert. 
     */
    initialize(): void;

    /**
     * Inserts a new record using the field values that have been set for the current record.
     */
    insert(): string

    /**
     * Checks to see if the current database action is to be aborted.
     */
    isActionAborted(): boolean;

    /**
     * Checks if the current record is a new record that has not yet been inserted into the database. 
     */
    isNewRecord(): boolean;

    /**
     * Determines if the table exists.
     */
    isValid(): boolean;

    /**
     * Determines if the specified field is defined in the current table. 
     */
    isValidField(columnName: string): boolean;

    /**
     * Determines if current record is a valid record. 
     */
    isValidRecord(): boolean;

    /**
     * Creates a new GlideRecord record, sets the default values for the fields, and assigns a unique ID to the record.
     */
    newRecord(): boolean;

    /**
     * Moves to the next record in the GlideRecord object.
     */
    next(): boolean;

    /**
     * Retrieves the current operation being performed, such as insert, update, or delete. 
     */
    operation(): string;

    /**
     * Specifies an orderBy column.
     * Call this method more than once to order by multiple columns. Results are arranged in ascending order, see orderByDesc(String name) to arrange records in descending order. 
     */
    orderBy(name: string): void;

    /**
     * Specifies a decending orderBy column.
     */
    orderByDesc(name: string): void;

    /**
     * Runs the query against the table based on the filters specified by addQuery, addEncodedQuery, etc.
     * If name/value pair is specified, "name=value" condition is added to the query.
     */
    query(field?: object, value?: object): void;

    /**
     * Sets a flag to indicate if the next database action (insert, update, delete) is to be aborted. This is often used in business rules.
     * Use in an onBefore business rule to prevent the database action from being done.
     * The business rule continues to run after setAbortAction() is called. Calling setAbortAction() does not stop subsequent business rules from executing.
     * Calling this method only prevents the database action from occurring. 
     */
    setAbortAction(b: boolean): void;

    /**
     * Sets the duration field to a number of milliseconds since January 1, 1970, 00:00:00 GMT for a duration field.
     * Does not require the creation of a GlideDateTime object because the duration field is already a GlideDateTime object. 
     */
    setDateNumericValue(milliseconds: number): void;

    /**
     * Sets the limit for number of records are fetched by the GlideRecord query.
     */
    setLimit(maxNumRecords: number): void;

    /**
     * Sets sys_id value for the current record. 
     */
    setNewGuidValue(guid: string): void;

    /**
     * Sets the value of the field with the specified name to the specified value.
     * Normally the script does a gr.category = value. However, if the element name is itself a variable then gr.setValue(elementName, value) can be used.
     */
    setValue(name: string, value: object): void;

    /**Enables or disables the running of business rules, script engines, and audit.
     * 
     * @param enable If true (default), enables business rules. If false, disables business rules.
     */
    setWorkflow(enable: boolean): void;

    /**
     * Updates the GlideRecord with any changes that have been made. If the record does not already exist, it is inserted.
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

    /**
     * Provides the same functionality as next(), it is intended to be used in cases where the GlideRecord has a column named next. 
     */
    _next(): boolean;

    /**
     * Identical to query(). This method is intended to be used on tables where there is a column named query, which would interfere with using the query() method.
     */
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

    /**
     * Returns the encryption type used for attachments on the element's table. 
     * This method is for use with the Edge Encryption plugin. 
     */
    getAttachmentEncryptionType(): string;

    /**
     * Returns the element's encryption type.
     * This method is for use with the Edge Encryption plugin. 
     */
    getEncryptionType(): string;

    /**
     * Returns the element's internal data type. 
     */
    getInternalType(): string;

    /**
     * Returns the element's label.
     */
    getLabel(): string;

    /**
     * Returns the element's length. 
     */
    getLength(): number;

    /**
     * Returns the element's name. 
     */
    getName(): string;

    /**
     * Returns the element's plural label. 
     */
    getPlural(): String

    /**
     * Returns true if an encrypted attachment has been added to the table.
     * This method is for use with the Edge Encryption plugin. 
     */
    hasAttachmentsEncrypted(): Boolean;

    /**
     * Returns true if the element is an automatically generated or system field.
     * Automatically generated and system fields cannot be encrypted. This method is for use with the Edge Encryption plugin. 
     */
    isAutoOrSysID(): boolean;

    /**
     * Returns true if an element is encrypted.
     * This method is for use with the Edge Encryption plugin. 
     */
    isEdgeEncrypted(): boolean;

    /**
     * Returns true if the element is a virtual element.
     * A virtual element is a calculated field as set by the dictionary definition of the field. Virtual fields cannot be encrypted. 
     */
    isVirtual(): boolean;
}

declare class GlideDateTime
{
    /**
     * Instantiates a new GlideDateTime object with the current date and time in Greenwich Mean Time (GMT).
     */
    constructor();

    /**
     * Instantiates a new GlideDateTime object set to the time of the GlideDateTime object passed in the parameter.
     * @param g The GlideDateTime object to use for setting the time of the new object.
     */
    constructor(g: GlideDateTime);

    /**
     * Instantiates a new GlideDateTime object from a date and time value in the UTC time zone specified with the format yyyy-MM-dd HH:mm:ss.
     * @param value A UTC date and time using the internal format yyyy-MM-dd HH:mm:ss.
     */
    constructor(value: string);

    /**
     * Adds a GlideTime object to the current GlideDateTime object.
     * @param gd The GlideTime object to add.
     */
    add(gd: GlideTime): void;

    /**
     * Adds the specified number of milliseconds to the current GlideDateTime object.
     * @param milliseconds The number of milliseconds to add.
     */
    add(milliseconds: Number): void;

    /**
     * Adds a specified number of days to the current GlideDateTime object. A negative parameter subtracts days. 
     * 
     * The method determines the local date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts days using the local date and time values.
     * @param days The number of days to add. Use a negative value to subtract.
     */
    addDaysLocalTime(days: Number): void;

    /**
     * Adds a specified number of days to the current GlideDateTime object. A negative parameter subtracts days. 
     * 
     * The method determines the UTC date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts days using the UTC date and time values.
     * @param days The number of days to add. Use a negative number to subtract.
     */
    addDaysUTC(days: Number): void;

    /**
     * Adds a specified number of months to the current GlideDateTime object. A negative parameter subtracts months. 
     * 
     * The method determines the local date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts months using the local date and time values.
     * @param months The number of months to add. use a negative value to subtract.
     */
    addMonthsLocalTime(months: Number): void;

    /**
     * Adds a specified number of months to the current GlideDateTime object. A negative parameter subtracts months. 
     * 
     * The method determines the UTC date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts months using the UTC date and time values.
     * @param months The number of months to add. Use a negative value to subtract.
     */
    addMonthsUTC(months: Number): void;

    /**
     * Adds the specified number of seconds to the current GlideDateTime object.
     * @param seconds The number of seconds to add.
     */
    addSeconds(seconds: Number): void;

    /**
     * Adds a specified number of weeks to the current GlideDateTime object. A negative parameter subtracts weeks. 
     * 
     * The method determines the local date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts weeks using the local date and time values.
     * @param weeks The number of weeks to add. Use a negative value to subtract.
     */
    addWeeksLocalTime(weeks: Number): void;

    /**
     * Adds a specified number of weeks to the current GlideDateTime object. A negative parameter subtracts weeks. 
     * 
     * The method determines the UTC date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts weeks using the UTC date and time values.
     * @param weeks	The number of weeks to add. Use a negative value to subtract.
     */
    addWeeksUTC(weeks: Number): void;

    /**
     * Adds a specified number of years to the current GlideDateTime object. A negative parameter subtracts years. 
     * 
     * The method determines the local date and time equivalent to the value stored by the GlideDateTime object, then adds or subtracts years using the local date and time values.
     * @param years The number of years to add. Use a negative value to subtract.
     */
    addYearsLocalTime(years: Number): void;

    /**
     * Adds a specified number of years to the current GlideDateTime object. A negative parameter subtracts years. The date and time value stored by GlideDateTime object is interpreted as being in the UTC time zone.
     * @param years The number of years to add. Use a negative value to subtract.
     */
    addYearsUTC(years: Number): void;

    /**
     * Determines if the GlideDateTime object occurs after the specified GlideDateTime.
     * @param gdt The time to check against.
     */
    after(gdt: GlideDateTime): boolean

    /**
     * Determines if the GlideDateTime object occurs before the specified GlideDateTime.
     * @param gdt The time to check against.
     */
    before(gdt: GlideDateTime): boolean

    /**
     * Compares two date and time objects to determine whether they are equivalent or one occurs before or after the other.
     * @param gdt
     * @returns 0 = Dates are equal, 1 = date is after input date, -1 = date is before input date
     */
    compareTo(gdt: GlideDateTime): Number

    /**
     * Compares a datetime with an existing value for equality.
     * @param dateTime 	GlideDateTime object or String to compare
     */
    equals(dateTime: GlideDateTime | string): boolean;

    /**
     * Gets the date stored by the GlideDateTime object, expressed in the standard format, yyyy-MM-dd, and the system time zone, UTC by default.
     * @returns The date in the system time zone.
     */
    getDate(): GlideDateTime;

    /**
     * Gets the day of the month stored by the GlideDateTime object, expressed in the current user's time zone.
     * @returns from 1 to 31.
     */
    getDayOfMonthLocalTime(): Number;

    /**
     * Gets the day of the month stored by the GlideDateTime object, expressed in the UTC time zone.
     */
    getDayOfMonthUTC(): Number;

    /**
     * Gets the day of the week stored by the GlideDateTime object, expressed in the user's time zone.
     */
    getDayOfWeekLocalTime(): Number;

    /**
     * Gets the day of the week stored by the GlideDateTime object, expressed in the UTC time zone.
     */
    getDayOfWeekUTC(): Number;

    /**
     * Gets the number of days in the month stored by the GlideDateTime object, expressed in the current user's time zone.
     */
    getDaysInMonthLocalTime(): Number

    /**
     * Gets the number of days in the month stored by the GlideDateTime object, expressed in the UTC time zone.
     */
    getDaysInMonthUTC(): Number;

    /**
     * Gets the date and time value in the current user's display format and time zone.
     */
    getDisplayValue(): String;

    /**
     * Gets the display value in the internal format (yyyy-MM-dd HH:mm:ss).
     */
    getDisplayValueInternal(): String

    /**
     * Gets the amount of time that daylight saving time is offset.
     */
    getDSTOffset(): Number;

    /**
     * Gets the current error message.
     */
    getErrorMsg(): String;

    /**
     * Returns the object's time in the local time zone and in the internal format.
     */
    getInternalFormattedLocalTime(): String;

    /**
     * Gets the date stored by the GlideDateTime object, expressed in the standard format, yyyy-MM-dd, and the current user's time zone.
     */
    getLocalDate(): GlideDate;

    /**
     * Returns a GlideTime object that represents the time portion of the GlideDateTime object in the user's time zone.
     */
    getLocalTime(): GlideTime;

    /**
     * Gets the month stored by the GlideDateTime object, expressed in the current user's time zone.
     */
    getMonthLocalTime(): Number;

    /**
     * Gets the month stored by the GlideDateTime object, expressed in the UTC time zone.
     */
    getMonthUTC(): Number;

    /**
     * Gets the number of milliseconds since January 1, 1970, 00:00:00 GMT.
     */
    getNumericValue(): Number;

    /**
     * Returns a GlideTime object that represents the time portion of the GlideDateTime object.
     */
    getTime(): GlideTime;

    /**
     * Gets the time zone offset in milliseconds.
     */
    getTZOffset(): Number;

    /**
     * Returns the object's time in the local time zone and in the user's format.
     */
    getUserFormattedLocalTime(): String;

    /**
     * Gets the date and time value stored by the GlideDateTime object in the internal format, yyyy-MM-dd HH:mm:ss, and the system time zone, UTC by default. 
     */
    getValue(): String;

    /**
     * Gets the number of the week stored by the GlideDateTime object, expressed in the current user's time zone. 
     * All weeks begin on Sunday. The first week of the year is the week that contains at least one day of the new year. 
     * The week beginning Sunday 2015-12-27 is considered the first week of 2016 as that week contains January 1 and 2.
     */
    getWeekOfYearLocalTime(): Number;

    /**
     * Gets the number of the week stored by the GlideDateTime object, expressed in the UTC time zone. 
     * All weeks begin on Sunday. The first week of the year is the week that contains at least one day of the new year. 
     * The week beginning Sunday 2015-12-27 is considered the first week of 2016 as that week contains January 1 and 2.
     */
    getWeekOfYearUTC(): Number;

    /**
     * Gets the year stored by the GlideDateTime object, expressed in the current user's time zone.
     */
    getYearLocalTime(): Number;

    /**
     * Gets the year stored by the GlideDateTime object, expressed in the UTC time zone.
     */
    getYearUTC(): Number;

    /**
     * Determines if an object's date is set.
     */
    hasDate(): Boolean;

    /**
     * Determines if an object's time uses a daylight saving offset.
     */
    isDST(): Boolean;

    /**
     * Determines if a value is a valid date and time.
     */
    isValid(): Boolean;

    /**
     * Determines if the GlideDateTime object occurs on or after the specified GlideDateTime.
     * @param gdt The time to check against.
     * @returns Returns true if the GlideDateTime object's time is on or after the time specified by the parameter.
     */
    onOrAfter(gdt: GlideDateTime): Boolean;

    /**
     * Determines if the GlideDateTime object occurs on or before the specified GlideDateTime.
     * @param gdt The time to check against.
     * @returns Returns true if the GlideDateTime object's time is on or before the time specified by the parameter.
     */
    onOrBefore(gdt: GlideDateTime): Boolean;

    /**
     * Sets the day of the month to a specified value in the current user's time zone.
     * @param day The day of month to change to, from 1 to 31. If this value is greater than the maximum number of days in the month, the value is set to the last day of the month.
     */
    setDayOfMonthLocalTime(day: Number): void;

    /**
     * Sets the day of the month to a specified value in the UTC time zone.
     * @param day The day of month to change to, from 1 to 31. If this value is greater than the maximum number of days in the month, the value is set to the last day of the month.
     */
    setDayOfMonthUTC(day: Number): void;

    /**
     * Sets a date and time value using the current user's display format and time zone.
     * @param asDisplayed The date and time in the current user's display format and time zone. The parameter must be formatted using the current user's preferred display format, such as MM-dd-yyyy HH:mm:ss. To assign the current date and time to a variable in a workflow script, use variable.setDisplayValue(gs.nowDateTime);.
     */

    setDisplayValue(asDisplayed: string): void;

    /**
     * Sets a date and time value using the current user's time zone and the specified date and time format. This method throws a runtime exception if the date and time format used in the value parameter does not match the format parameter. You can retrieve the error message by calling getErrorMsg() on the GlideDateTime object after the exception is caught.
     * @param value The date and time in the current user's time zone.
     * @param format The date and time format to use to parse the value parameter.
     */
    setDisplayValue(value: string, format: string): void;

    /**
     * Sets a date and time value using the internal format (yyyy-MM-dd HH:mm:ss) and the current user's time zone.
     * @param value The date and time in internal format.
     */
    setDisplayValueInternal(value: string): void;

    /**
     * Sets the date and time of the current object using an existing GlideDateTime object. This method is equivalent to instantiating a new object with a GlideDateTime parameter.
     * @param g The object to use for setting the datetime value.
     */
    setGlideDateTime(g: GlideDateTime): void;

    /**
     * Sets the month stored by the GlideDateTime object to the specified value using the current user's time zone.
     * @param month The month to change to.
     */
    setMonthLocalTime(month: Number): void;

    /**
     * Sets the month stored by the GlideDateTime object to the specified value using the UTC time zone.
     * @param month The month to change to.
     */
    setMonthUTC(month: Number): void;

    /**
     * Sets the date and time of the GlideDateTime object.
     * @param o The date and time to use. This parameter may be one of several types:
    A string in the UTC time zone and the internal format of yyyy-MM-dd HH:mm:ss. Sets the value of the object to the specified date and time. Using the method this way is equivalent to instantiating a new GlideDateTime object using the GlideDateTime(String value) constructor. If the date and time format used does not match the internal format, the method attempts to set the date and time using other available formats. Resolving the date and time this way can lead to inaccurate data due to ambiguity in the day and month values. When using a non-standard date and time format, use etValueUTC(String dt, String format) instead.
    A GlideDateTime object. Sets the value of the object to the date and time stored by the GlideDateTime passed in the parameter. Using the method this way is equivalent to instantiating a new GlideDateTime object using the GlideDateTime(GlideDateTime g) constructor.
    A JavaScript Number. Sets the value of the object using the Number value as milliseconds past January 1, 1970 00:00:00 GMT.
     */
    setValue(o: string): void;

    /**
     * Sets a date and time value using the UTC time zone and the specified date and time format. This method throws a runtime exception if the date and time format used in the dt parameter does not match the format parameter. You can retrieve the error message by calling getErrorMsg() on the GlideDateTime object after the exception is caught.
     * @param dt The date and time to use.
     * @param format The date and time format to use.
     */
    setValueUTC(dt: string, format: string): void;

    /**
     * Sets the year stored by the GlideDateTime object to the specified value using the current user's time zone.
     * @param year The year to change to.
     */
    setYearLocalTime(year: Number): void;

    /**
     * Sets the year stored by the GlideDateTime object to the specified value using the UTC time zone
     * @param year The year to change to.
     */
    setYearUTC(year: Number): void;

    /**
     * Subtracts a specified amount of time from the current GlideDateTime object.
     * @param time The time value to subtract.
     */
    subtract(time: GlideTime): void;

    /**
     * Subtracts the specified number of milliseconds from the GlideDateTime object.
     * @param milliseconds The number of milliseconds to subtract.
     */
    subtract(milliseconds: Number): void;

    /**
     * Gets the duration difference between two GlideDateTime values.
     * @param start The start value.
     * @param end The end value.
     * @returns The duration between the two values.
     */
    subtract(start: GlideDateTime, end: GlideDateTime): GlideDuration;

    /**
     * Gets the date and time value stored by the GlideDateTime object in the internal format, yyyy-MM-dd HH:mm:ss, and the system time zone, UTC by default. This method is equivalent to getValue().
     */
    toString(): void;


}

declare class GlideDate
{
    /**
     * Creates a GlideDate object with the current date time.
     */
    constructor();

    /**
     * Gets the date in the specified date format.
     * @param format the desired date format
     * @returns the date in the specified format
     */
    getByFormat(format: string): string;

    /**
     * Gets the day of the month stored by the GlideDate object, expressed in the UTC time zone.
     * @returns The day of the month in the UTC time zone, from 1 to 31.
     */
    getDayOfMonthNoTZ(): Number;

    /**
     * Gets the date in the current user's display format and time zone.
     * @returns The date in the user's format and time zone. Keep in mind when designing business rules or script includes that this method may return values in different formats for different users.
     */
    getDisplayValue(): string;

    /**
     * Gets the display value in the internal format (yyyy-MM-dd).
     * @returns The date values for the GlideDate object in the current user's time zone and the internal time format of yyyy-MM-dd.
     */
    getDisplayValueInternal(): string;

    /**
     * Gets the month stored by the GlideDate object, expressed in the UTC time zone.
     * @returns The numerical value of the month from 1 to 12.
     */
    getMonthNoTZ(): Number;

    /**
     * Gets the date value stored in the database by the GlideDate object in the internal format, yyyy-MM-dd, and the system time zone, UTC by default.
     * @returns The date value in the internal format and system time zone.
     */
    getValue(): string;

    /**
     * Gets the year stored by the GlideDate object, expressed in the UTC time zone.
     * @returns The numerical value of the year.
     */
    getYearNoTZ(): Number;

    /**
     * Sets a date value using the current user's display format and time zone.
     * @param asDisplayed The date in the current user's display format and time zone. The parameter must be formatted using the current user's preferred display format, such as yyyy-MM-dd.
     */
    setDisplayValue(asDisplayed: string): void;

    /**
     * Sets the date of the GlideDate object.
     * @param o The date and time to use.
     */
    setValue(o: string): void;

    /**
     * Gets the duration difference between two GlideDate values.
     * @param start The start value.
     * @param end The end value.
     * @returns The duration between the two values.
     */
    subtract(start: GlideDate, end: GlideDate): GlideDuration;
}

declare class GlideTime
{
    /**
     * Not fully documented yet.
     */
    constructor();
}

declare class GlideDuration
{
    /**
     * Not fully documented yet.
     */
    constructor();
}


declare class GlideQueryCondition
{
    /**
     * This class has no constructor.
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

declare class TemplatePrinter
{
    /**
     * no Constructor. Global variable available in mail scripts.
     */
    constructor();

    /**
     * Prints the string to the email body.
     * @param string
     */
    print(string: string): void;

    /**
     * Adds non-breaking spaces to the email body.
     * @param spaces 
     */
    space(spaces: number): void;
}

declare class GlideEmailOutbound
{
    constructor();

    /**
     * Adds the recipient to either the cc or bcc list
     * @param type Either cc or bcc, determines the list to which the address is added.
     * @param address The recipient's email address.
     */
    addAddress(type: string, address: string): void;

    /**
     * Adds the recipient to either the cc or bcc list, but uses the display name instead of the address when showing the recipient.
     * @param type Either cc or bcc, determines the list to which the address is added.
     * @param address The recipient's email address.
     * @param displayName The name to be shown instead of the email address.
     */
    addAddress(type: string, address: string, displayName: string): void;

    /**
     * Returns the email's subject line.
     */
    getSubject(): string;

    /**
     * Sets the body of the email.
     * @param bodyText 
     */
    setBody(bodyText: string): void;

    /**
     * Sets the sender's address.
     * @param address 
     */
    setFrom(address: string): void;

    /**
     * Sets the reply to address.
     * @param address 
     */
    setReplyTo(address: string): void;

    /**
     * Sets the email's subject line.
     * @param subject 
     */
    setSubject(subject: string): void;
}

declare class GlideSysAttachment
{
    /**
     * Creates a new instance of the GlideSysAttachment Class
     */
    constructor();

    /**
     * Copies attachments from the source record to the target record.
     * @param sourceTable Name of the table with the attachments to be copied.
     * @param sourceID The source table's sysID.
     * @param targetTable Name of the table to have the attachments added.
     * @param targetID The target table's sysID.
     */
    copy(sourceTable: string, sourceID: string, targetTable: string, targetID: string): Array<string>;

    /**
     * Deletes the specified attachment.
     * @param attachmentID 	The attachment's sysID.
     */
    deleteAttachment(attachmentID: string): void;

    /**
     * Returns the attachment content as a string.
     * @param sysAttachment The attachment record.
     * @returns The attachment contents as a string. Returns up to 5 MB of data.
     */
    getContent(sysAttachment: GlideRecord): string;

    /**
     * Returns the attachment content as a string with base64 encoding.
     * @param sysAttachment The attachment record.
     * @returns The attachment contents as a string with base64 encoding. Returns up to 5 MB of data.
     */
    getContentBase64(sysAttachment: GlideRecord): string;

    /**
     * Returns a GlideScriptableInputStream object given the sysID of an attachment.
     * @param sysID The attachment sysID.
     */
    getContentStream(sysID: string): GlideScriptableInputStream;

    /**
     * Inserts an attachment for the specified record.
     * @param record The record to which the attachment is to be attached.
     * @param fileName The attachment's file name.
     * @param contentType The attachment's content type.
     * @param content The attachment content.
     * @returns The attachment's sysID. Returns null if the attachment was not added.
     */
    write(record: GlideRecord, fileName: string, contentType: string, content: string): string;

    /**
     * Inserts an attachment for the specified record.
     * @param record The record to which the attachment is to be attached.
     * @param fileName The attachment's file name.
     * @param contentType The attachment's content type.
     * @param content The attachment content encoded in base64
     * @returns The attachment's sysID. 
     */
    writeBase64(record: GlideRecord, fileName: string, contentType: string, content_base64Encoded: string): string;

    /**
     * 
     * @param gr The record to which the attachment is to be attached.
     * @param fileName The attachment's file name.
     * @param contentType The attachment's content type.
     * @param inputStream The attachment content as a GlideScriptableInputStream
     * @returns The attachment's sysID. 
     */
    writeContentStream(gr: GlideRecord, fileName: string, contentType: string, inputStream: GlideScriptableInputStream): string;
}
declare class GlideScriptableInputStream
{
    /**
     * no constructor
     * not documented
     */
    constructor();
}

/**
 * Available in Server Scripts
 */
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

/**
 * Available in Scripted processors.
 */
// declare var g_processor: GlideScriptedProcessor;

/**
 * Available in Scripted processors.
 */
// declare var g_request: HttpServletRequest;

/**
 * Available in Scripted processors.
 */
// declare var g_response: HttpServletResponse;

/**
 * Available in Scripted processors.
 * @returns table name extracted from the uri. 
 */
declare var g_target: string

declare class GlideScriptedProcessor
{
    /**
     *Does not have an constructor. available via global variable: g_processor
     */
    constructor();

    /**
     * Redirects to the specified URL.
     * @param url 
     */
    redirect(url: string): void;

    /**
     * Encodes an object as a JSON string and writes it to the current URL.
     * @param o 
     */
    writeJSON(o: object): void;

    /**
     * Writes the specified string to the current URL in the specified character-encoding.
     * @param contentType Sets the content type of the response sent to the client, if the response has not been committed, and may include a character-encoding specification.
     * @param s The string to write.
     */
    writeOutput(contentType: string, s: string): void;

    /**
     * Writes the specified string to the current URL.
     * @param s The string to write.
     */
    writeOutput(s: string): void;
}

//only partly documented. many methods are restricted.
declare interface ServletResponse
{
    /**
     * Sets the content type of the response being sent to the client, if the response has not been committed yet.
     * @param type 
     */
    setContentType(type: String): void;
}
//only partly documented. many methods are restricted.
declare interface HttpServletResponse extends ServletResponse
{
    /**
     * Sends a temporary redirect response to the client using the specified redirect location URL.
     * @param location Url
     */
    sendRedirect(location: String): void;

    /**
     * Sets a response header with the given name and value.
     * @param name Header Name
     * @param value Header Value
     */
    setHeader(name: String, value: String): void;

    /**
     * Sets the status code for this response.
     * @param sc HTTP status code
     */
    setStatus(sc: Number): void;
}

//only partly documented. many methods are restricted.
declare interface ServletRequest
{
    /**
     *  Returns the MIME type of the body of the request, or null if the type is not known.
     */
    getContentType(): String;

    /**
     * Returns the value of a request parameter as a String, or null if the parameter does not exist.
     * @param name 
     */
    getParameter(name: String): String

    /**
     *  Returns an Enumeration of String objects containing the names of the parameters contained in this request.
     */
    getParameterNames(): Array<string>;
}

//only partly documented. many methods are restricted.
declare interface HttpServletRequest extends ServletRequest
{
    /**
     * Returns the value of the specified request header as a String.
     * @param name 
     */
    getHeader(name: String): String;

    /**
     * Returns an enumeration of all the header names this request contains.
     */
    getHeaderNames(): Array<String>;

    /**
     * Returns all the values of the specified request header as an Enumeration of String objects.
     * 
     * Some headers, such as Accept-Language can be sent by clients as several headers each with a different value rather than sending the header as a comma separated list.
     * @param name 
     */
    getHeaders(name: String): Array<String>;

    /**
     * Returns the query string that is contained in the request URL after the path.
     */
    getQueryString(): String;

}

declare namespace sn_ws_err
{
    /**
     * Indicates an error in the request, such as incorrect syntax.
     * 
     * status code: 400
     */
    class BadRequestError
    {
        constructor(message?: string);
    }

    /**
     * Indicates a requested resource is not available.
     * 
     * status code: 404
     */
    class NotFoundError
    {
        constructor(message?: string);
    }

    /**
     * Indicates the Accept header value passed in the request is incompatible with the web service.
     *      
     * status code: 406
     */
    class NotAcceptableErro
    {
        constructor(message?: string);
    }

    /**
     * Indicates that there is a conflict in the request, such as multiple conflicting updates.
     *      
     * status code: 409
     */
    class ConflictError
    {
        constructor(message?: string);
    }

    /**
     * Indicates the request media type is not supported by the web service.
     *      
     * status code: 415
     */
    class UnsuppotedMediaTypeError
    {
        constructor(message?: string);
    }

    /**
     * Used to create custom errors.
     * 
     * ```
var myError = new sn_ws_err.ServiceError();
myError.setStatus(418);
myError.setMessage("I am a Teapot");
myError.setDetail("Here are the details about this error");
response.setError(myError);
```
     */
    class ServiceError
    {
        constructor();

        /**
         * Set http status code.
         * @param status Http status code
         */
        setStatus(status: number): void;

        /**
         * Set error message
         * @param message message
         */
        setMessage(message: string): void;

        /**
         * Set error details
         * @param detail 
         */
        setDetail(detail: string): void;
    }


}

declare namespace sn_ws
{
    /**
     * No constructor, globally available in Scripted Rest Api scripts.
     */
    class RESTAPIRequest
    {
        /**
         * The body of the request.
         * 
         * The body of the request. You can access data from the body object using the RESTAPIRequestBody API.
         */
        body: RESTAPIRequestBody;

        /**
         * All headers from the request.
         * 
         * ```
var headers = request.headers; 
var acceptHeader = headers.Accept;
var myCustomHeader = headers.myCustom; 
var specialHeader = headers['spe ci-al'];
```
         */
        headers: object;

        /**
         * The path parameters passed in the request URI.
         *
         * ```
var pathParams = request.pathParams;
var tableName = pathParams.tableName;
var id = pathParams.id;
```
         */
        pathParams: object;

        /**
         * The query parameters from the web service request.
         * 
         * ```
var queryParams = request.queryParams; 
var isActiveQuery = queryParams.active;
var nameQueryVal = queryParams.name;
```
         */
        queryParams: Object;

        /**
         * The entire query added to the endpoint URI.
         */
        queryString: string;

        /**
         * The request URI, excluding domain information.
         */
        uri: string;

        /**
         * The entire request URL.
         */
        url: string;

        /**
         * Returns the value of a specific header from the web service request.
         * 
         * ```
var acceptHeader = request.getHeader('accept');
```
         * @param headerName 
         */
        getHeader(headerName: string): string;

        /**
         * Get the content types specified in the request Accept header.
         */
        getSupportedResponseContentTypes(): Array<string>;
    }

    /**
     * No constructor - available through RESTAPIRequest
     */
    class RESTAPIRequestBody
    {
        /**
         * The content of the request body.'
         * 
         * ```
var requestData = requestBody.data;
if (requestData instanceof Array) { 
 entry = requestData[0].name;
 id = requestData[0].id;
}
```
         */
        data: Object | Array<Object>

        /**
         * The content of the request body, as a stream.
         */
        dataStream: object;

        /**
         * The content of the request body, as a String.
         */
        dataString: string;

        /**
         * Determine if there are additional entries in the request body.
         * 
         * Use this method with the nextEntry() method to iterate over multiple request body entries.
         */
        hasNext(): boolean;

        /**
         * Retrieve one entry from the request body as a script object.
         * 
         * Use this method with the hasNext() method to iterate over multiple request body entries.
         * ```
var requestBody = request.body;
while(requestBody.hasNext()){
var entry = requestBody.nextEntry();
}
```
         */
        nextEntry(): Object;
    }

    /**
     * No Constructor - Available through scripted rest apis.
     */
    class RESTAPIResponse
    {
        /**
         * Get the ResponseStreamWriter for this response, allowing you to write directly to the response stream.
         */
        getStreamWriter(): RESTAPIResponseStream;

        /**
         * Sets the body content to send in the web service response.
         * 
         * Object in body is automatically serialized to JSON or XML based on the Accept header. 
         * @param body The response body, as a JavaScript object.
         */
        setBody(body: object): void;

        /**
         * Assigns a value to the Content-Type header in the web service response.
         * 
         * You must set a response content type before writing the response. The content type is set automatically for string responses, based on the request Accept header value.
         * 
         * Setting an invalid content type causes the response to default to JSON. Failing to set a content type results in a status code 500 error when sending a binary response.
         * @param contentType 
         */
        setContentType(contentType: string): void;

        /**
        * Configure the response to return an error.
        * @param error An error object.
        */
        setError(error: object): void;

        /**
         * Assign a value to a REST service response header.
         * @param header The header you want to set.
         * @param value The value to assign the specified header.
         */
        setHeader(header: string, value: string): void;

        /**
         * Sets the headers for the web service response.
         * 
         * 
         * ```
var headers = {};
headers.X-Total-Count=100;
headers.Location='https://instance.service-now.com/<endpoint_to_resource>';
response.setHeaders(headers);
```
         * @param headers A JavaScript object listing each header and the value to assign that header.
         */
        setHeaders(headers: Object): void;

        /**
         * Assigns a value to the Location header in the web service response.
         * @param location 
         */
        setLocation(location: string): void;

        /**
         * Sets the status code number for the web service response.
         * @param status 
         */
        setStatus(status: number): void;
    }

    /**
     * No Constructor - Available through scripted rest apis.
     */
    class RESTAPIResponseStream
    {
        /**
         * Write an input stream to the response stream.
         * 
         * You must set the content type and status code before calling the writeStream() method or the response will fail. You cannot modify these values after calling the writeStream() method.
         * ```
response.setContentType('application/json');
response.setStatus(200);
var writer = response.getStreamWriter();
writer.writeStream(attachmentStream);
```
         * @param stream An attachment or a response stream from a third-party service.
         */
        writeStream(stream: object): void;

        /**
         * Write string data to the response stream.
         * 
         * You must set the content type and status code before calling the writeString() method or the response will fail. 
         * 
         * You cannot modify these values after calling the writeString() method.
         * @param data The string to add to the response data.
         */
        writeString(data: string): void;
    }
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

/* SN SP SERVERSIDE */

/**
 * Available in Widget Server script
 */
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

    /**
     * Returns KB articles in the specified category and its subcategories.
     * 
     * To avoid performance issues, do not use this method to return articles in large categories or articles with inline images. Instead, use getKBArticleSummaries().
     * @param sys_id Sys_id of the KB article category.
     * @param limit Maximum number of KB articles returned.
     * @returns The articles within the category and its subcategories with: A workflow_state of published and a valid_to date greater than or equal to the current date.
     */
    getKBCategoryArticles(sys_id: string, limit: number): Array<object>;

    /**
     * Returns Knowledge Base article summaries in the specified category and its subcategories.
     * @param sys_id Sys_id of the KB article category.
     * @param limit Maximum number of KB articles returned.
     * @param maxChars Maximum number of characters to return from the article text. For full article text, set the value to -1.
     */
    getKBCategoryArticleSummaries(sys_id: string, limit: number, maxChars: number): Array<object>;

    /**
     * Returns the number of articles in the defined Knowledge Base.
     * @param sys_id Sys_id of a Knowledge Base record.
     */
    getKBCount(sys_id: string): number;

    /**
     * Returns a list of the specified table's columns in the specified view.
     * @param tableName Name of the table
     * @param view The view by which to filter the columns
     */
    getListColumns(tableName: string, view: string): object;

    /**
     * Returns the (?id=) portion of the URL based on the sp_menu type.
     * 
     * @param page 
     */
    getMenuHREF(page: GlideRecord): string;

    /**
     * Returns an array of menu items for the specified instance.
     * @param sysId 	sysId of the instance
     */
    getMenuItems(sysId: string): Array<object>;

    /**
     * Returns the value of the specified parameter.
     * @param name The name of the key from the query string or post body.
     * @returns Returns the specified parameter as an object. Returns null if there is no request, JSON request, or widget.
     */
    getParameter(name: string): object;

    /**
     * Returns the portal's GlideRecord.
     */
    getPortalRecord(): GlideRecord;

    /**
     * Returns the current portal context.
     */
    getRecord(): GlideRecord;

    /**
     * Copies display values for the specified fields into the data parameter.
     * @param data The display values for the specified fields are copied to this object.
     * @param from The GlideRecord to process.
     * @param names A comma-separated list of field names.
     */
    getRecordDisplayValues(data: object, from: GlideRecord, names: string): void;

    /**
     * For the specified fields, copies the element's name, display value, and value into the data parameter.
     * @param data The display values for the specified fields are copied to this object.
     * @param from The GlideRecord to process.
     * @param names A comma-separated list of field names.
     */
    getRecordElements(data: object, from: GlideRecord, names: string): void;

    /**
     * Copies values for the specified field names from the GlideRecord into the data parameter.
     * @param data 
     * @param from 
     * @param names 
     */
    getRecordValues(data: object, from: GlideRecord, names: string): void;

    /**
     * Returns an array of Service Catalog variables associated with a record.
     * @param gr The record to retrieve Service Catalog variables for. Must be a record with Service Catalog variables defined, such as a requested item [sc_req_item] record or an incident submitted through a record producer.
     * @param includeNilResponses 	Optional parameter. If true, variables with no user-defined value are included in the array.
     */
    getRecordVariablesArray(gr: GlideRecord, includeNilResponses?: boolean): Array<object>;

    /**
     * Gets the activity stream for the specified record. This method works on tables that extend the task table.
     * 
     * **Note** The user_login property contains the User ID of the current user. The user_sys_id and iser_full_name properties reference the creator of the queried record.
     * @param table The table name
     * @param sysId The sys_id of the record
     * @returns If a table extending the task table is specified, contains the display_value, sys_id, short_description,number, entries, user_sys_id, user_full_name, user_login, label, table, and journal_fields properties; otherwise contains the table and sys_id properties.
     */
    getStream(table: string, sysId: string): object;

    /**
     * Returns the user's initials.
     */
    getUserInitials(): string;

    /**
     * Returns the value of the specified parameter.
     * @param name 	Name of the parameter
     * @returns Value of the specified parameter. Null if the request does not exist or has no such parameter, the rectangle does not exist or has no such parameter, or the portal is null or has no such parameter.
     */
    getValue(name: string): object;

    /**
     * Copies values from the request or instance to the data parameter.
     * @param data Receives the parameter values.
     * @param names Comma-separated string of field names.
     */
    getValues(data: object, names: string): void;

    /**
     * Gets a widget by id or sys_id, executes that widget's server script using the provided options, then returns the widget model.
     * @param sysID The widget sys_id or widget_id
     * @param options An object to pass to the widget's server script. Refer to this object as options in your server script.
     * @returns A widget model to be used with sp-widget.
     */
    getWidget(sysID: string, options: object): object;

    /**
     * Transforms a URL requesting a list or form in the platform UI into the URL of the corresponding id=list or id=form Service Portal page.
     * 
     * Use this method to perform tasks such as redirecting a user after login to the correct Service Portal page when they request a platform UI form or list URL. Note that the id=list and id=form page targets are not customizable.
     * 
     * **Note**: Table, sys_id, and sysparm_query values are preserved from the original URL; sysparm_view is not.
     * @param url Platform UI URL
     */
    mapUrlToSPUrl(url: string): string;
}

/* CLIENT ANGULAR */

/**
 * Angular DI service
 */
declare var spModal: SpModal;

declare class SpModal
{
    /**
     * available via angular di as spModal
     */
    constructor()

    /**
     * Displays an alert.
     * @param message Message to show
     */
    alert(message: string): Promise<any>;

    /**
     * Displays a confirmation message.
     * @param message message to show
     */
    confirm(message: string): Promise<any>;

    /**
     * Opens a modal window using the specified options.
     * @param options 
     */
    open(options: SpModalOptions): Promise<any>;

    /**
     * Displays a prompt for user input.
     * @param message message to show.
     * @param defaultValue optional default value.
     */
    prompt(message: string, defaultValue?: string): Promise<any>;
}

/**
 * spModal options object, available options for using spModal.
 */
declare class SpModalOptions
{
    /**
     *  a string that can be HTML that goes in the header. The default is empty.
     */
    title: string;
    /** 
     * a string that can be HTML that goes in the header. The default is empty.
     */
    message: string;

    /**
     * an array that contains the buttons to show on the dialog. The default is Cancel and OK.
     */
    buttons: Array<string>;

    /**
     * a Boolean. When true shows an input field on the dialog. The default is false.
     */
    input: boolean;

    /**
     * a string containing the value of the input field. The default is empty.
     */
    value: string;

    /**
     * a string that identifies the widget ID or sys_id to embed in the dialog. The default is empty.
     */
    widget: string;

    /**
     * an object to send the embedded widget as input. The default is null.
     */
    widgetInput: object;

    /**
     * a client-side object to share data with the embedded widget client script.
     */
    shared: object;

    /**
     * a string indicating the size of the window. Can be 'sm' or 'lg'. The default is empty.
     */
    size: string;
}

/* CLIENT ANGULAR */

/**
 * Angular DI service
 */

declare var spUtil: SpUtil;

declare class SpUtil
{
    /**
    * Displays a notification error message.
    * @param message Error message to display.
    */
    addErrorMessage(message: string): void

    /**
     * Displays a notification info message.
     * @param message Info message to display
     */
    addInfoMessage(message: string): void

    /**
     * Displays a trivial notification message. 
     * Trivial messages disappear after a short period of time.
     * @param message Message to display.
     */
    addTrivialMessage(message: string): void

    /**
     * Formats a string as an alternative to string concatenation.
     * Use this method to build a string with variables.
     * @param template String template with values for substitution.
     * @param data Object containing variables for substitution.
     * @returns A formatted string.
     * 
     * @example spUtil.format('An error ocurred: {error} when loading {widget}', {error: '404', widget: 'sp-widget'})
     */
    format(template: string, data: Object): string

    /**

     * Returns a widget model by ID or sys_id.
     * Use this method to embed a widget model in a widget client script.
     * The callback function returns the full widget model.

     * @param widgetId Widget ID or sys_id of the widget to embed.
     * @param data (Optional) Name/value pairs of parameters to pass to the widget model.
     * @returns Model of the embedded widget.
     */
    get(widgetId: string, data?: Object): Object

    /**
    * Watches for updates to a table or filter and returns the value from the callback function.
    *
    * Allows a widget developer to respond to table updates in real-time. For instance, by using recordWatch(), the Simple List widget can listen for changes to its data table. If records are added, removed, or updated, the widget updates automatically.
    *
    * When passing the $scope argument into the recordWatch() function, be sure to inject $scope into the parameters of your client script function.
    *
    * Tables that are periodically subject to a high frequency of database events are blacklisted from recordWatch() to prevent event storms.
     * 
     * @param $Scope Scope of the data object updated by the callback function.
     * @param table Watched table.
     * @param filter Filter for fields to watch.
     * @param callback Optional. Parameter to define the callback function.
     * @returns Return value of the callback function.
     */
    recordWatch($Scope: Object, table: string, filter: string, callback?: Function): Promise<any>

    /**
     * Calls the server and replaces the current options and data with the server response.
     * Calling spUtil.refresh() is similar to calling server.refresh(). However, when you call spUtil.refresh(), you can define the $scope object.
     * 
     * @param $Scope The scope defined for the update.
     * @returns The updated options and data objects.
     */
    refresh($Scope: Object): Object

    /**
     * Updates the data object on the server within a given scope.
     * 
     * This method is similar to server.update(), but includes a $scope parameter that defines the scope to pass over.
     * @param $Scope The scope defined for the update.
     * @returns The updated data object.
     */
    update($Scope: Object): Object

    /**
     * Gets portal headers
     * UNDOCUMENTED BY SERVICENOW
     * @returns {'Accept': 'application/json',  'x-portal': $rootScope.portal_id};
     * 
     */
    getHeaders(): Object

    /**
     * 
     * @param sys_id sys_id of the widget
     * @retuns /api/now/sp/widget/sys_id
     */
    getWidgetURL(sys_id: string): string
    /**
     * 
     * @param searchPage Search 
     * @example spUtil.setSearchPage($scope.data.t);//t is a string passed via url here
     */
    setSearchPage(searchPage: string): void

    /**
     * 
     * @param $Scope 
     * @param list 
     * @example spUtil.setBreadCrumb($scope, [{
        label: c.data.community.Breadcrumb,
        url: '#'
     }])
     */
    setBreadCrumb($Scope: Object, list: []): void

    /**
     * 
     * @param type 
     * Example var url = spUtil.getURL({sysparm_type: 'view_form.login'});
     */
    getURL(type: Object): string

    /**
     * 
     * @param id id of element to scroll to
     * @param time Time to take
     * @example spUtil.scrollTo("#" + item.sys_id);
     */
    scrollTo(id: string, time?: number): void
    /**
     * 
     * @param character character to get accelerator of
     * @example spUtil.getAccelerator('s');
     * @returns returns for mac '⌘ + ' + char;  returns for otherwise 'Ctrl + ' + char;
     */
    getAccelerator(character: string): string

    /**
     * Create UID
     * @param str string to create UID from
     * @example spUtil.createUid('xxxxx');
     */
    createUid(str: string): string
    /**
     * Parse attributes from String to Object
     * @param attributes Attributes in string form
     * @example var attributes = spUtil.parseAttributes(field.attributes);
        refQualElements = attributes['ref_qual_elements'].split(',');
     * @returns Attributed Object
     */
    parseAttributes(attributes: string): Object

    /**
     * Gets the host
     * @returns host as a string
     */
    getHost(): string
}


/**
 * Angular DI service
 */
declare var $q: $Q;
declare class $Q
{
    /**
      *  available via angular DI as $q.
      */
    constructor();

    /**
     * @returns The newly created promise.
     */
    defer(): Promise<any>;

    /**
     * Creates a promise that is resolved as rejected with the specified reason. This api should be used to forward rejection in a chain of promises. 
     * 
     * If you are dealing with the last promise in a promise chain, you don't need to worry about it.
     * 
     * 
     * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of reject as the throw keyword in JavaScript. 
     * This also means that if you "catch" an error via a promise error callback and you want to forward the error to the promise derived from the current promise, you have to "rethrow" the error by returning a rejection constructed via reject.
     * 
     * @param reason Constant, message, exception or an object representing the rejection reason.
     */
    reject(reason: object): object;

    /**
     * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise. This is useful when you are dealing with an object that might or might not be a promise, or if the promise comes from a source that can't be trusted.
     * @param value Value or a promise
     * @param successCallback callback
     * @param errorCallback callback
     * @param progressCallback callback
     */
    when(value: object, successCallback?: Function, errorCallback?: Function, progressCallback?: Function): Promise<any>;

    /**
     * Alias of when to maintain naming consistency with ES6.
     * @param value Value or a promise
     * @param successCallback callback
     * @param errorCallback callback
     * @param progressCallback callback 
     */
    resolve(value: object, successCallback?: Function, errorCallback?: Function, progressCallback?: Function): Promise<any>;

    /**
     * Combines multiple promises into a single promise that is resolved when all of the input promises are resolved.
     * @param promises An array or hash of promises.
     */
    all(promises: Array<Promise<any>>): Promise<any>;

    /**
     * Returns a promise that resolves or rejects as soon as one of those promises resolves or rejects, with the value or reason from that promise.
     * @param promises An array or hash of promises.
     */
    race(promises: Array<Promise<any>>): Promise<any>;
}

declare class Controller
{
    /**
     * available in widget client script as this. add @type for intellisense
     */
    constructor();
    server: Server;
}

declare class Server
{
    /**
     * available via the controlle class
     */
    constructor();

    /**
     * Calls the server and sends custom input.
     * @param Object Custom input object
     */
    get(Object?: object): Promise<any>;

    /**
     * Calls the server and posts this.data to the server script. Returns Promise.
     */
    update(): Promise<any>;

    /**
     * Calls the server and automatically replaces the current options and data from the server response. Returns Promise.
     */
    refresh(): Promise<any>;
}

/**
 * Angular DI service
 */
declare var $location: $Location;

declare class $Location
{
    /**
     * availabe via Angualr DI
     */
    constructor();

    /**
     * This method is getter only.
     * Return full URL representation with all segments encoded according to rules specified in RFC 3986.
     * 
     *  ```javascript
      var absUrl = $location.absUrl();
      // => "http://example.com/#/some/path?foo=bar&baz=xoxo"
      ```
     */
    absUrl(): string;

    /**
     * This method is getter / setter.
     * Return URL (e.g. /path?a=b#hash) when called without any parameter.
     * Change path, search and hash, when called with parameter and return $location.
     * 
     *  ```javascript
     var url = $location.url();
     // => "/some/path?foo=bar&baz=xoxo"
     ```
     * @param url New URL without base prefix
     */
    url(url?: string): string;

    /**
     * This method is getter only.
     * Return protocol of current URL.
     * 
     * ```javascript
      var protocol = $location.protocol();
      // => "http"
     * ```
     */
    protocol(): string;

    /**
     * This method is getter only.
     * Return host of current URL.
     * **Note:** compared to the non-AngularJS version location.host which returns hostname:port, this returns the hostname portion only.
     * 
     * ```javascript
      host = $location.host();
      // => "example.com"
      ```
     */
    host(): string;

    /**
     * This method is getter only.
     * Return port of current URL.
     * 
     * ```javascript
      var port = $location.port(); 
      // => 80
      ```
     */
    port(): number;

    /**
     * This method is getter / setter.
     * Return path of current URL when called without any parameter.
     * Change path when called with parameter and return $location.
     * **Note:** Path should always begin with forward slash (/), this method will add the forward slash if it is missing.
     * ```javascript
        var path = $location.path();
        // => "/some/path"
        ```
     * 
     * @param path New path
     */
    path(path?: string | number): string | object;

    /**
     * This method is getter / setter.
     * Return search part (as object) of current URL when called without any parameter.
     * Change search part when called with parameter and return $location.
     * 
     * ```javascript
      var searchObject = $location.search();
      // => {foo: 'bar', baz: 'xoxo'}

      $location.search('foo', 'yipee');
      // $location.search() => {foo: 'yipee', baz: 'xoxo'}
    ```
     * 
     * @param search New search params - string or hash object. When called with a single argument the method acts as a setter, setting the search component of $location to the specified value. If the argument is a hash object containing an array of values, these values will be encoded as duplicate search parameters in the URL.
     * @param paramValue If search is a string or number, then paramValue will override only a single search property. If paramValue is an array, it will override the property of the search component of $location specified via the first argument. If paramValue is null, the property specified via the first argument will be deleted. If paramValue is true, the property specified via the first argument will be added with no value nor trailing equal sign.
     * @returns If called with no arguments returns the parsed search object. If called with one or more arguments returns $location object itself.
     */
    search(search: string | Array<string> | object, paramValue?: string | Number | Array<string> | boolean): object;

    /**
     * This method is getter / setter.
     * Returns the hash fragment when called without any parameters.
     * Changes the hash fragment when called with a parameter and returns $location.
     * @param hash New hash fragment
     */
    hash(hash?: string | number): string;

    /**
     * If called, all changes to $location during the current $digest will replace the current history record, instead of adding a new one.
     */
    replace(): void;

    /**
     * This method is getter / setter.
     * Return the history state object when called without any parameter.
     * Change the history state object when called with one parameter and return $location. The state object is later passed to pushState or replaceState.
     * **NOTE:** This method is supported only in HTML5 mode and only in browsers supporting the HTML5 History API (i.e. methods pushState and replaceState). If you need to support older browsers (like IE9 or Android < 4.0), don't use this method.
     * @param state State object for pushState or replaceState
     */
    state(state?: object): object;
}

/**
 * Angular DI service
 */
declare var $http: $Http;

/**
 * angualar $https Directive.
 */
declare class $Http
{
    /**
     *  available via angular DI as $http. 
     */
    constructor();

    /**
     * Shortcut method to perform GET request
     * @param url url
     * @param config options
     */
    get(url: string, config?: object): Promise<object>;

    delete(url: string, config?: object): Promise<object>;

    head(url: string, config?: object): Promise<object>;

    /**
     * Shortcut method to perform JSONP request.
     * 
     * **Note** that, since JSONP requests are sensitive because the response is given full access to the browser, the url must be declared, via $sce as a trusted resource URL. You can trust a URL by adding it to the whitelist via $sceDelegateProvider.resourceUrlWhitelist or by explicitly trusting the URL via $sce.trustAsResourceUrl(url).
     * 
     * You should avoid generating the URL for the JSONP request from user provided data. Provide additional query parameters via params property of the config parameter, rather than modifying the URL itself.
     * 
     * JSONP requests must specify a callback to be used in the response from the server. This callback is passed as a query parameter in the request. You must specify the name of this parameter by setting the jsonpCallbackParam property on the request config object.
     * @param url
     * @param config options
     */
    jsonp(url: string, config?: object): Promise<object>;

    post(url: string, data: object, config?: object): Promise<object>;

    put(url: string, data: object, config?: object): Promise<object>;

    patch(url: string, data: object, config?: object): Promise<object>;

}

/**
 * Angular DI service
 */
declare var $scope: $Scope;
declare class $Scope
{
    /**
     *Does not have an constructor. available via global variable: $scope
     */
    constructor();

    /**
     * Creates a new child scope.
     * 
     * The parent scope will propagate the $digest() event. The scope can be removed from the scope hierarchy using $destroy().
     * 
     * $destroy() must be called on a scope when it is desired for the scope and its child scopes to be permanently detached from the parent and thus stop participating in model change detection and listener notification by invoking.
     * @param isolate If true, then the scope does not prototypically inherit from the parent scope. The scope is isolated, as it can not see parent scope properties. When creating widgets, it is useful for the widget to not accidentally read parent state.
     * @param parent The Scope that will be the $parent of the newly created scope. Defaults to this scope if not provided. This is used when creating a transclude scope to correctly place it in the scope hierarchy while maintaining the correct prototypical inheritance.
     */
    $new(isolate: boolean, parent: $Scope): $Scope;

    /**
     * Registers a listener callback to be executed whenever the watchExpression changes.
     * * The watchExpression is called on every call to $digest() and should return the value that will be watched. (watchExpression should not change its value when executed multiple times with the same input because it may be executed multiple times by $digest(). That is, watchExpression should be idempotent.)
     * * The listener is called only when the value from the current watchExpression and the previous call to watchExpression are not equal (with the exception of the initial run, see below). Inequality is determined according to reference inequality, strict comparison via the !== Javascript operator, unless objectEquality == true (see next point)
     * * When objectEquality == true, inequality of the watchExpression is determined according to the angular.equals function. To save the value of the object for later comparison, the angular.copy function is used. This therefore means that watching complex objects will have adverse memory and performance implications.
     * * This should not be used to watch for changes in objects that are (or contain) File objects due to limitations with angular.copy.
     * * The watch listener may change the model, which may trigger other listeners to fire. This is achieved by rerunning the watchers until no changes are detected. The rerun iteration limit is 10 to prevent an infinite loop deadlock.
     * 
     * If you want to be notified whenever $digest is called, you can register a watchExpression function with no listener. (Be prepared for multiple calls to your watchExpression because it will execute multiple times in a single $digest cycle if a change is detected.)
     * 
     * After a watcher is registered with the scope, the listener fn is called asynchronously (via $evalAsync) to initialize the watcher. In rare cases, this is undesirable because the listener is called when the result of watchExpression didn't change. To detect this scenario within the listener fn, you can compare the newVal and oldVal. If these two values are identical (===) then the listener was called due to initialization.
     * @param watchExpression Expression that is evaluated on each $digest cycle. A change in the return value triggers a call to the listener.
     * @param listener Callback called whenever the value of watchExpression changes.
     * @param objectEquality Compare for object equality using angular.equals instead of comparing for reference equality.
     * @returns Returns a deregistration function for this listener.
     */
    $watch(watchExpression: Function | string, listener: Function, objectEquality?: boolean): Function;

    /**
     * A variant of $watch() where it watches an array of watchExpressions. If any one expression in the collection changes the listener is executed.
     *  * The items in the watchExpressions array are observed via the standard $watch operation. Their return values are examined for changes on every call to $digest.
     *  * The listener is called whenever any expression in the watchExpressions array changes.
     * @param watchExpressions Array of expressions that will be individually watched using $watch()
     * @param listener Callback called whenever the return value of any expression in watchExpressions changes The newValues array contains the current values of the watchExpressions, with the indexes matching those of watchExpression and the oldValues array contains the previous values of the watchExpressions, with the indexes matching those of watchExpression The scope refers to the current scope.
     * @returns Returns a de-registration function for all listeners.
     */
    $watchGroup(watchExpressions: Array<Function | string>, listener: Function): Function;

    /**
     * Shallow watches the properties of an object and fires whenever any of the properties change (for arrays, this implies watching the array items; for object maps, this implies watching the properties). If a change is detected, the listener callback is fired.
     * * The obj collection is observed via standard $watch operation and is examined on every call to $digest() to see if any items have been added, removed, or moved.
     * * The listener is called whenever anything within the obj has changed. Examples include adding, removing, and moving items belonging to an object or array.
     * @param obj Evaluated as expression. The expression value should evaluate to an object or an array which is observed on each $digest cycle. Any shallow change within the collection will trigger a call to the listener.
     * @param listener a callback function called when a change is detected.
     */
    $watchCollection(obj: Function | string, listener: Function): Function;

    /**
     * Processes all of the watchers of the current scope and its children. Because a watcher's listener can change the model, the $digest() keeps calling the watchers until no more listeners are firing. 
     * This means that it is possible to get into an infinite loop. This function will throw 'Maximum iteration limit exceeded.' if the number of iterations exceeds 10.
     * 
     * Usually, you don't call $digest() directly in controllers or in directives. Instead, you should call $apply() (typically from within a directive), which will force a $digest().
     * If you want to be notified whenever $digest() is called, you can register a watchExpression function with $watch() with no listener.
     * In unit tests, you may need to call $digest() to simulate the scope life cycle.
     */
    $digest(): void;

    /**
     * Suspend watchers of this scope subtree so that they will not be invoked during digest.
     * This can be used to optimize your application when you know that running those watchers is redundant.
     * 
     * **Warning**
     * 
     * Suspending scopes from the digest cycle can have unwanted and difficult to debug results. Only use this approach if you are confident that you know what you are doing and have ample tests to ensure that bindings get updated as you expect.
     * 
     * Some of the things to consider are:
     * * Any external event on a directive/component will not trigger a digest while the hosting scope is suspended - even if the event handler calls $apply() or $rootScope.$digest()
     * * Transcluded content exists on a scope that inherits from outside a directive but exists as a child of the directive's containing scope. If the containing scope is suspended the transcluded scope will also be suspended, even if the scope from which the transcluded scope inherits is not suspended
     * * Multiple directives trying to manage the suspended status of a scope can confuse each other:
     * * * A call to $suspend() on an already suspended scope is a no-op.
     * * * A call to $resume() on a non-suspended scope is a no-op.
     * * * If two directives suspend a scope, then one of them resumes the scope, the scope will no longer be suspended. This could result in the other directive believing a scope to be suspended when it is not.
     * * If a parent scope is suspended then all its descendants will be also excluded from future digests whether or not they have been suspended themselves. Note that this also applies to isolate child scopes.
     * * Calling $digest() directly on a descendant of a suspended scope will still run the watchers for that scope and its descendants. When digesting we only check whether the current scope is locally suspended, rather than checking whether it has a suspended ancestor.
     * * Calling $resume() on a scope that has a suspended ancestor will not cause the scope to be included in future digests until all its ancestors have been resumed.
     * * Resolved promises, e.g. from explicit $q deferreds and $http calls, trigger $apply() against the $rootScope and so will still trigger a global digest even if the promise was initiated by a component that lives on a suspended scope.
     */
    $suspend(): void;

    /**
     * 
     * @param name Event name to listen on.
     * @param listener Function to call when the event is emitted.
     */
    $on(name: string, listener: Function): Function;

    /**
     * Dispatches an event name upwards through the scope hierarchy notifying the registered $rootScope.Scope listeners.
     * 
     * The event life cycle starts at the scope on which $emit was called. All listeners listening for name event on this scope get notified.
     * Afterwards, the event traverses upwards toward the root scope and calls all registered listeners along the way. The event will stop propagating if one of the listeners cancels it.
     * 
     * Any exception emitted from the listeners will be passed onto the $exceptionHandler service.
     * @param name Event name to emit.
     * @param args Optional one or more arguments which will be passed onto the event listeners.
     * @returns Event Object
     */
    $emit(name: string, args?: object): object

    /**
     * Dispatches an event name downwards to all child scopes (and their children) notifying the registered $rootScope.Scope listeners.
     * 
     * The event life cycle starts at the scope on which $broadcast was called. 
     * All listeners listening for name event on this scope get notified. Afterwards, the event propagates to all direct and indirect scopes of the current scope and calls all registered listeners along the way. 
     * The event cannot be canceled.
     * 
     * Any exception emitted from the listeners will be passed onto the $exceptionHandler service.
     * @param name Event name to broadcast.
     * @param args Optional one or more arguments which will be passed onto the event listeners.
     */
    $broadcast(name: string, args: object): object
}

/* SN CLIENT SIDE */

declare class GlideAjax
{
    /**
     * 
     * @param class_name The name of the server-side class that contains the method you want to execute.
     */
    constructor(class_name: string);

    /**
     * Specifies a parameter name and value to be passed to the server-side function associated with this GlideAjax object.
     * 
     * **Note** The first call to addParam should be with the parameter sysparm_name and the name of the server-side method you want to call. The server-side code does not execute until the client script calls getXML().
     * @param parameter 
     * @param value 
     */
    addParam(parameter: string, value: string): void;

    /**
     * Sends the server a request to execute the method and parameters associated with this GlideAjax object.
     * The server processes the request asynchronously and -- when ready -- returns the results via the function specified as the callback_function.
     * @param callback 
     */
    getXML(callback: Function): void;

    /**
     * Call the processor asynchronously and get the answer element of the response in XML format.
     * @param callback 
     */
    getXMLAnswer(callback: Function): void

}