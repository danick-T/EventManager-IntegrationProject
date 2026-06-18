sap.ui.define([
    "eventui/controller/BaseController",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, DateFormat, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("eventui.controller.AdminEditEvent", {

        onInit: function () {
            var oPage = this.byId("adminEditEventPage");
            this._loadHeader(oPage, "dashboard");
            this._loadFooter(oPage);
            this._setActiveNavKey("dashboard");

            var oRoute = this.getRouter().getRoute("adminEditEvent");
            if (oRoute) {
                oRoute.attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sId = decodeURIComponent(oArgs.eventId);

            this.getView().bindElement({
                path: "/Events(" + sId + ")",
                parameters: {
                    $expand: "sessions"
                }
            });
        },

        formatDateTime: function (sValue) {
            if (!sValue) {
                return "";
            }
            var oDate = new Date(sValue);
            var oFormat = DateFormat.getDateTimeInstance({
                style: "medium"
            });
            return oFormat.format(oDate);
        },

        onManageSession: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            if (!oCtx) { return; }
            var sId = oCtx.getObject().ID;
            this.getRouter().navTo("adminEditSession", { sessionId: encodeURIComponent(sId) });
        },

        onSaveEvent: function () {
            var that = this;
            var oModel = this.getView().getModel();
            oModel.submitBatch("$auto").then(function () {
                MessageToast.show("Event saved");
                that.getRouter().navTo("adminDashboard");
            }).catch(function () {
                MessageBox.error("Save failed");
            });
        },

        onDeleteEvent: function () {
            var that = this;
            MessageBox.confirm("Dit verwijdert het event én alle onderliggende sessies en registraties. Doorgaan?", {
                title: "Delete Event",
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.OK) { return; }
                    var oCtx = that.getView().getBindingContext();
                    if (!oCtx) { return; }
                    oCtx.delete().then(function () {
                        MessageToast.show("Event deleted");
                        that.getRouter().navTo("adminDashboard");
                    }).catch(function () {
                        MessageBox.error("Delete failed");
                    });
                }
            });
        }
    });
});
