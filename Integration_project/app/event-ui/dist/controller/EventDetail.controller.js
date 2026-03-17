import Controller from "sap/ui/core/mvc/Controller";
/**
 * @namespace my.app.controller
 */
export default class EventDetail extends Controller {
    onInit() {
        const oRouter = this.getOwnerComponent().getRouter();
        // Gebruik de specifieke route naam uit je manifest.json
        oRouter.getRoute("eventDetail")?.attachPatternMatched(this._onObjectMatched, this);
    }
    _onObjectMatched(oEvent) {
        // Haal de argumenten uit de URL
        const oArgs = oEvent.getParameter("arguments");
        const sEventId = oArgs.eventId;
        const oView = this.getView();
        if (oView) {
            // Bind het element aan de view (OData V4 syntax)
            oView.bindElement({
                path: `/Events(${sEventId})`
            });
        }
    }
}
