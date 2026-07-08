sap.ui.define([
    "sap/ui/core/UIComponent",
    "zpncnd/datos/maestros/pncnddatosmaestros/model/models"
], function (UIComponent, models) {
    "use strict";

    return UIComponent.extend("zpncnd.datos.maestros.pncnddatosmaestros.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            this.getRouter().initialize();
        }
    });
});
