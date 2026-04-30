sap.ui.define([], function() {
    "use strict";
    return {
        checkVersionReleasedStatus(s) {
            if (s) {
                if (s == "IN_PROCESS") return true;
                else return false;
            }
            return false;
        },

        checkStatus(s) {
            if (s === "RELEASED") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("StatusReleased");
            } else if (s === "IN_PROCESS") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("StatusInProcess");
            } else if (s === "DEPRECATED") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("StatusDeprecated");
            }
        },
        
        checkDeploymentCategory(s) {
            if (s === "FRONTEND") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DeploymentCategoryFrontend");
            } else if (s === "BACKEND") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DeploymentCategoryBackend");
            } else if (s === "FRONTEND_AND_BACKEND"){
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("DeploymentCategoryFrontendAndBackend");
            }
        },

        checkAssignmentType(s){
            if (s === "DELTA") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("AssingnmentTypeDelta");
            } else if (s === "DELIVERY") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("AssingnmentTypeDelivery");
            }
        },

        checkTransportType(s) {
            if (s === "WORKBENCH") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TransportTypeWorkbench");
            } else if (s === "CONFIGURATION") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TransportTypeConfig");
            } else if (s === "TRANSPORT_OF_COPIES") {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("TransportTypeTOC");
            }
        }
    }
});