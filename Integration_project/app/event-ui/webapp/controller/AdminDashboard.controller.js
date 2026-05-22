sap.ui.define([
    "eventui/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("eventui.controller.AdminDashboard", {
        onInit: function () {
            this._attachRouteMatched("adminDashboard", "dashboard");
        },

        onCreateEvent: function () {
            this.getRouter().navTo("createEvent");
        }
    });
});
