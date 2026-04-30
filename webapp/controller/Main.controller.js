sap.ui.define([
    "./BaseController",
    "sap/f/library",
    "sap/ui/model/json/JSONModel"
], (Controller, f, JSONModel) => {
    "use strict";

    return Controller.extend("apt.controller.Main", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this._oProductModel = new JSONModel(); 
            this._oProductModel.setData({"externalId": null, "name": null, "link": null});
            this.getView().setModel(this._oProductModel, "productModel");
        },

        onProductPress(oEvent) {
            this.pId = oEvent.getSource().getBindingContext("products").getProperty("id");
            this.oProduct = oEvent.getSource().getBindingContext("products");
            let recentVersion = this.getMostRecentReleasedVersionForSelectedProduct(this.oProduct);
            this.oRouter.navTo("RouteDetail", {
                product: this.pId,
                rVersion: recentVersion ? recentVersion.id : " ",
                layout: f.LayoutType.TwoColumnsMidExpanded
            });
        },

        getMostRecentReleasedVersionForSelectedProduct(product) {
            let versions = product.getProperty("versions");
            let maxVersion = versions.reduce((max, version) => (version.version > max.version ? version : max), versions[0]);
            return maxVersion;
        },

        onAddProductConfirm() {
            // get the Popup data
            let productId = this._oProductModel.getObject("/").externalId;
            let name = this._oProductModel.getObject("/").name;
            let link = this._oProductModel.getObject("/").link;
            let body = {
                productExternalId: productId,
                productName: name,
                productLink: link
            };

            // send POST Request to the JAVA API
            fetch("http://localhost:8080/products", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            // close Dialog
            this.closeDialog("AddProductDialog");
        },

        onAddProductDialogBeforeOpen(sDialogName) {
            // reset Popup values
            this._oProductModel.setData({"externalId": null, "name": null, "link": null});
            this["_" + sDialogName].setModel(this._oProductModel, "productModel");
        },
    });
});