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

            this.getView().setModel(new JSONModel({
                totalEvents:        null,
                totalSessions:      null,
                totalRegistrations: null,
                avgRating:          null
            }), "kpi");

            this.getRouter()
                .getRoute("adminDashboard")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._setActiveNavKey("dashboard");
            this._loadKpis();

            const oTable = this.byId("adminEventsTable");
            const oBinding = oTable && oTable.getBinding("items");
            if (oBinding) {
                oBinding.refresh();
            }
        },

        _loadKpis: function () {
            const oKpiModel = this.getView().getModel("kpi");
            const sBase     = "/odata/v4/admin";

            const aCounts = [
                { url: sBase + "/Events/$count",        prop: "/totalEvents" },
                { url: sBase + "/Sessions/$count",      prop: "/totalSessions" },
                { url: sBase + "/Registrations/$count", prop: "/totalRegistrations" }
            ];

            aCounts.forEach(function (oEntry) {
                fetch(oEntry.url, { headers: { Accept: "text/plain" }, credentials: "include" })
                    .then(function (oResp) {
                        if (!oResp.ok) { throw new Error("HTTP " + oResp.status); }
                        return oResp.text();
                    })
                    .then(function (sText) {
                        oKpiModel.setProperty(oEntry.prop, parseInt(sText, 10) || 0);
                    })
                    .catch(function (oErr) {
                        console.error("KPI count failed for " + oEntry.url, oErr);
                        oKpiModel.setProperty(oEntry.prop, 0);
                    });
            });

            const oModel = this.getOwnerComponent().getModel();
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

        onEditEvent: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            if (!oCtx) { return; }
            var sId = oCtx.getObject().ID;
            this.getRouter().navTo("adminEditEvent", { eventId: encodeURIComponent(sId) });
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
