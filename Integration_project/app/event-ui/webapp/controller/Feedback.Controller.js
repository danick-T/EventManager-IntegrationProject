sap.ui.define([
    "eventui/controller/BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("eventui.controller.Feedback", {

        onInit: function () {
            // route koppelen
            this.getRouter().getRoute("feedback")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const sSessionId = oEvent.getParameter("arguments").sessionId;
            const oModel = this.getView().getModel();

            // Bind de Session-data aan de view
            this.getView().bindElement({
                path: "/Sessions('" + sSessionId + "')",
                model: undefined,       // default model (je event-service)
                parameters: {
                    $expand: "event"
                }
            });
        },

        onSubmit: function () {
            const oView = this.getView();
            const sRating = oView.byId("rating").getValue();
            const sComment = oView.byId("comment").getValue();

            // Je kunt hier een POST doen naar Feedback-entity (als backend ondersteuning is)
            // Voor nu enkel een toast:
            MessageToast.show("Feedback submitted. Rating: " + sRating + "/5");

            this.getRouter().navTo("userSessions");
        },

        onBack: function () {
            this.getRouter().navTo("userSessions");
        }

    });
});
