sap.ui.define([
    "sap/ui/core/UIComponent",
    "eventui/model/models"
], function (UIComponent, models) {
    "use strict";

    return UIComponent.extend("eventui.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            // DE FIX: In klassieke JS gebruik je de prototype-aanroep in plaats van 'super'
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});