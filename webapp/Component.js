sap.ui.define([
    "sap/ui/core/UIComponent",
    "apt/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/f/library"
], (UIComponent, models, JSONModel, f) => {
    "use strict";

    return UIComponent.extend("apt.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
            let oModel = new JSONModel();
            this.setModel(oModel, "comp");  

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
            this.getRouter().initialize();

        },

        _onBeforeRouteMatched(oEvent) {
            let oModel = this.getModel("comp");
            let oLayout = oEvent.getParameter("arguments").layout;
            if(!oLayout) {
                oLayout = f.LayoutType.OneColumn;
            }
            oModel.setProperty("/layout", oLayout);
        }
    });
});