sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("eventui.controller.App", {

        onInit: function () {
            this._loadUserModel();
        },

        _loadUserModel: function () {
            // Gezet op de component zodat alle child views {user>/...} kunnen lezen
            var oUserModel = new JSONModel({
                name:     "Alex Rivera",
                role:     "Admin",
                initials: "ALEx R"
            });
            this.getOwnerComponent().setModel(oUserModel, "user");
        }

    });
});