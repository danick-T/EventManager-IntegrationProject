sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, DateFormat, Fragment, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("eventui.controller.EventDetail", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var oRoute = oRouter.getRoute("eventDetail");
            if (oRoute) {
                oRoute.attachPatternMatched(this._onObjectMatched, this);
            }
        },

        _onObjectMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sEventId = decodeURIComponent(oArgs.eventId);

            var oView = this.getView();
            oView.setModel(new JSONModel({ items: [] }), "feedbackList");

            oView.bindElement({
                path: "/Events(" + sEventId + ")",
                parameters: {
                    $expand: "sessions($expand=feedback)"
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
            var aFeedback = [];

            (oData.sessions || []).forEach(function (oSession) {
                (oSession.feedback || []).forEach(function (oFb) {
                    aFeedback.push({
                        sessionTitle: oSession.title,
                        userName:     oFb.userName  || "Anonymous",
                        rating:       oFb.rating    || 0,
                        comment:      oFb.comment   || "",
                        createdAt:    oFb.createdAt || ""
                    });
                });
            });

            this.getView().getModel("feedbackList").setProperty("/items", aFeedback);
        },

        /**
         * Called when the user clicks "Register" on a session row.
         * 
         * This function does three things:
         * 1. Reads the session and event info from the bindings
         * 2. Creates a JSON model with that info (so the dialog can display it)
         * 3. Opens the registration dialog
         * 
         * oEvent.getSource() returns the Button that was clicked.
         * Because the button is inside a ColumnListItem bound to a session,
         * getBindingContext() gives us access to that session's data.
         * 
         * getBindingContext() with no argument uses the DEFAULT model,
         * which is the OData model from manifest.json (/odata/v4/admin/).
         */
        onRegisterForSession: function (oEvent) {
            // Get the button that was clicked
            var oButton = oEvent.getSource();

            // Get the session data from the row's binding context
            var oSessionContext = oButton.getBindingContext();
            var sSessionId = oSessionContext.getProperty("ID");
            var sSessionTitle = oSessionContext.getProperty("title");

            // Get the event data from the page's binding context.
            // The page itself is bound to /Events(uuid), so we can
            // read event properties from the view's element binding.
            var oEventContext = this.getView().getBindingContext();
            var sEventName = oEventContext.getProperty("name");
            var sEventDate = this.formatDate(oEventContext.getProperty("startDate"));
            var sEventLocation = oEventContext.getProperty("location");

            // Store the session ID so we can use it later when saving.
            // "this" refers to the controller instance.
            // We save it as a property so _saveRegistration() can access it.
            this._sCurrentSessionId = sSessionId;

            /**
             * Create a JSON model for the dialog.
             * 
             * JSON models are local, client-side models — they don't talk to
             * the server. They're perfect for holding temporary UI state like
             * form inputs.
             * 
             * We set it with the name "registration" so the dialog can bind
             * to it using {registration>/firstName}, {registration>/email}, etc.
             * 
             * The sessionName, eventName, etc. are read-only display values.
             * firstName, lastName, email are the form fields the user fills in.
             */
            var oRegistrationModel = new JSONModel({
                sessionName: sSessionTitle,
                eventName: sEventName,
                eventDate: sEventDate,
                eventLocation: sEventLocation,
                firstName: "",
                lastName: "",
                email: ""
            });
            this.getView().setModel(oRegistrationModel, "registration");

            // Open the dialog
            this._openRegistrationDialog();
        },

        /**
         * Opens the registration dialog fragment.
         * 
         * Fragment.load() loads the XML fragment file and returns a Promise.
         * A Promise is JavaScript's way of handling things that take time —
         * loading the XML file isn't instant, so .then() runs after it's done.
         * 
         * We store the dialog in this._oRegistrationDialog so we can reuse it.
         * The first time you click Register, it loads the fragment.
         * The second time, it just opens the existing dialog (faster).
         * 
         * addDependent() connects the dialog to the view. This is important
         * because it means the dialog can access the view's models
         * (like our "registration" model). Without this, {registration>/...}
         * bindings in the fragment wouldn't work.
         */
        _openRegistrationDialog: function () {
            var oView = this.getView();
            var that = this;

            if (!this._oRegistrationDialog) {
                Fragment.load({
                    name: "eventui.view.UserSessionRegistration",
                    controller: this
                }).then(function (oDialog) {
                    that._oRegistrationDialog = oDialog;
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oRegistrationDialog.open();
            }
        },

        /**
         * Closes the dialog. Called when user clicks "Cancel".
         */
        onCloseRegistration: function () {
            if (this._oRegistrationDialog) {
                this._oRegistrationDialog.close();
            }
        },

        /**
         * Called when user clicks "Confirm Registration" in the dialog.
         * 
         * This function:
         * 1. Reads the form values from the registration model
         * 2. Validates that required fields are filled in
         * 3. Creates a Registration record via OData
         * 4. Closes the dialog and refreshes the page
         */
        onSaveRegistration: function () {
            // Read form values from the registration JSON model
            var oRegModel = this.getView().getModel("registration");
            var sFirstName = oRegModel.getProperty("/firstName");
            var sLastName = oRegModel.getProperty("/lastName");
            var sEmail = oRegModel.getProperty("/email");

            // Basic validation — check that all fields have values.
            // .trim() removes whitespace so "   " counts as empty.
            if (!sFirstName || !sFirstName.trim()) {
                MessageBox.warning("Please enter your first name.");
                return;
            }
            if (!sLastName || !sLastName.trim()) {
                MessageBox.warning("Please enter your last name.");
                return;
            }
            if (!sEmail || !sEmail.trim()) {
                MessageBox.warning("Please enter your email address.");
                return;
            }

            // All good — create the registration
            this._createRegistration(sFirstName.trim(), sLastName.trim(), sEmail.trim());
        },

        /**
         * Sends a POST request to create a new Registration in the database.
         * 
         * How OData V4 creation works:
         * 
         * 1. oModel.bindList("/Registrations") creates a temporary "list binding"
         *    pointing to the Registrations collection. Think of it as opening a
         *    connection to the Registrations table.
         * 
         * 2. .create({...}) queues up a new record to be inserted.
         *    The object must match the entity fields in schema.cds.
         *    session_ID links this registration to the session
         *    (it's the foreign key from the Association in your schema).
         * 
         * 3. oModel.submitBatch("$auto") sends the queued request to the server.
         *    CAP receives it, our before-CREATE handler validates it
         *    (checks if session is full), and if all is good, inserts it
         *    into the database.
         * 
         * 4. .then() runs after success — we show a message and refresh.
         *    .catch() runs if something went wrong.
         */
        _createRegistration: function (sFirstName, sLastName, sEmail) {
            var oModel = this.getView().getModel();
            var that = this;

            // Combine first and last name to match the userName field in schema.cds
            var sFullName = sFirstName + " " + sLastName;

            var oListBinding = oModel.bindList("/Registrations");

            oListBinding.create({
                userName: sFullName,
                email: sEmail,
                registeredAt: new Date().toISOString(),
                session_ID: this._sCurrentSessionId
            });

            oModel.submitBatch("$auto").then(function () {
                MessageToast.show("Successfully registered for the session!");

                // Close the dialog
                that.onCloseRegistration();

                // Refresh the page data.
                // This re-fetches the event + sessions from the server,
                // which triggers the after-READ handler in admin-service.js,
                // which recalculates availableSpots with the new registration counted.
                that.getView().getElementBinding().refresh();

            }).catch(function () {
                MessageBox.error("Registration failed. The session might be full.");
            });
        },

        // ---- Formatters (unchanged) ----

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

        formatDate: function (sValue) {
            if (!sValue) {
                return "";
            }
            var oDate = new Date(sValue);
            var oFormat = DateFormat.getDateInstance({
                style: "medium"
            });
            return oFormat.format(oDate);
        },

        formatSpots: function (iAvailable, iCapacity) {
            if (iAvailable === null || iAvailable === undefined) {
                return iCapacity ? "? / " + iCapacity : "";
            }
            return iAvailable + " / " + iCapacity;
        },

        isRegistrationEnabled: function (iAvailable) {
            return !!(iAvailable && iAvailable > 0);
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("events", {}, { replace: true });
        }
    });
});