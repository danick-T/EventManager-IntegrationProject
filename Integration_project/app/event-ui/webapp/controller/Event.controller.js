sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "eventui/model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, formatter) {
    "use strict";

    return Controller.extend("eventui.controller.Event", {

        formatter: formatter,

        onInit: function () {
            // OData model → manifest.json (mainService → /odata/v4/admin/)
            // user model  → App.controller.js (gezet op component, beschikbaar in alle views)
            this._loadFiltersModel();
        },

        _loadFiltersModel: function () {
            var oFiltersModel = new JSONModel({
                statuses: [
                    { key: "all",   text: "All Statuses" },
                    { key: "true",  text: "Active" },
                    { key: "false", text: "Inactive" }
                ],
                locations: [
                    { key: "all",       text: "Any Location" },
                    { key: "Berlin",    text: "Berlin" },
                    { key: "Brussels",  text: "Brussels" },
                    { key: "Amsterdam", text: "Amsterdam" }
                ]
            });
            this.getView().setModel(oFiltersModel, "filters");
        },

        onFilterEvents: function () {
            var oTable   = this.byId("eventsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            var sQuery = this.byId("searchField").getValue();
            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("name",        FilterOperator.Contains, sQuery),
                        new Filter("description", FilterOperator.Contains, sQuery),
                        new Filter("location",    FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            var sStatus = this.byId("statusFilter").getSelectedKey();
            if (sStatus && sStatus !== "all") {
                aFilters.push(new Filter("active", FilterOperator.EQ, sStatus === "true"));
            }

            var sLocation = this.byId("locationFilter").getSelectedKey();
            if (sLocation && sLocation !== "all") {
                aFilters.push(new Filter("location", FilterOperator.EQ, sLocation));
            }

            oBinding.filter(aFilters.length
                ? new Filter({ filters: aFilters, and: true })
                : []
            );
        },

        onTableUpdateFinished: function (oEvent) {
            var iTotal   = oEvent.getParameter("total");
            var iCurrent = oEvent.getParameter("actual");
            this.byId("tableCountText").setText("Showing " + iCurrent + " of " + iTotal + " events");
        },

        onViewDetails: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sId      = oContext.getObject().ID;
            this.getOwnerComponent().getRouter().navTo("eventDetail", {
                eventId: encodeURIComponent(sId)
            });
        },

        onNavSelect: function (oEvent) {
            if (oEvent.getParameter("key") === "sessions") {
                sap.m.MessageToast.show("My Sessions coming soon!");
            }
        },

        onRequestEvent: function () {
            this.getOwnerComponent().getRouter().navTo("createEvent");
        },

        onSearch: function () {
            this.byId("searchField").focus();
        }

    });
});