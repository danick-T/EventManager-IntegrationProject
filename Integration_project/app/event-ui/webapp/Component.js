sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "eventui/model/models"
], function (UIComponent, JSONModel, models) {
    "use strict";

    return UIComponent.extend("eventui.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Herstel de ingelogde gebruiker uit sessionStorage (na refresh)
            var sUser = sessionStorage.getItem("loggedInUser");
            if (sUser) {
                this.setModel(new JSONModel(JSON.parse(sUser)), "user");
            }

            // enable routing
            this.getRouter().initialize();
        }
    });
});