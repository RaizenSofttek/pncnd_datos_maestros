sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
    "use strict";

    var NOMBRE = "Auditoría - Rel. Concepto - Tipo Documento";
    var ST_ID  = "stRelConcTipoDocAudit";

    function RelConcTipoDocAudit(oController) {
        this.c = oController;
    }

    var p = RelConcTipoDocAudit.prototype;

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
                new Filter("id_tipo_op_anterior",  FilterOperator.Contains, sQ),
                new Filter("id_tipo_doc_anterior", FilterOperator.Contains, sQ),
                new Filter("linea_moa_anterior",   FilterOperator.Contains, sQ),
                new Filter("cod_concepto_nuevo",   FilterOperator.Contains, sQ),
                new Filter("id_tipo_doc_nuevo",    FilterOperator.Contains, sQ)
            ],
            and: false
        })] : [];
        oTable.getBinding("items").filter(aF);
    };

    return RelConcTipoDocAudit;
});
