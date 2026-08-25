sap.ui.define([], function () {
    "use strict";

    function _leer(oModel, sEntitySet) {
        return new Promise(function (resolve, reject) {
            oModel.read("/" + sEntitySet, {
                urlParameters: { "$top": "9999" },
                success: function (oData) { resolve(oData.results || []); },
                error: reject
            });
        });
    }

    return {
        validar: function (aData, oModel, fnProgress) {
            fnProgress && fnProgress("Cargando tablas de referencia...");
            return Promise.all([
                _leer(oModel, "PNCND_COD_CONCEPTO"),
                _leer(oModel, "PNCND_TIPO_OPERACION"),
                _leer(oModel, "PNCND_LINEA_MOA")
            ]).then(function (aRes) {
                fnProgress && fnProgress("Validando " + aData.length + " registro(s)...");

                var oConceptos  = {};
                var oTiposOp    = {};
                var oLineasMoa  = {};

                aRes[0].forEach(function (o) { oConceptos[o.cod_concepto] = true; });
                aRes[1].forEach(function (o) { oTiposOp[o.id_tipo_op]     = true; });
                aRes[2].forEach(function (o) { oLineasMoa[o.linea_moa]    = true; });

                var aErrores = [];
                var aNorm = aData.map(function (oReg, i) {
                    var oN    = Object.assign({}, oReg);
                    var nFila = i + 3;

                    if (!oConceptos[oN.cod_concepto]) {
                        aErrores.push("Fila " + nFila + ": Cód. Concepto '" + oN.cod_concepto + "' no existe");
                    }
                    if (!oTiposOp[oN.id_tipo_op]) {
                        aErrores.push("Fila " + nFila + ": Tipo Operación '" + oN.id_tipo_op + "' no existe");
                    }
                    if (!oLineasMoa[oN.linea_moa]) {
                        aErrores.push("Fila " + nFila + ": Linea MOA '" + oN.linea_moa + "' no existe");
                    }

                    return oN;
                });

                return { valido: aErrores.length === 0, errores: aErrores, data: aNorm };
            });
        }
    };
});
