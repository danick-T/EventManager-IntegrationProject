sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], function(Controller,Fragment){
        "use strict";
        return Controller.extend("eventui.controller.Event", {

            onInit : function() {

            },

            onCloseRegistration : function () {
                var oDialog = this.byId("sessionRegistrationDialog");
                if(oDialog){
                    oDialog.close();   
                }
            }
        })
    }
)
