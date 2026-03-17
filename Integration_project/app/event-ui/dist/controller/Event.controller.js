import Controller from "sap/ui/core/mvc/Controller";
/**
 * @namespace eventui.controller
 */
export default class Events extends Controller {
    onViewDetails(oEvent) {
        // 1. Haal de bron van het event op en cast naar ColumnListItem
        const oItem = oEvent.getSource();
        const oBindingContext = oItem.getBindingContext();
        if (oBindingContext) {
            // 2. Haal de ID op
            const sEventId = oBindingContext.getProperty("ID");
            // 3. Navigeer via de Router
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("eventDetail", {
                eventId: sEventId
            });
        }
    }
}
