sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], (Controller, History) => {
    "use strict";

    return Controller.extend("apt.controller.BaseController", {
        onInit() {},

        showDialog(sDialogName, sInputValue = 0) {
            if (!this["_" + sDialogName]) {
                this["_" + sDialogName] = sap.ui.xmlfragment(sDialogName, "apt.view." + sDialogName, this);
                this.getView().addDependent(this["_" + sDialogName]);
            }

            if (sInputValue != 0) {
                this["_" + sDialogName].open(sInputValue);
            } else {
                this["_" + sDialogName].open();
            }
        },

        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        getDestinationAPI() {
            return "http://localhost:8080";
        },

        async refreshBindings() {
            let data = await new Promise((resolve, reject) => {
                resolve(fetch(this.getDestinationAPI() + "/products",{
                    method: "GET"
                }));
            });

            let json = await data.json();
            this.getView().getModel("products").setData(json);
            this.getView().getModel("products").refresh();

        },

        closeDialog(sDialogName) {
            this["_" + sDialogName].close();
        },

        getText(sText) {
            return  this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sText);
        }
    });
});