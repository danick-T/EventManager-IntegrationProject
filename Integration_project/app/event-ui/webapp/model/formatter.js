sap.ui.define([], function () {
    "use strict";

    // Hulpfunctie buiten het return object → geen 'this' context nodig
    function _deriveStatus(bActive, sStartDate, sEndDate) {
        if (!bActive) { return "Inactive"; }
        var now       = new Date();
        var startDate = sStartDate ? new Date(sStartDate) : null;
        var endDate   = sEndDate   ? new Date(sEndDate)   : null;

        if (endDate   && endDate   < now) { return "Closed"; }
        if (startDate && startDate > now) { return "Upcoming"; }
        return "Active";
    }

    return {
        formatDate(sValue) {
            if (!sValue) return "";
            return new Date(sValue).toLocaleDateString('nl-BE', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        },
        formatTimeRange(sStart, sEnd) {
            if (!sStart || !sEnd) return "";
            const fmt = v => new Date(v).toLocaleTimeString('nl-BE', {
                hour: '2-digit', minute: '2-digit'
            });
            return `${fmt(sStart)} – ${fmt(sEnd)}`;
        },


        formatStatusText: function (bActive, sStartDate, sEndDate) {
            return _deriveStatus(bActive, sStartDate, sEndDate);
        },

        formatStatusState: function (bActive, sStartDate, sEndDate) {
            var mMap = {
                "Active":   "Success",
                "Upcoming": "Information",
                "Closed":   "Error",
                "Inactive": "None"
            };
            return mMap[_deriveStatus(bActive, sStartDate, sEndDate)] || "None";
        },

        formatEventId: function (sId) {
            if (!sId) { return ""; }
            return "#" + sId.substring(0, 8).toUpperCase();
        },

        formatCount: function (iValue) {
            if (iValue === null || iValue === undefined) { return "–"; }
            return Number(iValue).toLocaleString('nl-BE');
        },

        formatRating: function (fValue) {
            if (fValue === null || fValue === undefined) { return "–"; }
            return Number(fValue).toFixed(1);
        }
    };
});