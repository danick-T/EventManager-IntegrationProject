sap.ui.define([
    "eventui/controller/BaseController",
    "eventui/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, formatter, Filter, FilterOperator, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("eventui.controller.UserSessionActions", {

        formatter: formatter,

        onInit: function () {
            var oPage = this.byId("UserSessionActions");
            this._loadHeader(oPage, "sessions");
            this._loadFooter(oPage);
            this._setActiveNavKey("sessions");

            this.getRouter().getRoute("sessionActions").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sSessionId = decodeURIComponent(oEvent.getParameter("arguments").sessionId);
            this.getView().bindElement({
                path: "/Sessions(" + sSessionId + ")",
                parameters: { $expand: "event" }
            });
        },

        handleRegistration: function (oEvent) {
            var sSessionId = this.getView().getBindingContext().getProperty("ID");
            var sUserId = this.getOwnerComponent().getModel("user").getProperty("/ID");

            if (!sUserId) {
                MessageBox.error("You must be logged in.");
                return;
            }

            MessageBox.confirm("Are you sure you want to remove your registration for this session?", {
                title: "Delete Registration",
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.OK) return;
                    this._deleteRegistration(sSessionId, sUserId);
                }.bind(this)
            });
        },

        _deleteRegistration: function (sSessionId, sUserId) {
            var oModel = this.getView().getModel();
            var oListBinding = oModel.bindList("/Registrations", null, null, new Filter({
                filters: [
                    new Filter("session_ID", FilterOperator.EQ, sSessionId),
                    new Filter("user_ID", FilterOperator.EQ, sUserId)
                ],
                and: true
            }));

            oListBinding.requestContexts(0, 1).then(function (aContexts) {
                if (!aContexts.length) {
                    MessageBox.warning("No registration found.");
                    return;
                }
                aContexts[0].delete().then(function () {
                    MessageToast.show("Unregistered");
                    this.getRouter().navTo("userSessions");
                }.bind(this)).catch(function () {
                    MessageBox.error("Failed to unregister.");
                });
            }.bind(this));
        }
    });
});
