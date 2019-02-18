(function () {
    var gr = $sp.getRecord();
    data.canRead = gr.canRead();
    if (!data.canRead)
        return;

    var agent = "";
    var a = $sp.getField(gr, 'assigned_to');
    if (a != null)
        agent = a.display_value;

    var fields = $sp.getFields(gr, 'number,state,due_date');
    if (gr.getValue("sys_mod_count") > 0)
        fields.push($sp.getField(gr, 'sys_updated_on'));

    //if (gr.getValue('u_user') > 0)
    //fields.push($sp.getField(gr, 'opened_for'));

    if (gr.getValue('due_date') > 0)
        fields.push($sp.getField(gr, 'due_date'));


    if (!data.ticketTitle) {
        var shortDescription = gr.getDisplayValue("short_description");
        data.ticketTitle = shortDescription ? shortDescription : gr.getValue("number");
    }

    data.tableLabel = gr.getLabel();
    data.fields = fields;
    data.variables = $sp.getVariablesArray();
    data.agent = agent;
    data.agentPossible = gr.isValidField("assigned_to");
	  data.assign = gr.getValue('assigned_to');
    data.table = gr.getTableName();
    data.sys_id = gr.getUniqueValue();
		data.isHR = userHasRole(gs.getUserID(), 'u_medarb_sag_user');
		data.user = gs.getUserID();	
	
    var gr1 = new GlideRecord(data.table);
    if (!gr1.isValid())
        return;

    gr1.get(data.sys_id);

    data.number = gr1.getDisplayValue('number');
    data.title = gr1.getDisplayValue('u_user.title');
    data.opened_for = gr1.getDisplayValue('u_user');
    data.manager = gr1.getDisplayValue('u_user.manager');
    data.hr_consultant = gr1.getDisplayValue('u_user.manager.department.u_hr_consultant');


    var arr = [];

    var task = new GlideRecord("u_medarb_opgave");
    task.addQuery('parent', data.sys_id);
    task.addNotNullQuery('u_html_notes');
    task.query();

    while (task.next()) {

        if (task.u_html_notes != null || task.u_html_notes != "") {
            arr.push({
                field_label: "Test",
								assigned_to: task.assigned_to.toString(),
                short_description: task.short_description.toString(),
                notes: task.u_html_notes.toString(),
                sys_created_on: task.sys_created_on.toString(),
                sys_id: task.sys_id.toString()
            });
        }
    }
    data.notes = arr;
	
	
	    function userHasRole(userID, role) {
        var uhrRec = new GlideRecord('sys_user_has_role');

        uhrRec.addQuery('user', userID);
        uhrRec.addQuery('role.name', role);
        uhrRec.query();
        return uhrRec.hasNext();
    }
})();