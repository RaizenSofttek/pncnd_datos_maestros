sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog"
], function (MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, BusyDialog) {
    "use strict";

    var ENTITY_SET = "PNCND_REL_CONC_MOA";
    var NOMBRE     = "Rel. Concepto - MOA";
    var ST_ID      = "stRelConcMoa";

    var COLS_TEMPLATE = [
        { label: "Cod. Concepto", hint: "Texto - máx. 18 caracteres" },
        { label: "Id. Tipo Op.",  hint: "Texto - máx. 14 caracteres" },
        { label: "Linea MOA",     hint: "Texto - máx. 10 caracteres" },
        { label: "Nombre",        hint: "Texto - máx. 40 caracteres" },
        { label: "Clasificación", hint: "Texto - máx. 40 caracteres" }
    ];

    var COLS_CARGA = [
        { field: "cod_concepto",  header: "Cod. Concepto", type: "String" },
        { field: "id_tipo_op",    header: "Id. Tipo Op.",  type: "String" },
        { field: "linea_moa",     header: "Linea MOA",     type: "String" },
        { field: "nombre",        header: "Nombre",        type: "String" },
        { field: "clasificacion", header: "Clasificación", type: "String" }
    ];

    var COLS_NO_CLAVE = [
        { field: "nombre",        label: "Nombre",        maxLength: 40, hint: "Nombre descriptivo"  },
        { field: "clasificacion", label: "Clasificación", maxLength: 40, hint: "Clasificación"       }
    ];

    function RelConcMoa(oController) {
        this.c             = oController;
        this._sEditPath    = null;
        this._aMMItems     = null;
        this._oFile        = null;
        this._oDlgEditar   = null;  this._sDlgEditarId = null;
        this._oDlgMM       = null;  this._sDlgMMId     = null;
        this._oDlgCM       = null;  this._sDlgCMId     = null;
        this._oDlgCP       = null;  this._sDlgCPId     = null;
    }

    var p = RelConcMoa.prototype;

    p.getNombre    = function () { return NOMBRE; };
    p.getColsCarga = function () { return COLS_CARGA; };

    p._model      = function () { return this.c.getOwnerComponent().getModel(); };
    p._innerTable = function () { return this.c._getInnerTable(ST_ID); };

    // ── BÚSQUEDA ─────────────────────────────────────────────────────────────
    p.onSearch = function (oEvent) {
        var sQ     = oEvent.getParameter("newValue").trim();
        var oTable = this._innerTable();
        if (!oTable) { return; }
        var aF = sQ ? [new Filter({
            filters: [
                new Filter("cod_concepto",  FilterOperator.Contains, sQ),
                new Filter("id_tipo_op",    FilterOperator.Contains, sQ),
                new Filter("linea_moa",     FilterOperator.Contains, sQ),
                new Filter("nombre",        FilterOperator.Contains, sQ),
                new Filter("clasificacion", FilterOperator.Contains, sQ)
            ],
            and: false
        })] : [];
        oTable.getBinding("items").filter(aF);
    };

    // ── EDITAR ───────────────────────────────────────────────────────────────
    p.onEditar = function (oEvent) {
        var oCtx  = oEvent.getSource().getBindingContext();
        var oData = oCtx.getObject();
        this._sEditPath = oCtx.getPath();
        var that = this;
        this._getDlgEditar().then(function () {
            var sId = that._sDlgEditarId;
            Fragment.byId(sId, "eMoaCodConcepto").setValue(oData.cod_concepto);
            Fragment.byId(sId, "eMoaIdTipoOp").setValue(oData.id_tipo_op);
            Fragment.byId(sId, "eMoaLineaMoa").setValue(oData.linea_moa);
            Fragment.byId(sId, "eMoaNombre").setValue(oData.nombre || "");
            Fragment.byId(sId, "eMoaClasificacion").setValue(oData.clasificacion || "");
            that._oDlgEditar.open();
        });
    };

    p.onConfirmarEditar = function () {
        var sNombre        = Fragment.byId(this._sDlgEditarId, "eMoaNombre").getValue().trim();
        var sClasificacion = Fragment.byId(this._sDlgEditarId, "eMoaClasificacion").getValue().trim();
        var that = this;
        MessageBox.confirm("¿Confirma la Edición del Registro?", {
            title  : "Confirmar Edición",
            onClose: function (sAction) {
                if (sAction !== MessageBox.Action.OK) { return; }
                that._model().update(that._sEditPath, { nombre: sNombre, clasificacion: sClasificacion }, {
                    success: function () {
                        that._oDlgEditar.close();
                        MessageToast.show("Registro actualizado correctamente");
                        that._model().refresh();
                    },
                    error: function (oErr) {
                        MessageBox.error("Error al actualizar: " + (oErr.message || oErr.statusCode));
                    }
                });
            }
        });
    };

    p.onCancelarEditar = function () { this._oDlgEditar.close(); };

    // ── ELIMINAR ─────────────────────────────────────────────────────────────
    p.onEliminar = function (oEvent) {
        var oCtx  = oEvent.getSource().getBindingContext();
        var oData = oCtx.getObject();
        var sPath = oCtx.getPath();
        var sDesc = "'" + oData.cod_concepto + "' / '" + oData.id_tipo_op + "' / '" + oData.linea_moa + "'";
        var that  = this;
        MessageBox.confirm("¿Confirma la Eliminación del Registro " + sDesc + "?", {
            title           : "Confirmar Eliminación",
            emphasizedAction: MessageBox.Action.OK,
            onClose         : function (sAction) {
                if (sAction !== MessageBox.Action.OK) { return; }
                that._model().remove(sPath, {
                    success: function () {
                        MessageToast.show("Registro eliminado correctamente");
                        that._model().refresh();
                    },
                    error: function (oErr) {
                        MessageBox.error("Error al eliminar: " + (oErr.message || oErr.statusCode));
                    }
                });
            }
        });
    };

    // ── MODIFICACIÓN MASIVA ──────────────────────────────────────────────────
    p.onModMasiva = function () {
        var oTable    = this._innerTable();
        if (!oTable)  { return; }
        var aSelected = oTable.getSelectedItems();
        if (!aSelected.length) {
            MessageToast.show("Seleccione 1 o más Registros para Editar");
            return;
        }
        this._aMMItems     = aSelected;
        this.c._activeUtil = this;
        var aCampos = COLS_NO_CLAVE.map(function (o) {
            return { field: o.field, label: o.label, maxLength: o.maxLength, hint: o.hint, value: "" };
        });
        var that = this;
        this._getDlgMM().then(function () {
            that._oDlgMM.setModel(new JSONModel({ campos: aCampos }), "modMasiva");
            that._oDlgMM.open();
        });
    };

    p.onAceptarModMasiva = function () {
        var aCampos     = this._oDlgMM.getModel("modMasiva").getProperty("/campos");
        var sCampoVacio = null;
        aCampos.forEach(function (o) { if (!o.value.trim()) { sCampoVacio = o.label; } });
        if (sCampoVacio) {
            MessageToast.show("Complete el campo \"" + sCampoVacio + "\" antes de continuar");
            return;
        }
        var that = this;
        MessageBox.confirm("¿Está seguro que desea modificar todos los registros seleccionados con el valor ingresado?", {
            title  : "Confirmar Modificación Masiva",
            onClose: function (sAction) {
                if (sAction !== MessageBox.Action.OK) { return; }
                var oPayload = {};
                aCampos.forEach(function (o) { oPayload[o.field] = o.value.trim(); });
                var oModel = that._model();
                var nTotal = that._aMMItems.length;
                var nOK = 0, nErr = 0;
                function fnCheck() {
                    if (nOK + nErr < nTotal) { return; }
                    that._oDlgMM.close();
                    oModel.refresh();
                    nErr === 0
                        ? MessageToast.show(nTotal + " registro(s) actualizado(s) correctamente")
                        : MessageBox.warning(nOK + " actualizado(s), " + nErr + " con error.");
                }
                that._aMMItems.forEach(function (oItem) {
                    oModel.update(oItem.getBindingContext().getPath(), oPayload, {
                        success: function () { nOK++;  fnCheck(); },
                        error  : function () { nErr++; fnCheck(); }
                    });
                });
            }
        });
    };

    p.onCancelarModMasiva = function () { this._oDlgMM.close(); };

    // ── TEMPLATE XLS ─────────────────────────────────────────────────────────
    p.onDescargarTemplate = function () {
        this.c._descargarTemplate(ENTITY_SET, COLS_TEMPLATE);
    };

    // ── CARGA MASIVA ─────────────────────────────────────────────────────────
    p.onCargaMasiva = function () {
        this._oFile        = null;
        this.c._activeUtil = this;
        var that = this;
        this._getDlgCM().then(function () {
            var oFU  = Fragment.byId(that._sDlgCMId, "fuCargaMasiva");
            var oBtn = Fragment.byId(that._sDlgCMId, "btnProcesarCarga");
            if (oFU)  { oFU.clear(); }
            if (oBtn) { oBtn.setEnabled(false); }
            that._oDlgCM.open();
        });
    };

    p.onArchivoSeleccionado = function (oEvent) {
        var oFiles  = oEvent.getParameter("files");
        this._oFile = (oFiles && oFiles.length) ? oFiles[0] : null;
        var oBtn    = Fragment.byId(this._sDlgCMId, "btnProcesarCarga");
        if (oBtn)   { oBtn.setEnabled(!!this._oFile); }
    };

    p.onCancelarCarga = function () { this._oDlgCM.close(); };

    p.onProcesarCarga = function () {
        if (!this._oFile) { return; }
        var that = this;
        this.c._cargarXlsx().then(function (XLSX) {
            var oReader = new FileReader();
            oReader.onload = function (e) {
                try {
                    var oWB   = XLSX.read(e.target.result, { type: "binary" });
                    var oWS   = oWB.Sheets[oWB.SheetNames[0]];
                    var aRows = XLSX.utils.sheet_to_json(oWS, { header: 1, defval: "" });
                    if (!aRows.length) { MessageBox.error("El archivo está vacío."); return; }

                    var aHdrs = aRows[0].map(function (h) { return String(h).trim(); });
                    var aEsp  = COLS_CARGA.map(function (o) { return o.header; });
                    var bOK   = aEsp.length === aHdrs.length && aEsp.every(function (h, i) { return h === aHdrs[i]; });
                    if (!bOK) {
                        var sDetect = that.c._detectarEntidad(aHdrs);
                        MessageBox.error("El archivo no corresponde a la tabla actual.\n" +
                            (sDetect ? "Parece corresponder a: \"" + sDetect + "\"." : "No se pudo determinar a qué tabla corresponde."));
                        return;
                    }

                    var aData = [];
                    for (var i = 2; i < aRows.length; i++) {
                        var aFila = aRows[i];
                        if (aFila.every(function (v) { return String(v).trim() === ""; })) { continue; }
                        var oReg = {};
                        COLS_CARGA.forEach(function (oCol, idx) {
                            oReg[oCol.field] = String(aFila[idx] !== undefined ? aFila[idx] : "").trim();
                        });
                        aData.push(oReg);
                    }
                    if (!aData.length) {
                        MessageBox.warning("El archivo no contiene registros (los datos deben comenzar en la fila 3).");
                        return;
                    }

                    var aErrors = [];
                    aData.forEach(function (oReg, idx) {
                        ["cod_concepto", "id_tipo_op", "linea_moa"].forEach(function (sF) {
                            if (!oReg[sF]) {
                                aErrors.push("Fila " + (idx + 3) + ": campo \"" + sF + "\" es requerido");
                            }
                        });
                    });
                    if (aErrors.length) {
                        var sMsg = aErrors.slice(0, 20).join("\n");
                        if (aErrors.length > 20) { sMsg += "\n... y " + (aErrors.length - 20) + " error(es) más."; }
                        MessageBox.error(sMsg, { title: "Errores de Validación — Carga interrumpida" });
                        return;
                    }

                    that._oDlgCM.close();
                    that._procesarRegistros(aData);
                } catch (err) {
                    MessageBox.error("Error al procesar el archivo: " + err.message);
                }
            };
            oReader.readAsBinaryString(that._oFile);
        }).catch(function () {
            MessageBox.error("No se pudo cargar el procesador de Excel. Recargue la aplicación.");
        });
    };

    p._procesarRegistros = function (aData) {
        var that   = this;
        var nTotal = aData.length;
        var nProc  = 0, nErr = 0;
        var oModel = this._model();
        var oMdl   = new JSONModel({
            porcentaje: 0, displayValue: "0 / " + nTotal, estado: "None",
            mensaje: "Procesando 0 de " + nTotal + " registro(s)...",
            cerrarEnabled: false, log: []
        });
        this._getDlgCP().then(function () {
            that._oDlgCP.setModel(oMdl, "carga");
            that._oDlgCP.open();
            function fnSig(idx) {
                if (idx >= nTotal) {
                    oMdl.setProperty("/cerrarEnabled", true);
                    oMdl.setProperty("/mensaje", "Finalizado: " + (nTotal - nErr) + " OK, " + nErr + " con error.");
                    oMdl.setProperty("/estado", nErr === 0 ? "Success" : "Error");
                    oModel.refresh();
                    return;
                }
                oModel.create("/" + ENTITY_SET, aData[idx], {
                    success: function () {
                        nProc++;
                        var nPct = Math.round((nProc / nTotal) * 100);
                        oMdl.setProperty("/porcentaje",   nPct);
                        oMdl.setProperty("/displayValue", nProc + " / " + nTotal);
                        oMdl.setProperty("/mensaje", "Procesando " + nProc + " de " + nTotal + " registro(s)...");
                        var aLog = oMdl.getProperty("/log");
                        aLog.push({ texto: "Fila " + (idx + 3) + ": Insertado correctamente", estado: "Success", icono: "OK" });
                        oMdl.setProperty("/log", aLog);
                        fnSig(idx + 1);
                    },
                    error: function (oErr) {
                        nProc++; nErr++;
                        var nPct = Math.round((nProc / nTotal) * 100);
                        oMdl.setProperty("/porcentaje",   nPct);
                        oMdl.setProperty("/displayValue", nProc + " / " + nTotal);
                        var sMsg = "Error";
                        try {
                            var oBody = JSON.parse(oErr.responseText);
                            sMsg = (oBody.error && oBody.error.message)
                                ? (oBody.error.message.value || oBody.error.message)
                                : (oErr.statusText || "Error");
                        } catch (ex) { sMsg = oErr.statusText || "Error desconocido"; }
                        var aLog = oMdl.getProperty("/log");
                        aLog.push({ texto: "Fila " + (idx + 3) + ": " + sMsg, estado: "Error", icono: "ERR" });
                        oMdl.setProperty("/log", aLog);
                        fnSig(idx + 1);
                    }
                });
            }
            fnSig(0);
        });
    };

    p.onCerrarProgreso = function () { this._oDlgCP.close(); };

    p.onEscapeProgreso = function (oEvent) {
        var bEnabled = this._oDlgCP &&
                       this._oDlgCP.getModel("carga") &&
                       this._oDlgCP.getModel("carga").getProperty("/cerrarEnabled");
        if (!bEnabled) { oEvent.preventDefault(); }
    };

    // ── Dialog loaders (lazy) ────────────────────────────────────────────────
    p._getDlgEditar = function () {
        var that = this;
        if (this._oDlgEditar) { return Promise.resolve(); }
        var sId = this.c.createId("moa_dlgEdit");
        this._sDlgEditarId = sId;
        return Fragment.load({ id: sId, controller: this.c,
            name: "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.DialogEditarRelConcMoa"
        }).then(function (oD) { that._oDlgEditar = oD; that.c.getView().addDependent(oD); });
    };

    p._getDlgMM = function () {
        var that = this;
        if (this._oDlgMM) { return Promise.resolve(); }
        var sId = this.c.createId("moa_dlgMM");
        this._sDlgMMId = sId;
        return Fragment.load({ id: sId, controller: this.c,
            name: "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.DialogModMasiva"
        }).then(function (oD) { that._oDlgMM = oD; that.c.getView().addDependent(oD); });
    };

    p._getDlgCM = function () {
        var that = this;
        if (this._oDlgCM) { return Promise.resolve(); }
        var sId = this.c.createId("moa_dlgCM");
        this._sDlgCMId = sId;
        return Fragment.load({ id: sId, controller: this.c,
            name: "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.DialogCargaMasiva"
        }).then(function (oD) { that._oDlgCM = oD; that.c.getView().addDependent(oD); });
    };

    p._getDlgCP = function () {
        var that = this;
        if (this._oDlgCP) { return Promise.resolve(); }
        var sId = this.c.createId("moa_dlgCP");
        this._sDlgCPId = sId;
        return Fragment.load({ id: sId, controller: this.c,
            name: "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.DialogCargaProgreso"
        }).then(function (oD) { that._oDlgCP = oD; that.c.getView().addDependent(oD); });
    };

    return RelConcMoa;
});
