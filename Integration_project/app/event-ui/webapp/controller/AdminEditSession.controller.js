sap.ui.define([
    "eventui/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/library"
], function (BaseController, MessageBox, MessageToast, coreLibrary) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

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
                path: "/Sessions(" + sId + ")",
                parameters: { $expand: "event" }
            });
        },

        /**
         * Controleert of de (mogelijk bewerkte) sessietijden binnen het tijdvenster van
         * het bijbehorende event vallen. Zet een rode valueState op het overtredende veld
         * en retourneert een array met foutmeldingen (leeg = geldig).
         */
        _validateSessionTimes() {
            var oCtx = this.getView().getBindingContext();
            var oStartField = this.byId("idSessionStartTime");
            var oEndField = this.byId("idSessionEndTime");

            // Reset valueState bij elke validatie.
            oStartField.setValueState(ValueState.None);
            oEndField.setValueState(ValueState.None);

            var aErrors = [];
            if (!oCtx) {
                return aErrors;
            }

            var oStart = oCtx.getProperty("startTime");
            var oEnd = oCtx.getProperty("endTime");
            var oEventStart = oCtx.getProperty("event/startDate");
            var oEventEnd = oCtx.getProperty("event/endDate");

            // Regel 4: beide tijden verplicht.
            if (!oStart || !oEnd) {
                var sRequired = this._getText("esValidationTimesRequired");
                if (!oStart) {
                    oStartField.setValueState(ValueState.Error);
                    oStartField.setValueStateText(sRequired);
                }
                if (!oEnd) {
                    oEndField.setValueState(ValueState.Error);
                    oEndField.setValueStateText(sRequired);
                }
                aErrors.push(sRequired);
                return aErrors;
            }

            var iStart = new Date(oStart).getTime();
            var iEnd = new Date(oEnd).getTime();

            // Regel 3: einde niet vóór start.
            if (iEnd < iStart) {
                var sEndBeforeStart = this._getText("esValidationEndBeforeStart");
                oEndField.setValueState(ValueState.Error);
                oEndField.setValueStateText(sEndBeforeStart);
                aErrors.push(sEndBeforeStart);
            }

            // Regel 1: sessie mag niet vóór event-start beginnen.
            if (oEventStart && iStart < new Date(oEventStart).getTime()) {
                var sStartBefore = this._getText("esValidationStartBeforeEvent");
                oStartField.setValueState(ValueState.Error);
                oStartField.setValueStateText(sStartBefore);
                aErrors.push(sStartBefore);
            }

            // Regel 2: sessie mag niet ná event-eind eindigen.
            if (oEventEnd && iEnd > new Date(oEventEnd).getTime()) {
                var sEndAfter = this._getText("esValidationEndAfterEvent");
                oEndField.setValueState(ValueState.Error);
                oEndField.setValueStateText(sEndAfter);
                aErrors.push(sEndAfter);
            }

            return aErrors;
        },

        /**
         * Live-validatie wanneer een DateTimePicker wijzigt: toont/verbergt de rode rand
         * direct, zonder blokkerende MessageBox.
         */
        onSessionTimeChange() {
            this._validateSessionTimes();
        },

        onSaveSession() {
            var aErrors = this._validateSessionTimes();
            if (aErrors.length > 0) {
                MessageBox.warning(aErrors.join("\n"));
                return;
            }

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
        },

        /**
         * Hulpfunctie om i18n-teksten op te halen.
         */
        _getText(sKey) {
            return this.getOwnerComponent()
                .getModel("i18n")
                .getResourceBundle()
                .getText(sKey);
        }
    });
});
