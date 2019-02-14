// Function to remove double quoutes before building JSON
function clean(text)
{
	return text.replace(/"/g, "'");
}
function escape(value) {
	return value
		.replace(/[\"]/g, '\\"')
		.replace(/[\\]/g, '\\\\')
		.replace(/[\/]/g, '\\/')
		.replace(/[\b]/g, '\\b')
		.replace(/[\f]/g, '\\f')
		.replace(/[\n]/g, '\\n')
		.replace(/[\r]/g, '\\r')
		.replace(/[\t]/g, '\\t')
		.replace(/\\'/g, "\\'")
	;
}


var lang = gs.getSession().getLanguage(); // puts the user's current language in a variable
gs.getSession().setLanguage("da"); // sets the session language danish

/* Has to blank errors from these non-mandatory categories, as they may be null or undefined */
var thisu_sp_bs_service = blankError(current, 'u_sp_bs_service');
var thisu_sp_bs_category = blankError(current, 'u_sp_bs_category');
var thisu_sp_bs_subcategory = blankError(current, 'u_sp_bs_subcategory');
var thisu_sp_bsproces = blankError(current,'u_sp_bsproces');

function blankError(thisCurrent, thisField) {
	var temp = '';
	try {
		temp = thisCurrent.getDisplayValue(thisField);
		if(temp == null){
			temp = '';
		}
	} catch(e) {
		// TODO: Put something here
		var temp = '';
	}
	return temp;
}

// Start the JSON Data:
template.print('#JSON_START#\n{\n');
template.print('"createdBy": "'+clean(current.sys_created_by)+'",\n');
template.print('"affectedUser": {\n');

// Populate all Affected user fields and add to JSON
var gr = new GlideRecord('sys_user');
gr.addQuery('sys_id', current.caller_id);
gr.query();
// If Caller:
if (gr.next()) {
	template.print('"id": "'+clean(gr.user_name)+'",\n' + '"name": "' + clean(gr.first_name) +' '+ clean(gr.last_name) +'",\n' + '"position": "' + clean(gr.title) + '",\n' + '"phone": "' + clean(gr.phone) + '",\n' + '"mobile": "' + clean(gr.mobile_phone) + '",\n');
}
else{
	template.print('"id": "",\n' + '"name": "",\n' + '"position": "",\n' + '"phone": "",\n' + '"mobile": "",\n');
}
var gr2 = new GlideRecord("cmn_department");
gr2.addQuery("sys_id", gr.department);
gr2.query();
// If Caller has department:
if (gr2.next()) {
	template.print('"department": "' + clean(gr2.u_department.getDisplayValue()) + '",\n' + '"room": "' + clean(gr.u_room_number) + '",\n' + '"street": "' + clean(gr2.u_department_street) + '",\n' + '"postcalCode": "' + clean(gr2.u_postal_code) + '",\n' + '"city": "' + clean(gr2.u_city)+'"\n}\n,');
}
else{
	template.print('"department": "",\n' + '"room": "",\n' + '"street": "",\n' + '"postcalCode": "",\n' + '"city": ""\n}\n,');
}

// Continue the population of data to JSON
template.print('"system": "'+clean(current.cmdb_ci.name)+'",\n');
template.print('"bankdataPriority": "'+clean(current.u_bankdata_prioritet)+'",\n');
template.print('"functionalServicedesk": "' + clean(escape(current.getDisplayValue('u_sp_servicedesk'))) +'",\n');
template.print('"procesNumber": "' + clean(escape(thisu_sp_bsproces)) +'",\n');
template.print('"functionalServicedeskService": "' + clean(escape(thisu_sp_bs_service)) +'",\n');
template.print('"functionalServicedeskCategory": "' + clean(escape(thisu_sp_bs_category)) +'",\n');
template.print('"functionalServicedeskSubcategory": "' + clean(escape(thisu_sp_bs_subcategory)) +'",\n');
template.print('"title": "'+clean(escape(current.short_description))+'",\n');
template.print('"problem": "'+clean(escape(current.description))+'",\n');
template.print('"contactedServicedesk": "'+clean(current.u_bankdata_servicedesk)+'",\n');
template.print('"lastWorking": "'+clean(current.u_when_did_it_last_work)+'",\n');
template.print('"workaround": "'+clean(current.u_are_there_any_workarounds)+'",\n');
template.print('"repeatableError": "'+clean(current.u_can_the_error_be_repeated)+'",\n');
template.print('"errorOccuredBefore": "'+clean(current.u_has_the_error_occured_before)+'",\n');
var notes = current.u_leverandor_info.getJournalEntry(-1);
var na = notes.split("\n\n");
var comment =na[0];
template.print('"comments": "'+clean(comment)+'"\n');

// End the JSON Data:
template.print('}\n#JSON_END#');
