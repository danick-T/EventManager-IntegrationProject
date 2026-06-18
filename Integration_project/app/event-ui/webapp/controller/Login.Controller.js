sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("eventui.controller.Login", {

        onLogin: function () {
            var sEmail    = this.byId("email").getValue().trim();
            var sPassword = this.byId("password").getValue();
            var that      = this;

            // Controleer of beide velden zijn ingevuld
            if (!sEmail || !sPassword) {
                MessageBox.warning("Vul je e-mailadres en wachtwoord in.");
                return;
            }

            // Vraag de server om de inloggegevens te controleren tegen de database
            fetch("/odata/v4/event/login", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ email: sEmail, password: sPassword })
            })
            .then(function (oResponse) {
                if (!oResponse.ok) {
                    return oResponse.json().then(function (oFout) {
                        throw new Error(oFout.error ? oFout.error.message : "Verkeerd e-mailadres of wachtwoord.");
                    });
                }
                return oResponse.json();
            })
            .then(function (oUser) {
                var sInitials = ((oUser.firstName || "")[0] || "") + ((oUser.lastName || "")[0] || "");

                // Sla de ingelogde gebruiker op in sessionStorage (blijft na refresh)
                var oUserData = {
                    ID:        oUser.ID,
                    firstName: oUser.firstName,
                    lastName:  oUser.lastName,
                    email:     oUser.email,
                    role:      oUser.role,
                    fullName:  oUser.firstName + " " + oUser.lastName,
                    initials:  sInitials.toUpperCase()
                };
                sessionStorage.setItem("loggedInUser", JSON.stringify(oUserData));

                // Sla ook op in het globale model
                var oComponent = that.getOwnerComponent();
                oComponent.setModel(new JSONModel(oUserData), "user");

                // Navigeer naar de events pagina
                oComponent.getRouter().navTo("events");
            })
            .catch(function (oFout) {
                MessageBox.error(oFout.message || "Verkeerd e-mailadres of wachtwoord. Probeer opnieuw.");
            });
        }
    });
});
