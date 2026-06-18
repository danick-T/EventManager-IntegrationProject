sap.ui.define([
    "eventui/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
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

            var oUserModel = this.getOwnerComponent().getModel("user");
            var sEmail = oUserModel ? oUserModel.getProperty("/email") || "" : "";

            if (!sEmail) {
                var sStored = sessionStorage.getItem("loggedInUser");
                if (sStored) {
                    sEmail = JSON.parse(sStored).email || "";
                }
            }

            const oModel  = oView.getModel("eventService");
            const oFilter = new Filter("session_ID", FilterOperator.EQ, this._sSessionId);
            const that    = this;

            oModel.bindList("/Registrations", null, null, [oFilter])
                .requestContexts()
                .then(function (aContexts) {
                    const sRegistrationId = aContexts.length ? aContexts[0].getObject().ID : null;
                    if (!sRegistrationId) {
                        MessageBox.error("No registration found for this session. Please register first.");
                        return;
                    }

                    oModel.bindList("/Feedback").create({
                        score:           iRating,
                        comment:         sComment,
                        email:           sEmail,
                        submittedAt:     new Date().toISOString(),
                        registration_ID: sRegistrationId
                    });

                    oModel.submitBatch(oModel.getUpdateGroupId()).then(function () {
                        MessageToast.show("Feedback submitted. Thank you!");
                        that.getRouter().navTo("userSessions");
                    }).catch(function (oError) {
                        MessageBox.error("Failed to submit feedback: " + oError.message);
                    });
                })
                .catch(function () {
                    MessageBox.error("Could not look up your registration.");
                });
        },

        onBack: function () {
            this.getRouter().navTo("userSessions");
        }

    });
});
