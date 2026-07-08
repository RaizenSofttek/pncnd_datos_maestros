sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/ui/comp/smarttable/SmartTable"
], function (Controller, JSONModel, SmartFilterBar, SmartTable) {
    "use strict";

    return Controller.extend("zpncnd.datos.maestros.pncnddatosmaestros.controller.Main", {

        _oSmartFilterBar: null,
        _oSmartTable: null,

        onInit: function () {
            var oTablasModel = new JSONModel({
                tablas: [
                    {
                        id_tabla    : "PNCND_APROB_X_OF_VENTAS",
                        descripcion : "Aprobadores por Oficina de Ventas"
                    },
                    {
                        id_tabla    : "PNCND_APROB_X_FUNCION",
                        descripcion : "Aprobadores por Función"
                    }
                ]
            });
            this.getView().setModel(oTablasModel, "tablas");
        },

        onAfterRendering: function () {
            // Auto-seleccionar la primera tabla al cargar
            var oList = this.byId("lb_tabla_sel");
            var fnInit = function () {
                var aItems = oList.getItems();
                if (aItems.length > 0 && !oList.getSelectedItem()) {
                    oList.setSelectedItem(aItems[0]);
                    var oCtx = aItems[0].getBindingContext("tablas");
                    this._crearTabla(
                        oCtx.getProperty("id_tabla"),
                        oCtx.getProperty("descripcion")
                    );
                }
            }.bind(this);

            // Esperar a que los items estén bindeados
            if (oList.getItems().length > 0) {
                fnInit();
            } else {
                oList.attachUpdateFinished(fnInit);
            }
        },

        onTablaSelChange: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oCtx  = oItem.getBindingContext("tablas");
            this._crearTabla(
                oCtx.getProperty("id_tabla"),
                oCtx.getProperty("descripcion")
            );
        },

        _crearTabla: function (sEntitySet, sTitle) {
            var oContainer = this.byId("containerTable");
            var oModel     = this.getOwnerComponent().getModel();

            // Destruir controles anteriores
            if (this._oSmartTable) {
                oContainer.removeItem(this._oSmartTable);
                this._oSmartTable.destroy();
                this._oSmartTable = null;
            }
            if (this._oSmartFilterBar) {
                oContainer.removeItem(this._oSmartFilterBar);
                this._oSmartFilterBar.destroy();
                this._oSmartFilterBar = null;
            }

            // Crear SmartFilterBar
            this._oSmartFilterBar = new SmartFilterBar({
                entityType          : sEntitySet,
                useVariantManagement: false,
                showFilterConfiguration: false
            });
            this._oSmartFilterBar.setModel(oModel);

            // Crear SmartTable
            this._oSmartTable = new SmartTable({
                entitySet            : sEntitySet,
                smartFilterId        : this._oSmartFilterBar.getId(),
                tableType            : "ResponsiveTable",
                useExportToExcel     : true,
                useVariantManagement : false,
                useTablePersonalisation: true,
                enableAutoBinding    : true,
                header               : sTitle,
                showRowCount         : true
            });
            this._oSmartTable.setModel(oModel);

            // Sin anotaciones UI.LineItem en el servicio CAP, SmartTable
            // inicializa con todas las columnas ocultas. Las forzamos visibles.
            this._oSmartTable.attachInitialise(function () {
                var oInnerTable = this._oSmartTable.getTable();
                if (oInnerTable) {
                    oInnerTable.getColumns().forEach(function (oCol) {
                        oCol.setVisible(true);
                    });
                }
            }.bind(this));

            oContainer.addItem(this._oSmartFilterBar);
            oContainer.addItem(this._oSmartTable);
        }
    });
});
