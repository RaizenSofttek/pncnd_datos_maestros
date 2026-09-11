sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_aprob_x_funcion",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_aprob_x_of_ventas",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_clientes",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_aprob_x_of_ventas_audit",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_aprob_x_funcion_audit",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_clientes_audit",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_rel_conc_moa",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_rel_conc_tipo_doc",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_cod_concepto",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_rel_conc_moa_audit",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_rel_conc_tipo_doc_audit",
    "zpncnd/datos/maestros/pncnddatosmaestros/util/pncnd_cod_concepto_audit"
], function (Controller, MessageToast, Fragment, Filter, FilterOperator,
             AprobFuncion, AprobOfVentas, Clientes,
             AprobOfVentasAudit, AprobFuncionAudit, ClientesAudit,
             RelConcMoa, RelConcTipoDoc, CodConcepto,
             RelConcMoaAudit, RelConcTipoDocAudit, CodConceptoAudit) {
    "use strict";

    // Mapa de fragments por entidad
    var mFragmentos = {
        "PNCND_APROB_X_OF_VENTAS": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.AprobXOfVentas",
            sfbId: "sfbOfVentas",
            stId : "stOfVentas"
        },
        "PNCND_APROB_X_FUNCION": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.AprobXFuncion",
            sfbId: "sfbFuncion",
            stId : "stFuncion"
        },
        "PNCND_CLIENTES": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Clientes",
            sfbId: "sfbClientes",
            stId : "stClientes"
        },
        "PNCND_APROB_X_OF_VENTAS_AUDIT": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Pncnd_aprob_x_of_ventas_audit",
            sfbId: "sfbOfVentasAudit",
            stId : "stOfVentasAudit"
        },
        "PNCND_APROB_X_FUNCION_AUDIT": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Pncnd_aprob_x_funcion_audit",
            sfbId: "sfbFuncionAudit",
            stId : "stFuncionAudit"
        },
        "PNCND_CLIENTES_AUDIT": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Pncnd_clientes_audit",
            sfbId: "sfbClientesAudit",
            stId : "stClientesAudit"
        },
        "PNCND_REL_CONC_MOA": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.RelConcMoa",
            sfbId: "sfbRelConcMoa",
            stId : "stRelConcMoa"
        },
        "PNCND_REL_CONC_TIPO_DOC": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.RelConcTipoDoc",
            sfbId: "sfbRelConcTipoDoc",
            stId : "stRelConcTipoDoc"
        },
        "PNCND_COD_CONCEPTO": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.CodConcepto",
            sfbId: "sfbCodConcepto",
            stId : "stCodConcepto"
        },
        "PNCND_REL_CONC_MOA_AUDIT": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Pncnd_rel_conc_moa_audit",
            sfbId: "sfbRelConcMoaAudit",
            stId : "stRelConcMoaAudit"
        },
        "PNCND_REL_CONC_TIPO_DOC_AUDIT": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Pncnd_rel_conc_tipo_doc_audit",
            sfbId: "sfbRelConcTipoDocAudit",
            stId : "stRelConcTipoDocAudit"
        },
        "PNCND_COD_CONCEPTO_AUDIT": {
            name : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.Pncnd_cod_concepto_audit",
            sfbId: "sfbCodConceptoAudit",
            stId : "stCodConceptoAudit"
        }
    };

    return Controller.extend("zpncnd.datos.maestros.pncnddatosmaestros.controller.Main", {

        // ── Ciclo de vida ────────────────────────────────────────────────────
        onInit: function () {
            this._funcion        = new AprobFuncion(this);
            this._ofventas       = new AprobOfVentas(this);
            this._clientes       = new Clientes(this);
            this._ofventasAudit  = new AprobOfVentasAudit(this);
            this._funcionAudit   = new AprobFuncionAudit(this);
            this._clientesAudit  = new ClientesAudit(this);
            this._relConcMoa        = new RelConcMoa(this);
            this._relConcTipoDoc    = new RelConcTipoDoc(this);
            this._codConcepto       = new CodConcepto(this);
            this._relConcMoaAudit   = new RelConcMoaAudit(this);
            this._relConcTipoDocAudit = new RelConcTipoDocAudit(this);
            this._codConceptoAudit  = new CodConceptoAudit(this);
            this._activeUtil     = null;
            this._sCurrentEntity = null;
            this._nFragLoad      = 0;
            this._sCurrentFragId = null;
            this._aplicarFiltroRoles();
        },

        _aplicarFiltroRoles: function () {
            var oModelUser = this.getOwnerComponent().getModel("modelUser");
            if (!oModelUser) { return; }

            var fnOnce = function () {
                oModelUser.detachRequestCompleted(fnOnce);
                this._checkRoles();
            }.bind(this);

            oModelUser.attachRequestCompleted(fnOnce);
            oModelUser.loadData("/user-api/attributes", null, true);
        },

        _checkRoles: function () {
            var that = this;
            var oModelUser = this.getOwnerComponent().getModel("modelUser");
            var oData = oModelUser.getData();
            var sData = JSON.stringify(oData);
            var bTieneRol = sData.indexOf("PNCND_TABLAS_AUDITORIAS") !== -1;

            if (!bTieneRol) {
                var oSelect  = that.byId("selTabla");
                var oBinding = oSelect ? oSelect.getBinding("items") : null;
                if (oBinding) {
                    oBinding.filter([new Filter("nombre", FilterOperator.NotContains, "_AUDIT")]);
                } else {
                    setTimeout(function () {
                        var oB2 = that.byId("selTabla") && that.byId("selTabla").getBinding("items");
                        if (oB2) { oB2.filter([new Filter("nombre", FilterOperator.NotContains, "_AUDIT")]); }
                    }, 1000);
                }
            }
        },

        // ── SELECTOR DE TABLA ────────────────────────────────────────────────
        onApplyFilters: function () {
            var oSelect = this.byId("selTabla");
            var sNombre = oSelect.getSelectedKey();
            if (!sNombre) {
                MessageToast.show("Seleccione una tabla antes de continuar");
                return;
            }
            if (!mFragmentos[sNombre]) {
                MessageToast.show("No hay vista definida para: " + sNombre);
                return;
            }
            this._cargarFragmento(sNombre);
        },

        onClearFilters: function () {
            this.byId("selTabla").setSelectedKey("");
            this.byId("fragmentContainer").destroyItems();
            this._sCurrentEntity = null;
            this._sCurrentFragId = null;
        },

        _cargarFragmento: function (sEntitySet) {
            if (this._sCurrentEntity === sEntitySet) { return; }
            var oContainer = this.byId("fragmentContainer");
            var mCfg       = mFragmentos[sEntitySet];
            var sFragId    = this.createId("frag_" + sEntitySet + "_" + (++this._nFragLoad));
            oContainer.destroyItems();
            this._sCurrentEntity = null;
            var that = this;
            Fragment.load({ id: sFragId, name: mCfg.name, controller: this })
                .then(function (oFragment) {
                    var aControls = Array.isArray(oFragment) ? oFragment : [oFragment];
                    aControls.forEach(function (oCtrl) { oContainer.addItem(oCtrl); });
                    var oSFB = mCfg.sfbId ? Fragment.byId(sFragId, mCfg.sfbId) : null;
                    var oST  = Fragment.byId(sFragId, mCfg.stId);
                    if (oSFB && oST) { 
                        oST.setSmartFilterId(oSFB.getId());
                        oST.rebindTable(true)
                    }
                    that._sCurrentFragId = sFragId;
                    that._sCurrentEntity = sEntitySet;
                    // Defer so que el motor de rendering de UI5 vuelque el DOM antes de medir
                    setTimeout(function () { that._fixStickyHeaders(sFragId, mCfg.stId); }, 0);
                });
        },

        /*
         * Hace sticky el toolbar interno del SmartTable (título + ⚙ + export)
         * y ajusta el top de los headers de columna para que queden justo debajo.
         *
         * Por qué JS y no sólo CSS:
         *  - El framework recalcula `element.style.top` en cada scroll/resize con
         *    un setter sin !important, y CSS !important de clase gana sobre ese
         *    inline normal — pero el selector puro no alcanza al toolbar porque
         *    SAP lo inyecta como extensión y puede variar entre versiones.
         *  - Aquí encontramos el elemento real con querySelector y le ponemos la
         *    clase que sí lleva !important, lo que garantiza que el CSS gane.
         *  - La altura real del toolbar se mide con offsetHeight y se publica como
         *    CSS custom property (--pncndTBH) para que .pncndStickyColHdr la use.
         */
        _fixStickyHeaders: function (sFragId, sStId) {
            var oST = Fragment.byId(sFragId, sStId);
            if (!oST || !oST.getDomRef()) { return; }
            var oDomRef    = oST.getDomRef();
            var oToolbarEl = oDomRef.querySelector(".sapMTB");
            var oColHdrEl  = oDomRef.querySelector(".sapMTableColHdr");
            if (oToolbarEl) {
                oToolbarEl.classList.add("pncndStickyToolbar");
                // Publica la altura real como var CSS para que pncndStickyColHdr la use
                oDomRef.style.setProperty("--pncndTBH", oToolbarEl.offsetHeight + "px");
            }
            if (oColHdrEl) {
                oColHdrEl.classList.add("pncndStickyColHdr");
            }
        },

        // ── Helper compartido: tabla interna del SmartTable activo ───────────
        _getInnerTable: function (sSmartTableId) {
            if (!this._sCurrentFragId) { return null; }
            var oST = Fragment.byId(this._sCurrentFragId, sSmartTableId);
            return oST ? (oST.getTable ? oST.getTable() : null) : null;
        },

        // ── Helper compartido: detectar entidad por headers de archivo ───────
        _detectarEntidad: function (aHeaders) {
            var sDetectado = null;
            [this._funcion, this._ofventas, this._clientes,
             this._relConcMoa, this._relConcTipoDoc, this._codConcepto].forEach(function (oUtil) {
                var aEsp = oUtil.getColsCarga().map(function (o) { return o.header; });
                if (aEsp.length === aHeaders.length &&
                    aEsp.every(function (h, i) { return h === aHeaders[i]; })) {
                    sDetectado = oUtil.getNombre();
                }
            });
            return sDetectado;
        },

        // ── Helper compartido: generar template XLS ──────────────────────────
        _descargarTemplate: function (sNombreArchivo, aColumnas) {
            var sXML = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<?mso-application progid="Excel.Sheet"?>',
                '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
                '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"',
                '  xmlns:x="urn:schemas-microsoft-com:office:excel">',
                '  <Styles>',
                '    <Style ss:ID="sHeader">',
                '      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>',
                '      <Interior ss:Color="#2E75B6" ss:Pattern="Solid"/>',
                '      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>',
                '    </Style>',
                '    <Style ss:ID="sHint">',
                '      <Font ss:Italic="1" ss:Color="#595959" ss:Size="9"/>',
                '      <Interior ss:Color="#D6E4F0" ss:Pattern="Solid"/>',
                '      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>',
                '    </Style>',
                '    <Style ss:ID="sData">',
                '      <Borders>',
                '        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BDD7EE"/>',
                '        <Border ss:Position="Right"  ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BDD7EE"/>',
                '        <Border ss:Position="Left"   ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BDD7EE"/>',
                '        <Border ss:Position="Top"    ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BDD7EE"/>',
                '      </Borders>',
                '    </Style>',
                '  </Styles>',
                '  <Worksheet ss:Name="Template">',
                '    <Table ss:DefaultRowHeight="18">'
            ].join('\n');

            sXML += '\n      <Row ss:Height="22">';
            aColumnas.forEach(function (oCol) {
                sXML += '\n        <Cell ss:StyleID="sHeader"><Data ss:Type="String">' + oCol.label + '</Data></Cell>';
            });
            sXML += '\n      </Row>';

            sXML += '\n      <Row ss:Height="30">';
            aColumnas.forEach(function (oCol) {
                sXML += '\n        <Cell ss:StyleID="sHint"><Data ss:Type="String">' + oCol.hint + '</Data></Cell>';
            });
            sXML += '\n      </Row>';

            for (var i = 0; i < 10; i++) {
                sXML += '\n      <Row>';
                aColumnas.forEach(function () {
                    sXML += '\n        <Cell ss:StyleID="sData"><Data ss:Type="String"></Data></Cell>';
                });
                sXML += '\n      </Row>';
            }

            sXML += '\n    </Table>\n  </Worksheet>\n</Workbook>';

            var oBlob  = new Blob([sXML], { type: 'application/vnd.ms-excel;charset=utf-8' });
            var sURL   = URL.createObjectURL(oBlob);
            var oLink  = document.createElement('a');
            oLink.href     = sURL;
            oLink.download = sNombreArchivo + '_Template.xls';
            document.body.appendChild(oLink);
            oLink.click();
            document.body.removeChild(oLink);
            URL.revokeObjectURL(sURL);
        },

        // ── Helper compartido: carga lazy de SheetJS ─────────────────────────
        _cargarXlsx: function () {
            if (window.XLSX) { return Promise.resolve(window.XLSX); }
            return new Promise(function (resolve, reject) {
                var sUrl = sap.ui.require.toUrl("zpncnd/datos/maestros/pncnddatosmaestros") + "/vendor/xlsx.full.min.js";
                var oScript     = document.createElement("script");
                oScript.src     = sUrl;
                oScript.onload  = function () { resolve(window.XLSX); };
                oScript.onerror = reject;
                document.head.appendChild(oScript);
            });
        },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — AprobXFuncion
        // ════════════════════════════════════════════════════════════════════
        onSearchFuncion           : function (e) { this._funcion.onSearch(e); },
        onEditarAprobFuncion      : function (e) { this._funcion.onEditar(e); },
        onEliminarAprobFuncion    : function (e) { this._funcion.onEliminar(e); },
        onConfirmarEditarFuncion  : function ()  { this._funcion.onConfirmarEditar(); },
        onCancelarEditarFuncion   : function ()  { this._funcion.onCancelarEditar(); },
        onModMasivaFuncion        : function ()  { this._funcion.onModMasiva(); },
        onDescargarTemplateFuncion: function ()  { this._funcion.onDescargarTemplate(); },
        onCargaMasivaFuncion      : function ()  { this._funcion.onCargaMasiva(); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — AprobXOfVentas
        // ════════════════════════════════════════════════════════════════════
        onSearchOfVentas            : function (e) { this._ofventas.onSearch(e); },
        onEditarAprobOfVentas       : function (e) { this._ofventas.onEditar(e); },
        onEliminarAprobOfVentas     : function (e) { this._ofventas.onEliminar(e); },
        onConfirmarEditarOfVentas   : function ()  { this._ofventas.onConfirmarEditar(); },
        onCancelarEditarOfVentas    : function ()  { this._ofventas.onCancelarEditar(); },
        onModMasivaOfVentas         : function ()  { this._ofventas.onModMasiva(); },
        onDescargarTemplateOfVentas : function ()  { this._ofventas.onDescargarTemplate(); },
        onCargaMasivaOfVentas       : function ()  { this._ofventas.onCargaMasiva(); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — Clientes
        // ════════════════════════════════════════════════════════════════════
        onSearchClientes            : function (e) { this._clientes.onSearch(e); },
        onEditarClientes            : function (e) { this._clientes.onEditar(e); },
        onEliminarClientes          : function (e) { this._clientes.onEliminar(e); },
        onConfirmarEditarClientes   : function ()  { this._clientes.onConfirmarEditar(); },
        onCancelarEditarClientes    : function ()  { this._clientes.onCancelarEditar(); },
        onModMasivaClientes         : function ()  { this._clientes.onModMasiva(); },
        onDescargarTemplateClientes : function ()  { this._clientes.onDescargarTemplate(); },
        onCargaMasivaClientes       : function ()  { this._clientes.onCargaMasiva(); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — AprobXOfVentasAudit (solo lectura)
        // ════════════════════════════════════════════════════════════════════
        onSearchOfVentasAudit : function (e) { this._ofventasAudit.onSearch(e); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — AprobXFuncionAudit (solo lectura)
        // ════════════════════════════════════════════════════════════════════
        onSearchFuncionAudit  : function (e) { this._funcionAudit.onSearch(e); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — ClientesAudit (solo lectura)
        // ════════════════════════════════════════════════════════════════════
        onSearchClientesAudit : function (e) { this._clientesAudit.onSearch(e); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — RelConcMoa
        // ════════════════════════════════════════════════════════════════════
        onSearchRelConcMoa              : function (e) { this._relConcMoa.onSearch(e); },
        onEditarRelConcMoa              : function (e) { this._relConcMoa.onEditar(e); },
        onEliminarRelConcMoa            : function (e) { this._relConcMoa.onEliminar(e); },
        onConfirmarEditarRelConcMoa     : function ()  { this._relConcMoa.onConfirmarEditar(); },
        onCancelarEditarRelConcMoa      : function ()  { this._relConcMoa.onCancelarEditar(); },
        onModMasivaRelConcMoa           : function ()  { this._relConcMoa.onModMasiva(); },
        onDescargarTemplateRelConcMoa   : function ()  { this._relConcMoa.onDescargarTemplate(); },
        onCargaMasivaRelConcMoa         : function ()  { this._relConcMoa.onCargaMasiva(); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — RelConcTipoDoc
        // ════════════════════════════════════════════════════════════════════
        onSearchRelConcTipoDoc            : function (e) { this._relConcTipoDoc.onSearch(e); },
        onEliminarRelConcTipoDoc          : function (e) { this._relConcTipoDoc.onEliminar(e); },
        onDescargarTemplateRelConcTipoDoc : function ()  { this._relConcTipoDoc.onDescargarTemplate(); },
        onCargaMasivaRelConcTipoDoc       : function ()  { this._relConcTipoDoc.onCargaMasiva(); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — RelConcMoaAudit (solo lectura)
        // ════════════════════════════════════════════════════════════════════
        onSearchRelConcMoaAudit     : function (e) { this._relConcMoaAudit.onSearch(e); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — RelConcTipoDocAudit (solo lectura)
        // ════════════════════════════════════════════════════════════════════
        onSearchRelConcTipoDocAudit : function (e) { this._relConcTipoDocAudit.onSearch(e); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — CodConceptoAudit (solo lectura)
        // ════════════════════════════════════════════════════════════════════
        onSearchCodConceptoAudit    : function (e) { this._codConceptoAudit.onSearch(e); },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — CodConcepto
        // ════════════════════════════════════════════════════════════════════
        onSearchCodConcepto             : function (e) { this._codConcepto.onSearch(e); },
        onEditarCodConcepto             : function (e) { this._codConcepto.onEditar(e); },
        onEliminarCodConcepto           : function (e) { this._codConcepto.onEliminar(e); },
        onConfirmarEditarCodConcepto    : function ()  { this._codConcepto.onConfirmarEditar(); },
        onCancelarEditarCodConcepto     : function ()  { this._codConcepto.onCancelarEditar(); },
        onModMasivaCodConcepto          : function ()  { this._codConcepto.onModMasiva(); },
        onDescargarTemplateCodConcepto  : function ()  { this._codConcepto.onDescargarTemplate(); },
        onCargaMasivaCodConcepto        : function ()  { this._codConcepto.onCargaMasiva(); },

        // ════════════════════════════════════════════════════════════════════
        // FORMATTER
        // ════════════════════════════════════════════════════════════════════
        formatFecha: function (oValue) {
            if (!oValue) { return ""; }
            var d = (oValue instanceof Date) ? oValue : new Date(oValue);
            if (isNaN(d.getTime())) { return String(oValue); }
            var p = function (n) { return String(n).padStart(2, "0"); };
            return p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear()
                + " - " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
        },

        // ════════════════════════════════════════════════════════════════════
        // DELEGATES — Dialogs compartidos (routed via _activeUtil)
        // ════════════════════════════════════════════════════════════════════
        onAceptarModMasiva    : function ()  { this._activeUtil.onAceptarModMasiva(); },
        onCancelarModMasiva   : function ()  { this._activeUtil.onCancelarModMasiva(); },
        onArchivoSeleccionado : function (e) { this._activeUtil.onArchivoSeleccionado(e); },
        onProcesarCarga       : function ()  { this._activeUtil.onProcesarCarga(); },
        onCancelarCarga       : function ()  { this._activeUtil.onCancelarCarga(); },
        onCerrarProgreso      : function ()  { this._activeUtil.onCerrarProgreso(); },
        onEscapeProgreso      : function (e) { this._activeUtil.onEscapeProgreso(e); }
    });
});
