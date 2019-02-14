(function () {
    data.sys_id = $sp.getParameter('sys_id');
    data.table = 'u_medarb_opgave';
    var u = data.table + '.do?sys_id=' + data.sys_id;
    data.ticketPrint = '/' + u + '&sysparm_media=print';

    var gr1 = new GlideRecord(data.table);
    gr1.get(data.sys_id);


    data.canRead = gr1.canRead();
    if (!data.canRead)
        return;

    data.assign = gr1.getValue('assigned_to');

    data.tableLabel = gr1.getLabel();
    data.notes = gr1.getDisplayValue('u_html_notes')
    data.table = gr1.getTableName();
    data.sys_id = gr1.getUniqueValue();
  	data.isHR = userHasRole(gs.getUserID(), 'u_medarb_sag_user');

    if (input.op == 'submitNotes') {
        var gr3 = new GlideRecord(data.table);
        gr3.get(input.u_medarb_opgave_sys_id);
        gr3.query();
        while (gr3.next()) {
            data.notes = input.notes;
            gr3.u_html_notes = input.notes;
            gr3.update();
        }

    }

    function userHasRole(userID, role) {
        var uhrRec = new GlideRecord('sys_user_has_role');

        uhrRec.addQuery('user', userID);
        uhrRec.addQuery('role.name', role);
        uhrRec.query();
        return uhrRec.hasNext();
    }
})();