sap.ui.define([
    "eventui/controller/BaseController",
    "eventui/model/formatter",
    "sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
    "use strict";

    return BaseController.extend("eventui.controller.AdminDashboard", {

        formatter: formatter,

        onInit: function () {
            const oPage = this.byId("adminDashboardPage");
            this._loadHeader(oPage, "dashboard");
            this._loadFooter(oPage);
            this._attachRouteMatched("adminDashboard", "dashboard");

            this.getView().setModel(new JSONModel({
                totalEvents:        null,
                totalSessions:      null,
                totalRegistrations: null,
                avgRating:          null
            }), "kpi");

            this._loadKpis();
        },

        _loadKpis: function () {
            const oModel    = this.getOwnerComponent().getModel();
            const oKpiModel = this.getView().getModel("kpi");

            const aCounts = [
                { path: "/Events",        prop: "/totalEvents" },
                { path: "/Sessions",      prop: "/totalSessions" },
                { path: "/Registrations", prop: "/totalRegistrations" }
            ];

            aCounts.forEach(function (oEntry) {
                const oBinding = oModel.bindList(
                    oEntry.path, undefined, undefined, undefined,
                    { $count: true }
                );
                oBinding.getHeaderContext().requestProperty("$count")
                    .then(function (iCount) {
                        oKpiModel.setProperty(oEntry.prop, iCount != null ? iCount : 0);
                    })
                    .catch(function (oErr) {
                        console.error("KPI count failed for " + oEntry.path, oErr);
                        oKpiModel.setProperty(oEntry.prop, 0);
                    });
            });

            const oFeedbackBinding = oModel.bindList(
                "/Feedback", undefined, undefined, undefined,
                { $apply: "aggregate(score with average as avgScore)" }
            );
            oFeedbackBinding.requestContexts(0, 1).then(function (aContexts) {
                const fAvg = aContexts.length ? aContexts[0].getProperty("avgScore") : null;
                oKpiModel.setProperty("/avgRating", fAvg);
            });
        },

        onCreateEvent: function () {
            this.getRouter().navTo("createEvent");
        },

        onViewDetails: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sId      = oContext.getObject().ID;
            this.getRouter().navTo("eventDetail", {
                eventId: encodeURIComponent(sId)
            });
        },

        onTableUpdateFinished: function (oEvent) {
            var iTotal   = oEvent.getParameter("total");
            var iCurrent = oEvent.getParameter("actual");
            this.byId("adminTableCountText").setText(
                "Showing " + iCurrent + " of " + iTotal + " events"
            );
        }
    });
});
