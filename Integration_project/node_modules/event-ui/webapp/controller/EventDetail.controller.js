sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";
    
    return Controller.extend("eventui.controller.EventDetail", {
        
        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            var oRoute = oRouter.getRoute("eventDetail");
            if (oRoute) {
                oRoute.attachPatternMatched(this._onObjectMatched, this);
            }
        },
        
        _onObjectMatched: function(oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sEventId = oArgs.eventId;
            
            var oView = this.getView();
            if (oView) {
                oView.bindElement({
                    path: "/Events(" + sEventId + ")"
                });
            }
        }
    });
});