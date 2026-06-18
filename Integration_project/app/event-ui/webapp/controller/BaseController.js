sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, Fragment, JSONModel) {
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

        onLogout() {
            sessionStorage.removeItem("loggedInUser");
            this.getOwnerComponent().setModel(null, "user");
            this.getRouter().navTo("login", {}, { replace: true });
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
            var oComponent = this.getOwnerComponent();
            var oUserModel = oComponent.getModel("user");
            if (!oUserModel || !oUserModel.getProperty("/initials")) {
                var sStored = sessionStorage.getItem("loggedInUser");
                if (sStored) {
                    oComponent.setModel(new JSONModel(JSON.parse(sStored)), "user");
                }
            }

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
                oPage.addContent(oBar);
            });
        },
    });
});
