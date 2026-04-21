sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("eventui.controller.Login", {

        onLogin: async function () {
        try {

            console.log("LOGIN CLICKED");

            const email = this.byId("email").getValue();
            const password = this.byId("password").getValue();

            const response = await fetch("/odata/v4/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

          console.log("Response:", response);

        const text = await response.text(); // text, niet json
        console.log("Raw response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("JSON parse error", e);
        }

        sap.m.MessageToast.show("Login response ontvangen");

        const router = this.getOwnerComponent().getRouter();
        router.navTo("events");

        } catch (error) {
        console.error("ERROR:", error);
        MessageToast.show("Er is een fout");
        }
        }
          });
    });