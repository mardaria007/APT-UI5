sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], (Controller, History) => {
    "use strict";

    return Controller.extend("apt.controller.BaseController", {
        onInit() {
        },

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

        closeDialog(sDialogName) {
            this["_" + sDialogName].close();
        },

        getText(sText) {
            return  this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sText);
        }
    });
});