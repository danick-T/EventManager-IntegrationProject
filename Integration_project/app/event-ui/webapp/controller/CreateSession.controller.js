sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("eventui.controller.CreateSession", {

        // Wordt uitgevoerd als de pagina voor het eerst geladen wordt
        // Hier koppelen we de route "createSession" aan onze functie _onRouteMatched
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("createSession").attachPatternMatched(this._onRouteMatched, this);
        },

        // Wordt uitgevoerd elke keer als de gebruiker naar deze pagina navigeert
        // oEvent bevat de URL-parameters, zoals het eventId
        _onRouteMatched: function (oEvent) {
            // Lees het eventId uit de URL
            var sEventId = decodeURIComponent(oEvent.getParameter("arguments").eventId);

            // Sla het eventId op zodat we het later kunnen gebruiken bij het opslaan
            this._sEventId = sEventId;

            // Maak een leeg formuliermodel aan met standaardwaarden
            var oFormModel = new JSONModel({
                title:       "",
                description: "",
                capacity:    30,
                speaker:     "",
                room:        "",
                eventName:   "laden..."
            });
            this.getView().setModel(oFormModel, "sessionModel");

            // Haal de eventnaam op van de server om te tonen in de pagina
            var oODataModel = this.getOwnerComponent().getModel();
            oODataModel.bindContext("/Events(" + sEventId + ")").requestObject()
                .then(function (oEvent) {
                    oFormModel.setProperty("/eventName", "Defining session for: " + oEvent.name);
                });
        },

        // Combineert een geselecteerde datum en een ingevoerd tijdstip (bv. "09:30")
        // tot één JavaScript Date-object dat we naar de server kunnen sturen
        _buildDateTime: function (sDatePickerId, sTimeInputId) {
            // Lees de datum uit de DatePicker
            var oGekozenDatum = this.byId(sDatePickerId).getDateValue();

            // Lees het uur als tekst uit het tekstveld, bv. "09:30"
            var sTijd = this.byId(sTimeInputId).getValue().trim();

            // Als één van beide leeg is, geef null terug (= niet ingevuld)
            if (!oGekozenDatum || !sTijd) {
                return null;
            }

            // Splits "09:30" op in ["09", "30"]
            var aDelen = sTijd.split(":");
            var iUur    = parseInt(aDelen[0], 10); // "09" → 9
            var iMinuut = parseInt(aDelen[1], 10); // "30" → 30

            // Controleer of het een geldig tijdstip is
            if (isNaN(iUur) || isNaN(iMinuut) || iUur > 23 || iMinuut > 59) {
                return null;
            }

            // Zet het uur en de minuut op de gekozen datum
            oGekozenDatum.setHours(iUur, iMinuut, 0, 0);
            return oGekozenDatum;
        },

        // Wordt uitgevoerd als de gebruiker op "Save Session" klikt
        onSaveSession: function () {
            // Lees alle ingevulde waarden uit het formuliermodel
            var oModel    = this.getView().getModel("sessionModel");
            var sTitel    = (oModel.getProperty("/title") || "").trim();
            var sBeschrijving = oModel.getProperty("/description") || "";
            var iCapacity = parseInt(oModel.getProperty("/capacity"), 10) || 0;
            var sSpeaker  = oModel.getProperty("/speaker") || "";
            var sRoom     = oModel.getProperty("/room") || "";

            // Bouw de start- en einddatumtijden
            var oStart = this._buildDateTime("startDate", "startTime");
            var oEinde = this._buildDateTime("endDate",   "endTime");

            // Validatie: controleer of alles correct is ingevuld
            if (!sTitel) {
                MessageBox.warning("Geef een sessietitel in.");
                return;
            }
            if (!oStart) {
                MessageBox.warning("Selecteer een startdatum en vul het startuur in (bijv. 09:30).");
                return;
            }
            if (!oEinde) {
                MessageBox.warning("Selecteer een einddatum en vul het einduur in (bijv. 17:00).");
                return;
            }
            if (oEinde <= oStart) {
                MessageBox.warning("Het eindtijdstip moet na het starttijdstip liggen.");
                return;
            }

            // Maak het object aan dat we naar de server sturen
            var oNieuweSessie = {
                title:       sTitel,
                description: sBeschrijving,
                startTime:   oStart.toISOString(), // Omzetten naar serverformaat
                endTime:     oEinde.toISOString(),
                capacity:    iCapacity,
                speaker:     sSpeaker,
                room:        sRoom,
                event_ID:    this._sEventId        // Koppeling aan het event
            };

            var that = this;

            // Stuur een POST-request naar de server om de sessie op te slaan
            fetch("/odata/v4/admin/Sessions", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(oNieuweSessie)
            })
            .then(function (oResponse) {
                // Als de server een fout teruggeeft, toon de foutmelding
                if (!oResponse.ok) {
                    return oResponse.json().then(function (oFout) {
                        throw new Error(oFout.error ? oFout.error.message : "Onbekende fout");
                    });
                }
                return oResponse.json();
            })
            .then(function () {
                // Alles gelukt: toon een bevestiging en ga terug naar het event
                MessageToast.show("Sessie succesvol aangemaakt!");
                that.getOwnerComponent().getModel().refresh();
                that.getOwnerComponent().getRouter().navTo("eventDetail", {
                    eventId: encodeURIComponent(that._sEventId)
                }, { replace: true });
            })
            .catch(function (oFout) {
                MessageBox.error("Aanmaken mislukt: " + oFout.message);
            });
        },

        // Gaat terug naar de eventdetailpagina zonder op te slaan
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("eventDetail", {
                eventId: encodeURIComponent(this._sEventId)
            }, { replace: true });
        }

    });
});
