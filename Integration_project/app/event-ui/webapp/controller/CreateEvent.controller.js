sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("eventui.controller.CreateEvent", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var oRoute = oRouter.getRoute("createEvent");
            if (oRoute) {
                oRoute.attachPatternMatched(this._onRouteMatched, this);
            }
        },

        /**
         * Loopt telkens als de route wordt geopend.
         * Reset het formulier naar lege waarden zodat een vorige
         * (geannuleerde) invoer niet blijft hangen.
         */
        _onRouteMatched: function () {
            var oNewEventModel = new JSONModel({
                name: "",
                description: "",
                location: "",
                startDate: "",
                endDate: "",
                active: true
            });
            this.getView().setModel(oNewEventModel, "newEvent");
        },

        /**
         * Save-knop. Leest het formulier, valideert, en maakt het event aan.
         */
        onSave: function () {
            var oModel = this.getView().getModel("newEvent");
            var oData = oModel.getData();

            // Validatie 1: titel verplicht
            if (!oData.name || !oData.name.trim()) {
                MessageBox.warning(this._getText("ceValidationTitleRequired"));
                return;
            }

            // Validatie 2: einddatum niet vóór startdatum
            if (oData.startDate && oData.endDate && oData.endDate < oData.startDate) {
                MessageBox.warning(this._getText("ceValidationDateOrder"));
                return;
            }

            this._createEvent(oData);
        },

        /**
         * Stuurt een POST naar /Events via OData V4 list-binding create.
         * Zelfde patroon als _createRegistration in EventDetail.
         */
        _createEvent: function (oData) {
            var oODataModel = this.getView().getModel();
            var that = this;

            var oListBinding = oODataModel.bindList("/Events");

            var oContext = oListBinding.create({
                name:        oData.name.trim(),
                description: oData.description,
                location:    oData.location,
                startDate:   oData.startDate ? oData.startDate + "T00:00:00Z" : null,
                endDate:     oData.endDate   ? oData.endDate   + "T00:00:00Z" : null,
                active:      oData.active
            });

            oODataModel.submitBatch("$auto").then(function () {
                MessageToast.show(that._getText("ceSaveSuccess"));

                // Lees de server-gegenereerde UUID van het nieuwe event
                var sNewId = oContext.getProperty("ID");

                // Navigeer naar EventDetail zodat de admin sessies kan toevoegen
                that.getOwnerComponent().getRouter().navTo("eventDetail", {
                    eventId: encodeURIComponent(sNewId)
                });
            }).catch(function () {
                MessageBox.error(that._getText("ceSaveError"));
            });
        },

        /**
         * Cancel-knop. Gaat terug naar de events-lijst.
         */
        onCancel: function () {
            this.onNavBack();
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("events", {}, { replace: true });
        },

        /**
         * Hulpfunctie om i18n-teksten op te halen.
         */
        _getText: function (sKey) {
            return this.getOwnerComponent()
                .getModel("i18n")
                .getResourceBundle()
                .getText(sKey);
        }
    });
});