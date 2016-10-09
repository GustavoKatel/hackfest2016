SELECT
  l.nu_Licitacao,
  l.cd_UGestora,
  l.tp_Licitacao,
  l.dt_Homologacao,
  l.vl_Licitacao,
  l.de_Obs,
  cug.cd_Municipio
FROM licitacao as l
INNER JOIN codigo_ugestora AS cug ON cug.cd_Ugestora = l.cd_UGestora
WHERE tp_Objeto = "1" AND cug.cd_Municipio = ?
