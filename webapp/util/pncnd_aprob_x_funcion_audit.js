sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Fragment, Filter, FilterOperator) {
    "use strict";

    var NOMBRE = "Auditoría - Aprobadores por Función";
    var ST_ID  = "stFuncionAudit";

    function AprobXFuncionAudit(oController) {
        this.c = oController;
    }

    var p = AprobXFuncionAudit.prototype;

    p.getNombre    = function () { return NOMBRE; };
    p.getColsCarga = function () { return []; };

    p._innerTable = function () { return this.c._getInnerTable(ST_ID); };

    p.onSearch = function (oEvent) {
        var sQ     = oEvent.getParameter("newValue").trim();
        var oTable = this._innerTable();
        if (!oTable) { return; }
        var aF = sQ ? [new Filter({
            filters: [
                new Filter("accion",               FilterOperator.Contains, sQ),
                new Filter("usuario_modificacion", FilterOperator.Contains, sQ),
                new Filter("cod_concepto_anterior",FilterOperator.Contains, sQ),
                new Filter("mail_anterior",         FilterOperator.Contains, sQ),
                new Filter("mail_nuevo",            FilterOperator.Contains, sQ)
            ],
            and: false
        })] : [];
        oTable.getBinding("items").filter(aF);
    };

    p.onFiltrar = function () {
        var sFragId  = this.c._sCurrentFragId;
        var oTable   = this._innerTable();
        if (!oTable || !sFragId) { return; }
        var sAccion  = Fragment.byId(sFragId, "fAccion").getValue().trim();
        var oFecha   = Fragment.byId(sFragId, "fFecha").getDateValue();
        var sUsuario = Fragment.byId(sFragId, "fUsuario").getValue().trim();
        var aFilters = [];
        if (sAccion) {
            aFilters.push(new Filter("accion", FilterOperator.Contains, sAccion));
        }
        if (oFecha) {
            var oStart = new Date(oFecha.getFullYear(), oFecha.getMonth(), oFecha.getDate(), 0, 0, 0, 0);
            var oEnd   = new Date(oFecha.getFullYear(), oFecha.getMonth(), oFecha.getDate(), 23, 59, 59, 999);
            aFilters.push(new Filter("fecha_modificacion", FilterOperator.BT, oStart, oEnd));
        }
        if (sUsuario) {
            aFilters.push(new Filter("usuario_modificacion", FilterOperator.Contains, sUsuario));
        }
        oTable.getBinding("items").filter(
            aFilters.length ? [new Filter({ filters: aFilters, and: true })] : []
        );
    };

    p.onLimpiarFiltros = function () {
        var sFragId = this.c._sCurrentFragId;
        var oTable  = this._innerTable();
        if (!sFragId) { return; }
        Fragment.byId(sFragId, "fAccion").setValue("");
        Fragment.byId(sFragId, "fFecha").setValue("");
        Fragment.byId(sFragId, "fUsuario").setValue("");
        if (oTable) { oTable.getBinding("items").filter([]); }
    };

    return AprobXFuncionAudit;
});
