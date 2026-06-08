sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("eventui.controller.CreateSession", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("createSession").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sEventId = decodeURIComponent(oEvent.getParameter("arguments").eventId);
            this._sEventId = sEventId;

            this.getView().setModel(new JSONModel({
                title: "",
                description: "",
                startTimeStr: "",
                endTimeStr: "",
                capacity: 30,
                speaker: "",
                room: "",
                eventName: "laden..."
            }), "sessionModel");

            var oODataModel = this.getOwnerComponent().getModel();
            var oSessionModel = this.getView().getModel("sessionModel");
            oODataModel.bindContext("/Events(" + sEventId + ")").requestObject().then(function (oEvt) {
                oSessionModel.setProperty("/eventName", "Defining session for: " + oEvt.name);
            }).catch(function () {
                oSessionModel.setProperty("/eventName", "");
            });
        },

        _buildDateTime: function (sDatePickerId, sTimeInputId) {
            var oDatePicker = this.byId(sDatePickerId);
            var oTimeInput  = this.byId(sTimeInputId);

            var oDate = oDatePicker.getDateValue();   // JS Date or null
            var sTime = oTimeInput.getValue().trim(); // "HH:MM"

            if (!oDate || !sTime) { return null; }

            var aParts = sTime.split(":");
            if (aParts.length !== 2) { return null; }

            var iH = parseInt(aParts[0], 10);
            var iM = parseInt(aParts[1], 10);
            if (isNaN(iH) || isNaN(iM) || iH > 23 || iM > 59) { return null; }

            // Build a new date in LOCAL time so the ISO string is correct
            var oResult = new Date(
                oDate.getFullYear(),
                oDate.getMonth(),
                oDate.getDate(),
                iH, iM, 0, 0
            );
            return oResult;
        },

        onSaveSession: function () {
            var oModel  = this.getView().getModel("sessionModel");
            var sTitle  = (oModel.getProperty("/title") || "").trim();

            var oStart = this._buildDateTime("startDate", "startTime");
            var oEnd   = this._buildDateTime("endDate",   "endTime");

            // --- Validatie ---
            if (!sTitle) {
                MessageBox.warning("Geef een sessietitel in.");
                return;
            }
            if (!oStart) {
                MessageBox.warning("Selecteer een startdatum en vul het startuur in (bijv. 09:30).");
                return;
            }
            if (!oEnd) {
                MessageBox.warning("Selecteer een einddatum en vul het einduur in (bijv. 17:00).");
                return;
            }
            if (oEnd <= oStart) {
                MessageBox.warning("Het eindtijdstip moet na het starttijdstip liggen.");
                return;
            }

            var iCapacity = parseInt(oModel.getProperty("/capacity"), 10) || 0;

            var oPayload = {
                title:       sTitle,
                description: oModel.getProperty("/description") || "",
                startTime:   oStart.toISOString(),
                endTime:     oEnd.toISOString(),
                capacity:    iCapacity,
                speaker:     oModel.getProperty("/speaker") || "",
                room:        oModel.getProperty("/room")    || "",
                event_ID:    this._sEventId
            };

            var that = this;

            // Directe fetch — geeft échte foutmeldingen als iets mislukt
            fetch("/odata/v4/admin/Sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(oPayload)
            })
            .then(function (oResponse) {
                if (!oResponse.ok) {
                    return oResponse.json().then(function (oErr) {
                        throw new Error(oErr.error ? oErr.error.message : "Onbekende fout");
                    });
                }
                return oResponse.json();
            })
            .then(function () {
                MessageToast.show("Sessie succesvol aangemaakt!");
                // Refresh het OData model zodat de nieuwe sessie zichtbaar is
                that.getOwnerComponent().getModel().refresh();
                that.getOwnerComponent().getRouter().navTo("eventDetail", {
                    eventId: encodeURIComponent(that._sEventId)
                }, { replace: true });
            })
            .catch(function (oErr) {
                MessageBox.error("Aanmaken mislukt: " + oErr.message);
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("eventDetail", {
                eventId: encodeURIComponent(this._sEventId)
            }, { replace: true });
        }
    });
});
