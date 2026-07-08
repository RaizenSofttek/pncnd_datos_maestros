sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/ui/comp/smarttable/SmartTable"
], function (Controller, JSONModel, SelectDialog, StandardListItem, SmartFilterBar, SmartTable) {
    "use strict";

    // Columnas por defecto para cada entity set (property names del OData)
    var mColumnas = {
        "PNCND_APROB_X_OF_VENTAS": "vkorg,vtweg,spart,id_tipo_aprob,nivel,vkbur,bran2,mail",
        "PNCND_APROB_X_FUNCION"  : "cod_concepto,id_tipo_aprob,nivel,mail"
    };

    return Controller.extend("zpncnd.datos.maestros.pncnddatosmaestros.controller.Main", {

        _oSelectDialog  : null,
        _oSmartFilterBar: null,
        _oSmartTable    : null,

        onInit: function () {
            var oTablasModel = new JSONModel({
                selectedDesc: "Aprobadores por Oficina de Ventas",
                selectedId  : "PNCND_APROB_X_OF_VENTAS",
                tablas: [
                    { id_tabla: "PNCND_APROB_X_OF_VENTAS", descripcion: "Aprobadores por Oficina de Ventas" },
                    { id_tabla: "PNCND_APROB_X_FUNCION",   descripcion: "Aprobadores por Función" }
                ]
            });
            this.getView().setModel(oTablasModel, "tablas");

            // Cargar la primera tabla por defecto
            this._crearTabla("PNCND_APROB_X_OF_VENTAS", "Aprobadores por Oficina de Ventas");
        },

        // Abre el value help para seleccionar la tabla
        onAbrirSelectorTabla: function () {
            if (!this._oSelectDialog) {
                this._oSelectDialog = new SelectDialog({
                    id          : this.createId("lb_tabla_sel"),
                    title       : "Seleccionar Tabla",
                    multiSelect : false,
                    rememberSelections: true,
                    confirm     : this.onConfirmTabla.bind(this)
                });

                this._oSelectDialog.setModel(this.getView().getModel("tablas"), "tablas");
                this._oSelectDialog.bindAggregation("items", {
                    path    : "tablas>/tablas",
                    template: new StandardListItem({
                        title      : "{tablas>descripcion}",
                        description: "{tablas>id_tabla}",
                        type       : "Active"
                    })
                });

                this.getView().addDependent(this._oSelectDialog);
            }
            this._oSelectDialog.open();
        },

        // Confirma la selección del value help
        onConfirmTabla: function (oEvent) {
            var oItem = oEvent.getParameter("selectedItem");
            if (!oItem) { return; }

            var oCtx  = oItem.getBindingContext("tablas");
            var sId   = oCtx.getProperty("id_tabla");
            var sDesc = oCtx.getProperty("descripcion");

            var oModel = this.getView().getModel("tablas");
            oModel.setProperty("/selectedDesc", sDesc);
            oModel.setProperty("/selectedId",   sId);

            this._crearTabla(sId, sDesc);
        },

        // Crea SmartFilterBar + SmartTable para el entity set indicado
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

            // SmartFilterBar
            this._oSmartFilterBar = new SmartFilterBar({
                entityType          : sEntitySet,
                useVariantManagement: false,
                showFilterConfiguration: false
            });
            this._oSmartFilterBar.setModel(oModel);

            // SmartTable — 'columns' define las columnas visibles por defecto
            this._oSmartTable = new SmartTable({
                entitySet              : sEntitySet,
                smartFilterId          : this._oSmartFilterBar.getId(),
                tableType              : "ResponsiveTable",
                useExportToExcel       : true,
                useVariantManagement   : false,
                useTablePersonalisation: true,
                enableAutoBinding      : true,
                header                 : sTitle,
                showRowCount           : true,
                columns                : mColumnas[sEntitySet]
            });
            this._oSmartTable.setModel(oModel);

            oContainer.addItem(this._oSmartFilterBar);
            oContainer.addItem(this._oSmartTable);
        }
    });
});
