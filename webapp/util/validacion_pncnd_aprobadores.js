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
            return _leer(oModel, "PNCND_TIPOS_APROB").then(function (aTipos) {
                fnProgress && fnProgress("Validando " + aData.length + " registro(s)...");

                var oTipos = {};
                aTipos.forEach(function (o) { oTipos[o.id_tipo_aprob] = true; });

                var aErrores = [];
                var aNorm = aData.map(function (oReg, i) {
                    var oN    = Object.assign({}, oReg);
                    var nFila = i + 3;

                    if (!oN.mail) {
                        aErrores.push("Fila " + nFila + ": el Mail es requerido");
                    }
                    if (!oTipos[oN.id_tipo_aprob]) {
                        aErrores.push("Fila " + nFila + ": Tipo Aprobador '" + oN.id_tipo_aprob + "' no existe");
                    }

                    return oN;
                });

                return { valido: aErrores.length === 0, errores: aErrores, data: aNorm };
            });
        }
    };
});
