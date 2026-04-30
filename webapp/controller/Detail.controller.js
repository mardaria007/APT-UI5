sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/f/library"
], (Controller, JSONModel, MessageBox, formatter, f) => {
    "use strict";
    
    return Controller.extend("apt.controller.Detail", {
        formatter: formatter,

        onInit: function () {
            // get router
            this.oRouter = this.getOwnerComponent().getRouter();
            // attach method to bind data to view
            this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);

            // create new JSONModel for the Version Creation Popup
            this._oVersionModel = new JSONModel(); 
            this._oVersionModel.setData({"version": null, "description": null});
            this.getView().setModel(this._oVersionModel, "versionModel");

            this.sDestinationAPI = "http://localhost:8080";

            // create new JSONModel for the Artifact Creation Popup
            this._oArtifactModel = new JSONModel(); 
            this._oArtifactModel.setData({
                "deploymentCategory": null, 
                "assignmentType": null, 
                "description": null, 
                "transportType": null, 
                "transportId": null
            });
            this.getView().setModel(this._oArtifactModel, "artifactModel");
        },
        
        async _onObjectMatched(oEvent) {
            // get the selected Product ID
            this.pId = oEvent.getParameter("arguments").product;
            this.recentVersion = oEvent.getParameter("arguments").rVersion;

            // get the products model and its data and parse it into an object
            let oModel = this.getView().getModel("products");
            let data = oModel.getJSON();
            let cData = JSON.parse(data);
            
            // read the array to find the path of the bindable product
            for (let i = 0; i < cData.length; i++) {
                if (parseInt(cData[i].id) === parseInt(this.pId)) {
                    // Bind the data from the selected Product to the Detail View
                    this.getView().bindElement({
                        path: "/" + i,
                        model: "products"
                    });
                    
                    if (this.recentVersion == " ") {
                        this.getView().byId("idDetailObjectPageSubsectionVersionArtifacts").bindElement({
                            path: "/" + i, 
                            model: "products"
                        })
                    }
                    return;
                }
            };

        },

        async refreshBindings() {
            let data = await new Promise((resolve, reject) => {
                resolve(fetch(this.sDestinationAPI + "/products",{
                    method: "GET"
                }));
            });

            let json = await data.json();
            this.getView().getModel("products").setData(json);
            this.getView().getModel("products").refresh();

        },

        onUpdateFinished() {
            // Highlight the most recent Version
            this.oTableItems = this.byId("idDetailObjectPageSubsectionVersionsTable").getItems();
            this.oTableItems.forEach((oItem) => {
                if (this.recentVersion == oItem.getBindingContext("products").getProperty("id")) {
                    oItem.setHighlight("Information");
                    this.vId = oItem.getBindingContext("products").getProperty("id");

                    this.oCurrentSelectedVersion = oItem.getBindingContext("products");

                     // bind the Version from a path to the Button for Editing the Version
                    this.getView().byId("idDetailObjectPageSubsectionActionEditVersion").bindElement({
                        path: oItem.getBindingContext("products").getPath(),
                        model: "products"
                    });

                    // bind the Artifacts from the binding path of the selected Version to the products model
                    this.getView().byId("idDetailObjectPageSubsectionVersionArtifacts").bindElement({
                        path: oItem.getBindingContext("products").getPath(),
                        model: "products"
                    });

                    // bind the Version from a path to the Button for Releasing the Version
                    this.getView().byId("idDetailObjectPageSubsectionActionPublishVersion").bindElement({
                        path: oItem.getBindingContext("products").getPath(),
                        model: "products"
                    });

                    // bind the Version from a path to the Button for Returning the Version
                    this.getView().byId("idDetailObjectPageSubsectionActionReturnVersion").bindElement({
                        path: oItem.getBindingContext("products").getPath(),
                        model: "products"
                    });
                } else {
                    oItem.setHighlight("None");
                }
            }); 
        },

        onVersionPress(oEvent) {
            // get the selected Version Id
            this.vId = oEvent.getSource().getBindingContext("products").getProperty("id");
            // get the selected Version for later usage
            this.oCurrentSelectedVersion = oEvent.getSource().getBindingContext("products");

            this.oRouter.navTo("RouteDetail", {
                product: this.pId,
                rVersion: this.oCurrentSelectedVersion.getProperty("id"),
                layout: f.LayoutType.TwoColumnsMidExpanded
            });

            // Highlight the current selected Item
            this.oTableItems = this.byId("idDetailObjectPageSubsectionVersionsTable").getItems();
            this.oTableItems.forEach((oItem) => {
                oItem.setHighlight(this.vId == oItem.getBindingContext("products").getProperty("id") ? "Information" : "None");
            });

            // bind the Artifacts from the binding path of the selected Version to the products model
            this.getView().byId("idDetailObjectPageSubsectionVersionArtifacts").bindElement({
                path: oEvent.getSource().getBindingContext("products").getPath(),
                model: "products"
            });

            // bind the Version from a path to the Button for Editing the Version
            this.getView().byId("idDetailObjectPageSubsectionActionEditVersion").bindElement({
                path: oEvent.getSource().getBindingContext("products").getPath(),
                model: "products"
            });

            // bind the Version from a path to the Button for Releasing the Version
            this.getView().byId("idDetailObjectPageSubsectionActionPublishVersion").bindElement({
                path: oEvent.getSource().getBindingContext("products").getPath(),
                model: "products"
            });

            // bind the Version from a path to the Button for Returning the Version
            this.getView().byId("idDetailObjectPageSubsectionActionReturnVersion").bindElement({
                path: oEvent.getSource().getBindingContext("products").getPath(),
                model: "products"
            });
        },

        onArtifactPress(oEvent) {
            // get the selected Artifact ID
            this.aId = oEvent.getSource().getBindingContext("products").getProperty("id");
            // get the selected Artifact for later usage
            this.oCurrentSelectedArtifact = oEvent.getSource().getBindingContext("products");

            // Highlight the current selected Artifact
            this.oArtifactTableItems = this.byId("idDetailObjectPageSubsectionVersionArtifactsTable").getItems();
            this.oArtifactTableItems.forEach((oItem) => {
                oItem.setHighlight(this.aId == oItem.getBindingContext("products").getProperty("id") ? "Information" : "None");
            });
        },

        async onDeleteProductConfirm() {
            // send DELETE Request to the Java API
            await fetch(this.sDestinationAPI + "/products/" + this.pId, {
                method: "DELETE"
            });

            this.refreshBindings();

            // close Dialog
            this.closeDialog("DeleteProductDialog");
            window.history.go(-1);
        },

        onAddVersionDialogBeforeOpen(sDialogName) {
            // reset Popup values
            this._oVersionModel.setData({"version": null, "description": null});
            this["_" + sDialogName].setModel(this._oVersionModel, "versionModel");
        },

        onEditVersionDialogBeforeOpen(sDialogName) {
            // set Popup Values
            this._oVersionModel.setData({"version": this.oCurrentSelectedVersion.getProperty("version"), "description": this.oCurrentSelectedVersion.getProperty("description")});
            this["_" + sDialogName].setModel(this._oVersionModel, "versionModel");
        },

        onAddArtifactDialogBeforeOpen(sDialogName) {
            this._oArtifactModel.setData({
                "deploymentCategory": null, 
                "assignmentType": null, 
                "description": null, 
                "transportType": null, 
                "transportId": null
            });
            this["_" + sDialogName].setModel(this._oArtifactModel, "artifactModel");
        },

        async onAddVersionConfirm() {
            // get the Popup data
            let productId = this.pId;
            let version = this._oVersionModel.getObject("/").version;
            let description = this._oVersionModel.getObject("/").description;
            let body = {
                product: productId,
                version: version,
                description: description
            };

            // send POST Request to the JAVA API
            await fetch(this.sDestinationAPI + "/versions", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            // close Dialog
            this.closeDialog("AddVersionDialog");
            this.refreshBindings();
        },

        async onEditVersionConfirm() {
            // get the Popup data
            let productId = this.pId;
            let version = this._oVersionModel.getObject("/").version;
            let description = this._oVersionModel.getObject("/").description;
            let status = this.oCurrentSelectedVersion.getProperty("status");

            // get Artifacts
            let artifacts = this.oCurrentSelectedVersion.getProperty("artifacts");
            let artifactsIds = [];

            // get only the ids of the Artifacts
            for (let i = 0; i < artifacts.length; i++) {
                artifactsIds.push(artifacts[i].id);
            }
            let body = {
                product: productId,
                version: version,
                description: description,
                status: status,
                artifacts: artifactsIds
            };

            // send POST Request to the JAVA API
            await fetch(this.sDestinationAPI + "/versions/" + this.oCurrentSelectedVersion.getProperty("id"), {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            // close Dialog
            this.closeDialog("EditVersionDialog");
            this.refreshBindings();
        },

        async onAddArtifactConfirm() {
            // get the Popup data
            let versionId = this.vId;
            let deploymentCategory = this._oArtifactModel.getObject("/").deploymentCategory;
            let assignmentType = this._oArtifactModel.getObject("/").assignmentType;
            let transportType = this._oArtifactModel.getObject("/").transportType;
            let transportId = this._oArtifactModel.getObject("/").transportId;
            let description = this._oArtifactModel.getObject("/").description;

            let body = {
                version: versionId,
                description: description,
                deploymentCategory: deploymentCategory,
                assignmentType: assignmentType,
                transportType: transportType,
                externalId: transportId
            };

            // send POST Request to the JAVA API
            await fetch(this.sDestinationAPI+ "/artifacts", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            // close Dialog
            this.closeDialog("AddArtifactDialog");
            this.refreshBindings();
        },

        onPublishVersionPress() {
            // // get the current Version Data 
            // let productId = this.pId; 
            // let versionId = this.vId;
            // let artifacts = this.oCurrentSelectedVersion.getProperty("artifacts");
            // let artifactsIds = [];

            // // get only the ids of the Artifacts
            // for (let i = 0; i < artifacts.length; i++) {
            //     artifactsIds.push(artifacts[i].id);
            // }

            // let body = {
            //     product: productId,
            //     description: this.oCurrentSelectedVersion.getProperty("description"),
            //     version: this.oCurrentSelectedVersion.getProperty("version"),
            //     status: "RELEASED",
            //     artifacts: artifactsIds
            // }

            let sText = this.getText("BeforePublishVersionText");
            let sDialogTitle = this.getText("PublishVersion");

            let that = this;
            // show MessageBox to user
            // Callback checks what button the user pressed
            // and calls the API to update the data
            MessageBox.show(
                sText, {
                    title: sDialogTitle,
                    actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                    onClose: async function (oAction) {
                        if (oAction == MessageBox.Action.OK) {
                            // await fetch("http://localhost:8080/versions/" + versionId, {
                            //     method: "PUT",
                            //     headers: {
                            //         'Content-Type': 'application/json',
                            //     },
                            //     body: JSON.stringify(body)
                            // });

                            await fetch(that.sDestinationAPI + "/versions/" + versionId + "/publish",{
                                method:"GET"
                            });

                            that.refreshBindings();
                        }
                    }
                }
            );
        },

        onReturnVersionPress() {
            // // get the current Version Data 
            // let productId = this.pId; 
            // let versionId = this.vId;
            // let artifacts = this.oCurrentSelectedVersion.getProperty("artifacts");
            // let artifactsIds = [];

            // // get only the ids of the Artifacts
            // for (let i = 0; i < artifacts.length; i++) {
            //     artifactsIds.push(artifacts[i].id);
            // }

            // let body = {
            //     product: productId,
            //     description: this.oCurrentSelectedVersion.getProperty("description"),
            //     version: this.oCurrentSelectedVersion.getProperty("version"),
            //     status: "DEPRECATED",
            //     artifacts: artifactsIds
            // }

            let sText = this.getText("BeforeDeprecateVersionText");
            let sDialogTitle = this.getText("DeprecateVersion");

            let that = this;
            // show MessageBox to user
            // Callback checks what button the user pressed
            // and calls the API to update the data
            MessageBox.show(
                sText, {
                    title: sDialogTitle,
                    actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                    onClose: async function (oAction) {
                        if (oAction == MessageBox.Action.OK) {
                            // await fetch("http://localhost:8080/versions/" + versionId, {
                            //     method: "PUT",
                            //     headers: {
                            //         'Content-Type': 'application/json',
                            //     },
                            //     body: JSON.stringify(body)
                            // });
                            await fetch(that.sDestinationAPI + "/versions/" + versionId + "/return", {
                                method: "GET"
                            });

                            that.refreshBindings();
                        }
                    }
                }
            );
        },

        onDeleteVersionPress() {
            // get the current selected Version ID
            let versionId = this.vId;
            let oI18nModel = this._oI18nModel;

            let sText = this.getText("BeforeDeleteVersionText");
            let sDialogTitle = this.getText("DeleteVersion");
            
            let that = this;
            // show MessageBox to user
            // Callback checks what button the user pressed
            // and calls the API to delete the Version
            MessageBox.show(sText, {
                title: sDialogTitle,
                actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                onClose: async function (oAction) {
                    if (oAction == MessageBox.Action.OK) {
                        await fetch(that.sDestinationAPI + "/versions/" + versionId, {
                            method: "DELETE"
                        });

                        that.refreshBindings();
                    }
                }
            });
        },

        onDeleteArtifactPress() {
            // get the current selected Artifact ID
            let artifactId = this.aId;
            let oI18nModel = this._oI18nModel;

            let sText = this.getText("BeforeDeleteArtifactText");
            let sDialogTitle = this.getText("DeleteArtifact");
            let that = this;
            // show MessageBox to user
            // Callback checks what button the user pressed
            // and calls the API to delete the Artifact
            MessageBox.show(sText, {
                title: sDialogTitle,
                actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                onClose: async function (oAction) {
                    if (oAction == MessageBox.Action.OK) {
                        await fetch(that.sDestinationAPI + "/artifacts/" + artifactId, {
                            method: "DELETE"
                        });

                        that.refreshBindings();
                    }
                }
            });
        },

        onDeploymentCategoryChange(oEvent) {
            this._oArtifactModel.getObject("/").deploymentCategory = oEvent.getSource().getSelectedItem().getKey();
        },

        onAssignmentTypeChange(oEvent) {
            this._oArtifactModel.getObject("/").assignmentType = oEvent.getSource().getSelectedItem().getKey();
        },

        onTransportTypeChange(oEvent) {
            this._oArtifactModel.getObject("/").transportType = oEvent.getSource().getSelectedItem().getKey();
        }
    })
})