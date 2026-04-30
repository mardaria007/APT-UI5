sap.ui.define(
    [
	    
        "sap/ui/core/mvc/Controller"
    ], 
    function (t) { 
        "use strict"; 
        return t.extend("apt.controller.Fcl", { 
            onInit: function () { 
                this.oRouter = this.getOwnerComponent().getRouter(); 
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            }, 
            onRouteMatched: function (oEvent) { 
                let sRouteName = oEvent.getParameter("name"); 
                let oItem = oEvent.getParameter("arguments"); 
                this.currentRouteName = sRouteName; 
                this.currentProduct = oItem.product;
            }, 
            onFlexibleColumnLayoutStateChange: function (oEvent) { 
                let isNavArrow = oEvent.getParameter("isNavigationArrow"); 
                let oLayout = oEvent.getParameter("layout"); 
                if (isNavArrow) { 
                    this.oRouter.navTo(this.currentRouteName, { 
                        layout: oLayout, 
                        product: this.currentProduct 
                    }) 
                } 
            }, 
            onExit: function () { 
                this.oRouter.detachRouteMatched(this.onRouteMatched, this)
            } 
        }) 
    }
);