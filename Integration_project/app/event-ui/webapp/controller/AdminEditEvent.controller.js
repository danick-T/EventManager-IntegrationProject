sap.ui.define([
    "eventui/controller/BaseController",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, DateFormat, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("eventui.controller.AdminEditEvent", {

        onInit: function () {
            var oPage = this.byId("adminEditEventPage");
            this._loadHeader(oPage, "dashboard");
            this._loadFooter(oPage);
            this._setActiveNavKey("dashboard");

            var oRoute = this.getRouter().getRoute("adminEditEvent");
            if (oRoute) {
                oRoute.attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sId = decodeURIComponent(oArgs.eventId);
            var oView = this.getView();

            oView.setModel(new JSONModel({ items: [] }), "sessionStats");
            oView.setModel(new JSONModel({ items: [] }), "registrationList");

            oView.bindElement({
                path: "/Events(" + sId + ")",
                parameters: {
                    $expand: "sessions($expand=registrations($expand=user,feedback))"
                },
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        _onDataReceived: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) { return; }

            var oData = oContext.getObject();
            var aSessionStats = [];
            var aRegistrationList = [];

            (oData.sessions || []).forEach(function (oSession) {
                var aRegistrations = oSession.registrations || [];
                var aScores = [];

                aRegistrations.forEach(function (oReg) {
                    (oReg.feedback || []).forEach(function (oFb) {
                        if (oFb.score !== null && oFb.score !== undefined) {
                            aScores.push(oFb.score);
                        }
                    });

                    var oUser = oReg.user || {};
                    aRegistrationList.push({
                        sessionTitle: oSession.title,
                        firstName: oUser.firstName || "",
                        lastName: oUser.lastName || "",
                        email: oUser.email || "",
                        registrationDate: oReg.registrationDate
                    });
                });

                var iScoreSum = aScores.reduce(function (iSum, iScore) {
                    return iSum + iScore;
                }, 0);
                var fAvgScore = aScores.length ? Number((iScoreSum / aScores.length).toFixed(1)) : null;

                aSessionStats.push({
                    title: oSession.title,
                    registrationCount: aRegistrations.length,
                    avgScore: fAvgScore
                });
            });

            this.getView().getModel("sessionStats").setProperty("/items", aSessionStats);
            this.getView().getModel("registrationList").setProperty("/items", aRegistrationList);
        },

        formatDateTime: function (sValue) {
            if (!sValue) {
                return "";
            }
            var oDate = new Date(sValue);
            var oFormat = DateFormat.getDateTimeInstance({
                style: "medium"
            });
            return oFormat.format(oDate);
        },

        formatAvgScore: function (vValue) {
            if (vValue === null || vValue === undefined) {
                return "—";
            }
            return vValue.toFixed(1) + " / 5";
        },

        onManageSession: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            if (!oCtx) { return; }
            var sId = oCtx.getObject().ID;
            this.getRouter().navTo("adminEditSession", { sessionId: encodeURIComponent(sId) });
        },

        onSaveEvent: function () {
            var that = this;
            var oModel = this.getView().getModel();
            oModel.submitBatch("$auto").then(function () {
                MessageToast.show("Event saved");
                that.getRouter().navTo("adminDashboard");
            }).catch(function () {
                MessageBox.error("Save failed");
            });
        },

        onDeleteEvent: function () {
            var that = this;
            MessageBox.confirm("Dit verwijdert het event én alle onderliggende sessies en registraties. Doorgaan?", {
                title: "Delete Event",
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.OK) { return; }
                    var oCtx = that.getView().getBindingContext();
                    if (!oCtx) { return; }
                    oCtx.delete().then(function () {
                        MessageToast.show("Event deleted");
                        that.getRouter().navTo("adminDashboard");
                    }).catch(function () {
                        MessageBox.error("Delete failed");
                    });
                }
            });
        }
    });
});
