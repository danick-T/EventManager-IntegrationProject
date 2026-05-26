sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
], function (Controller, Fragment) {
    "use strict";

    return Controller.extend("eventui.controller.BaseController", {

        getRouter() {
            return this.getOwnerComponent().getRouter();
        },

        onNavSelect(oEvent) {
            const sKey = oEvent.getParameter("key");
            if (sKey === "events") {
                this.getRouter().navTo("events");
            } else if (sKey === "sessions") {
                this.getRouter().navTo("userSessions");
            } else if (sKey === "dashboard") {
                this.getRouter().navTo("adminDashboard");
            }
        },

        _setActiveNavKey(sKey) {
            const oNavBar = this.byId("mainNavBar");
            if (oNavBar) {
                oNavBar.setSelectedKey(sKey);
            }
        },

        _attachRouteMatched(sRouteName, sNavKey) {
            this.getRouter()
                .getRoute(sRouteName)
                .attachPatternMatched(() => {
                    this._setActiveNavKey(sNavKey);
                }, this);
        },

        _loadHeader(oPage, sActiveKey) {
            this.onNavSelect = this.onNavSelect.bind(this);

            return Fragment.load({
                id: this.getView().getId(),
                name: "eventui.fragments.Header",
                controller: this
            }).then(oBar => {
                oPage.setCustomHeader(oBar);
                this._setActiveNavKey(sActiveKey);
            });
        },

        _loadFooter(oPage) {
            return Fragment.load({
                id: this.getView().getId(),
                name: "eventui.fragments.Footer",
                controller: this
            }).then(oBar => {
                oPage.setFooter(oBar);
            });
        },
    });
});
