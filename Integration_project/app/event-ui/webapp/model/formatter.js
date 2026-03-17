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

        /**
         * Timestamp → "10 Apr 2026"
         */
        formatDate: function (sTimestamp) {
            if (!sTimestamp) { return ""; }
            return new Date(sTimestamp).toLocaleDateString("en-GB", {
                day:   "2-digit",
                month: "short",
                year:  "numeric"
            });
        },

        /**
         * Einddatum met "to" prefix, of leeg
         */
        formatDateEnd: function (sTimestamp) {
            if (!sTimestamp) { return ""; }
            return "to " + new Date(sTimestamp).toLocaleDateString("en-GB", {
                day:   "2-digit",
                month: "short",
                year:  "numeric"
            });
        },

        /**
         * Statustekst afgeleid van active + datums
         * "Active" | "Upcoming" | "Closed" | "Inactive"
         */
        formatStatusText: function (bActive, sStartDate, sEndDate) {
            return _deriveStatus(bActive, sStartDate, sEndDate);
        },

        /**
         * ObjectStatus state afgeleid van active + datums
         * "Success" | "Information" | "Error" | "None"
         */
        formatStatusState: function (bActive, sStartDate, sEndDate) {
            var mMap = {
                "Active":   "Success",
                "Upcoming": "Information",
                "Closed":   "Error",
                "Inactive": "None"
            };
            return mMap[_deriveStatus(bActive, sStartDate, sEndDate)] || "None";
        },

        /**
         * UUID → "#11111111"
         */
        formatEventId: function (sId) {
            if (!sId) { return ""; }
            return "#" + sId.substring(0, 8).toUpperCase();
        }

    };
});