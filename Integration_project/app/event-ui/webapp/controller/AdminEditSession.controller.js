sap.ui.define([
    "eventui/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("eventui.controller.AdminEditSession", {

        onInit() {
            var oPage = this.byId("adminEditSessionPage");
            this._loadHeader(oPage, "dashboard");
            this._loadFooter(oPage);
            this._setActiveNavKey("dashboard");

            this.getRouter()
                .getRoute("adminEditSession")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            var sId = decodeURIComponent(oEvent.getParameter("arguments").sessionId);
            this.getView().bindElement({
                path: "/Sessions(" + sId + ")"
            });
        },

        onSaveSession() {
            this.getView().getModel().submitBatch("$auto").then(function () {
                MessageToast.show("Session saved");
                this.getRouter().navTo("adminDashboard");
            }.bind(this)).catch(function () {
                MessageBox.error("Save failed.");
            });
        },

        onDeleteSession() {
            MessageBox.confirm("Delete this session? This also removes all registrations and feedback.", {
                title: "Delete Session",
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.OK) return;
                    var oCtx = this.getView().getBindingContext();
                    oCtx.delete().then(function () {
                        MessageToast.show("Session deleted");
                        this.getRouter().navTo("adminDashboard");
                    }.bind(this)).catch(function () {
                        MessageBox.error("Delete failed.");
                    });
                }.bind(this)
            });
        }
    });
});
