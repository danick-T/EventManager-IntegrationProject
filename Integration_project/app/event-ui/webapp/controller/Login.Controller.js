sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    // Geldige gebruikers
    var USERS = [
        {
            email:     "ip2@flexso.com",
            password:  "ip2",
            ID:        "11111111-1111-1111-1111-111111111103",
            firstName: "IP2",
            lastName:  "User",
            role:      "admin"
        },
        {
            email:     "danick@hotmail.be",
            password:  "danick123",
            ID:        "11111111-1111-1111-1111-111111111101",
            firstName: "Danick",
            lastName:  "Tchang",
            role:      "admin"
        },
        {
            email:     "denzl@gmail.com",
            password:  "denzl123",
            ID:        "11111111-1111-1111-1111-111111111102",
            firstName: "Denzl",
            lastName:  "DeM",
            role:      "user"
        }
    ];

    return Controller.extend("eventui.controller.Login", {

        onLogin: function () {
            var sEmail    = this.byId("email").getValue().trim();
            var sPassword = this.byId("password").getValue();

            // Controleer of beide velden zijn ingevuld
            if (!sEmail || !sPassword) {
                MessageBox.warning("Vul je e-mailadres en wachtwoord in.");
                return;
            }

            // Zoek de gebruiker op basis van email en wachtwoord
            var oUser = USERS.find(function (u) {
                return u.email === sEmail && u.password === sPassword;
            });

            if (!oUser) {
                MessageBox.error("Verkeerd e-mailadres of wachtwoord. Probeer opnieuw.");
                return;
            }

            // Sla de ingelogde gebruiker op in sessionStorage (blijft na refresh)
            var oUserData = {
                ID:        oUser.ID,
                firstName: oUser.firstName,
                lastName:  oUser.lastName,
                email:     oUser.email,
                role:      oUser.role,
                fullName:  oUser.firstName + " " + oUser.lastName
            };
            sessionStorage.setItem("loggedInUser", JSON.stringify(oUserData));

            // Sla ook op in het globale model
            var oComponent = this.getOwnerComponent();
            oComponent.setModel(new JSONModel(oUserData), "user");

            // Navigeer naar de events pagina
            oComponent.getRouter().navTo("events");
        }
    });
});
