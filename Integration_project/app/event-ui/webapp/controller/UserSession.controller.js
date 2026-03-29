sap.ui.define([
    "eventui/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "eventui/model/formatter"  
], function (BaseController, Filter, FilterOperator,formatter) {
    "use strict";

    return BaseController.extend("eventui.controller.UserSession", {

        formatter : formatter,

        onInit: function () {
            const oPage = this.byId("userSessions");
            this._loadHeader(oPage, "sessions");
            this._loadFooter(oPage);
            this._sCurrentFilter = "upcoming";
            this._attachRouteMatched("userSessions", "sessions");
        },

        handleSwitchPanel: function (oEvent) {
            this._sCurrentFilter = oEvent.getParameter("key");
            this._applyFilter();
        },

        _applyFilter: function () {
            var oTable   = this.byId("sessionsTable");
            var oBinding = oTable.getBinding("items");
            if (!oBinding) return;

            var sNow    = new Date().toISOString();
            var oFilter = this._sCurrentFilter === "upcoming"
                ? new Filter("startTime", FilterOperator.GT, sNow)
                : new Filter("startTime", FilterOperator.LE, sNow);

            oBinding.filter([oFilter]);
        },

        handleViewDetails: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oSession = oContext.getObject();
            console.log("Details voor sessie:", oSession.ID, oSession.title);
        }
    });
});