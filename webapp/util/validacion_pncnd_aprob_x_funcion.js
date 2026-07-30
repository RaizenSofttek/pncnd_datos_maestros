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
                _leer(oModel, "PNCND_TIPOS_APROB"),
                _leer(oModel, "PNCND_NIVELES"),
                _leer(oModel, "PNCND_APROBADORES")
            ]).then(function (aRes) {
                fnProgress && fnProgress("Validando " + aData.length + " registro(s)...");

                var oConceptos = {};
                var oTipos     = {};
                var oNiveles   = {};
                var oMails     = {};

                aRes[0].forEach(function (o) { oConceptos[o.cod_concepto]    = true; });
                aRes[1].forEach(function (o) { oTipos[o.id_tipo_aprob]       = true; });
                aRes[2].forEach(function (o) { oNiveles[o.nivel]             = true; });
                aRes[3].forEach(function (o) { oMails[o.mail.toLowerCase()]  = true; });

                var aErrores = [];
                var aNorm = aData.map(function (oReg, i) {
                    var oN    = Object.assign({}, oReg);
                    var nFila = i + 3;

                    if (!oConceptos[oN.cod_concepto]) {
                        aErrores.push("Fila " + nFila + ": Cód. Concepto '" + oN.cod_concepto + "' no existe");
                    }

                    var sTipo = String(oN.id_tipo_aprob || "").padStart(2, "0");
                    oN.id_tipo_aprob = sTipo;
                    if (!oTipos[sTipo]) {
                        aErrores.push("Fila " + nFila + ": Tipo Aprobador '" + sTipo + "' no existe");
                    }

                    if (!oNiveles[oN.nivel]) {
                        aErrores.push("Fila " + nFila + ": Nivel '" + oN.nivel + "' no existe");
                    }

                    var sMail = (oN.mail || "").trim();
                    if (!oMails[sMail.toLowerCase()]) {
                        aErrores.push("Fila " + nFila + ": Mail '" + sMail + "' no existe en Aprobadores");
                    }

                    return oN;
                });

                return { valido: aErrores.length === 0, errores: aErrores, data: aNorm };
            });
        }
    };
});
