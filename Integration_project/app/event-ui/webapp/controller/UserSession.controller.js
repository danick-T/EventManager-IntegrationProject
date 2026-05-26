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
            this.getRouter()
                .getRoute("userSessions")
                .attachPatternMatched(function() {
                    this._setActiveNavKey("sessions"); 
                    this._applyFilter();
                },this);
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
            var bUpcoming = this._sCurrentFilter === "upcoming";
            var oTimeFilter = bUpcoming
                ? new Filter("startTime", FilterOperator.GT, sNow)
                : new Filter("startTime", FilterOperator.LE, sNow);

            var oUserModel = this.getOwnerComponent().getModel("user");
            var sUserId = oUserModel && oUserModel.getProperty("/ID");

            var aFilters = [oTimeFilter];
            if (sUserId) {
                aFilters.push(new Filter({
                    path: "registrations",
                    operator: FilterOperator.Any,
                    variable: "r",
                    condition: new Filter("r/user_ID", FilterOperator.EQ, sUserId)
                }));
            }

            oBinding.filter(new Filter({ filters: aFilters, and: true }));

            this.byId("feedbackColumn").setVisible(!bUpcoming);
        },

        handleViewDetails: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sId = oContext.getObject().ID;
            this.getRouter().navTo("feedback", { sessionId: encodeURIComponent(sId) });
        },

        handleSessionActions: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sId = oContext.getObject().ID;
            this.getRouter().navTo("sessionActions", { sessionId: encodeURIComponent(sId) });
        }

    });
});