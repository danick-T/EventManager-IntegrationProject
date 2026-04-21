sap.ui.define([
    "eventui/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("eventui.controller.Feedback", {

        onInit: function () {
            this._sSessionId = null;
            this.getRouter().getRoute("feedback")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            this._sSessionId = decodeURIComponent(oEvent.getParameter("arguments").sessionId);

            this.getView().bindElement({
                path: "/Sessions('" + this._sSessionId + "')",
                model: "eventService",
                parameters: { $expand: "event" }
            });

            // reset form
            this.byId("rating").setValue(0);
            this.byId("comment").setValue("");
        },

        onSubmit: function () {
            const oView    = this.getView();
            const iRating  = oView.byId("rating").getValue();
            const sComment = oView.byId("comment").getValue();

            if (!iRating) {
                MessageBox.warning("Please select a rating before submitting.");
                return;
            }

            const oUserModel = this.getOwnerComponent().getModel("user");
            const sUserName  = oUserModel ? oUserModel.getProperty("/name")  : "";
            const sEmail     = oUserModel ? oUserModel.getProperty("/email") || "" : "";

            const oModel       = oView.getModel("eventService");
            const oListBinding = oModel.bindList("/Feedback");

            oListBinding.create({
                rating:     iRating,
                comment:    sComment,
                userName:   sUserName,
                email:      sEmail,
                session_ID: this._sSessionId,
                createdAt:  new Date().toISOString()
            });

            oModel.submitBatch(oModel.getUpdateGroupId()).then(function () {
                MessageToast.show("Feedback submitted. Thank you!");
                this.getRouter().navTo("userSessions");
            }.bind(this)).catch(function (oError) {
                MessageBox.error("Failed to submit feedback: " + oError.message);
            });
        },

        onBack: function () {
            this.getRouter().navTo("userSessions");
        }

    });
});
