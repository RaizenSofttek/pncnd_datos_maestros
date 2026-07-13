sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, MessageBox, Fragment) {
    "use strict";

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
        }
    };

    return Controller.extend("zpncnd.datos.maestros.pncnddatosmaestros.controller.Main", {

        _sCurrentEntity: null,
        _nFragLoad     : 0,
        _sEditPathFun  : null,
        _sEditPathOV   : null,
        _sDlgFunId     : null,
        _sDlgOVId      : null,

        // ── SELECTOR Y CARGA DE FRAGMENT ────────────────────────────

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
        },

        _cargarFragmento: function (sEntitySet) {
            if (this._sCurrentEntity === sEntitySet) { return; }

            var oContainer = this.byId("fragmentContainer");
            var mCfg       = mFragmentos[sEntitySet];
            var sFragId    = this.createId("frag_" + sEntitySet + "_" + (++this._nFragLoad));

            oContainer.destroyItems();
            this._sCurrentEntity = null;

            var that = this;
            Fragment.load({
                id        : sFragId,
                name      : mCfg.name,
                controller: this
            }).then(function (oFragment) {
                var aControls = Array.isArray(oFragment) ? oFragment : [oFragment];
                aControls.forEach(function (oCtrl) { oContainer.addItem(oCtrl); });

                var oSFB = Fragment.byId(sFragId, mCfg.sfbId);
                var oST  = Fragment.byId(sFragId, mCfg.stId);
                if (oSFB && oST) { oST.setSmartFilterId(oSFB.getId()); }

                that._sCurrentEntity = sEntitySet;
            });
        },

        // ── APROBADORES POR FUNCIÓN ──────────────────────────────────

        onEditarAprobFuncion: function (oEvent) {
            var oCtx  = oEvent.getSource().getBindingContext();
            var oData = oCtx.getObject();
            this._sEditPathFun = oCtx.getPath();

            var that = this;
            this._getDialogFuncion().then(function () {
                var sId = that._sDlgFunId;
                Fragment.byId(sId, "eFunCodConcepto").setValue(oData.cod_concepto);
                Fragment.byId(sId, "eFunTipoAprob").setValue(oData.id_tipo_aprob);
                Fragment.byId(sId, "eFunNivel").setValue(String(oData.nivel));
                Fragment.byId(sId, "eFunMail").setValue(oData.mail || "");
                that._oDlgFuncion.open();
            });
        },

        onConfirmarEditarFuncion: function () {
            var sMail = Fragment.byId(this._sDlgFunId, "eFunMail").getValue().trim();
            var that  = this;

            MessageBox.confirm("¿Confirma la Edición del Registro?", {
                title   : "Confirmar Edición",
                onClose : function (sAction) {
                    if (sAction !== MessageBox.Action.OK) { return; }
                    var oModel = that.getOwnerComponent().getModel();
                    oModel.update(that._sEditPathFun, { mail: sMail }, {
                        success: function () {
                            that._oDlgFuncion.close();
                            MessageToast.show("Registro actualizado correctamente");
                            oModel.refresh();
                        },
                        error: function (oErr) {
                            MessageBox.error("Error al actualizar: " + (oErr.message || oErr.statusCode));
                        }
                    });
                }
            });
        },

        onCancelarEditarFuncion: function () {
            this._oDlgFuncion.close();
        },

        onEliminarAprobFuncion: function (oEvent) {
            var oCtx  = oEvent.getSource().getBindingContext();
            var oData = oCtx.getObject();
            var sPath = oCtx.getPath();
            var sDesc = "cod_concepto='" + oData.cod_concepto + "', nivel=" + oData.nivel;
            var that  = this;

            MessageBox.confirm("¿Confirma la Eliminación del Registro " + sDesc + "?", {
                title       : "Confirmar Eliminación",
                emphasizedAction: MessageBox.Action.OK,
                onClose     : function (sAction) {
                    if (sAction !== MessageBox.Action.OK) { return; }
                    var oModel = that.getOwnerComponent().getModel();
                    oModel.remove(sPath, {
                        success: function () {
                            MessageToast.show("Registro eliminado correctamente");
                            oModel.refresh();
                        },
                        error: function (oErr) {
                            MessageBox.error("Error al eliminar: " + (oErr.message || oErr.statusCode));
                        }
                    });
                }
            });
        },

        _getDialogFuncion: function () {
            var that = this;
            if (this._oDlgFuncion) { return Promise.resolve(); }
            var sFragId = this.createId("dlgFun");
            this._sDlgFunId = sFragId;
            return Fragment.load({
                id        : sFragId,
                name      : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.DialogEditarFuncion",
                controller: this
            }).then(function (oDialog) {
                that._oDlgFuncion = oDialog;
                that.getView().addDependent(oDialog);
            });
        },

        // ── APROBADORES POR OFICINA DE VENTAS ───────────────────────

        onEditarAprobOfVentas: function (oEvent) {
            var oCtx  = oEvent.getSource().getBindingContext();
            var oData = oCtx.getObject();
            this._sEditPathOV = oCtx.getPath();

            var that = this;
            this._getDialogOfVentas().then(function () {
                var sId = that._sDlgOVId;
                Fragment.byId(sId, "eOVVkorg").setValue(oData.vkorg);
                Fragment.byId(sId, "eOVVtweg").setValue(oData.vtweg);
                Fragment.byId(sId, "eOVSpart").setValue(oData.spart);
                Fragment.byId(sId, "eOVTipoAprob").setValue(oData.id_tipo_aprob);
                Fragment.byId(sId, "eOVNivel").setValue(String(oData.nivel));
                Fragment.byId(sId, "eOVVkbur").setValue(oData.vkbur);
                Fragment.byId(sId, "eOVBran2").setValue(oData.bran2 || "");
                Fragment.byId(sId, "eOVMail").setValue(oData.mail || "");
                that._oDlgOfVentas.open();
            });
        },

        onConfirmarEditarOfVentas: function () {
            var sMail = Fragment.byId(this._sDlgOVId, "eOVMail").getValue().trim();
            var that  = this;

            MessageBox.confirm("¿Confirma la Edición del Registro?", {
                title   : "Confirmar Edición",
                onClose : function (sAction) {
                    if (sAction !== MessageBox.Action.OK) { return; }
                    var oModel = that.getOwnerComponent().getModel();
                    oModel.update(that._sEditPathOV, { mail: sMail }, {
                        success: function () {
                            that._oDlgOfVentas.close();
                            MessageToast.show("Registro actualizado correctamente");
                            oModel.refresh();
                        },
                        error: function (oErr) {
                            MessageBox.error("Error al actualizar: " + (oErr.message || oErr.statusCode));
                        }
                    });
                }
            });
        },

        onCancelarEditarOfVentas: function () {
            this._oDlgOfVentas.close();
        },

        onEliminarAprobOfVentas: function (oEvent) {
            var oCtx  = oEvent.getSource().getBindingContext();
            var oData = oCtx.getObject();
            var sPath = oCtx.getPath();
            var sDesc = "vkorg='" + oData.vkorg + "', vtweg='" + oData.vtweg + "', nivel=" + oData.nivel;
            var that  = this;

            MessageBox.confirm("¿Confirma la Eliminación del Registro " + sDesc + "?", {
                title       : "Confirmar Eliminación",
                emphasizedAction: MessageBox.Action.OK,
                onClose     : function (sAction) {
                    if (sAction !== MessageBox.Action.OK) { return; }
                    var oModel = that.getOwnerComponent().getModel();
                    oModel.remove(sPath, {
                        success: function () {
                            MessageToast.show("Registro eliminado correctamente");
                            oModel.refresh();
                        },
                        error: function (oErr) {
                            MessageBox.error("Error al eliminar: " + (oErr.message || oErr.statusCode));
                        }
                    });
                }
            });
        },

        _getDialogOfVentas: function () {
            var that = this;
            if (this._oDlgOfVentas) { return Promise.resolve(); }
            var sFragId = this.createId("dlgOV");
            this._sDlgOVId = sFragId;
            return Fragment.load({
                id        : sFragId,
                name      : "zpncnd.datos.maestros.pncnddatosmaestros.view.fragment.DialogEditarOfVentas",
                controller: this
            }).then(function (oDialog) {
                that._oDlgOfVentas = oDialog;
                that.getView().addDependent(oDialog);
            });
        }
    });
});
