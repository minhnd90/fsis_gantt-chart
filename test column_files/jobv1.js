var jobv1 = {
    init: function () {
        jobv1.hidenButton();
        jobv1.onEvent();
    },
    hidenButton: function () {
        jQuery(".group-btn").find("button").hide();
        if (document.getElementById("KanbanCol")) {
            document.getElementById("KanbanCol").style.display = "none";
        }
        
    },

    hidenTextbox: function () {
        var isSlectedGroupJob = jQuery('[name = "IDGroupJob"]').val();
        var element = document.getElementById("KanbanCol");
        //var url = Utils.getDomain() + "/" + Cdata.VirtualPath + "/jobv1/getIDGroupCol.html"
        if (isSlectedGroupJob > 0) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    },
    onEvent: function () {
        jQuery(document).on('change', "#JobGroups", function () {
            jobv1.hidenTextbox();
        });
    }
}
jQuery(document).ready(function () {
    jobv1.init();
});