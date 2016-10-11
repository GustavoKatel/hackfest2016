SELECT
  ANY_VALUE(lic.dt_Ano) AS tp_Licitacao,
  ANY_VALUE(lic.tp_Licitacao) AS tp_Licitacao,
  ANY_VALUE(lic.nu_Licitacao) AS nu_Licitacao,
  ANY_VALUE(lic.cd_UGestora) AS cd_UGestora,
  ANY_VALUE(cug.de_Ugestora) AS de_UGestora,
  ANY_VALUE(lic.de_Obs) AS de_Obs,
  ANY_VALUE(lic.dt_Homologacao) AS dt_Homologacao,
  ANY_VALUE(cug.cd_Municipio) AS cd_Municipio,
  ANY_VALUE(cont.nu_Contrato) AS nu_Contrato,
  ANY_VALUE(cont.pr_Vigencia) AS dt_Vigencia,
  ANY_VALUE(cont.nu_CPFCNPJ) AS nu_CPFCNPJ,
  ANY_VALUE(lic.vl_Licitacao) AS vl_Total,
  SUM(pgtos.vl_Pagamento) AS vl_Pago
FROM licitacao AS lic
INNER JOIN empenhos_2 AS emp ON emp.cd_UGestora = lic.cd_UGestora AND emp.nu_Licitacao = lic.nu_Licitacao AND emp.tp_Licitacao = lic.tp_Licitacao
INNER JOIN pagamentos_2 AS pgtos ON pgtos.cd_UGestora = lic.cd_UGestora AND pgtos.dt_Ano = emp.dt_Ano AND pgtos.cd_UnidOrcamentaria = emp.cd_UnidOrcamentaria AND pgtos.nu_Empenho = emp.nu_Empenho
INNER JOIN codigo_ugestora AS cug ON cug.cd_Ugestora = lic.cd_UGestora AND cug.dt_Ano = emp.dt_Ano
INNER JOIN contratos AS cont ON cont.cd_UGestora = lic.cd_UGestora AND cont.dt_Ano = emp.dt_Ano AND cont.tp_Licitacao = lic.tp_Licitacao
WHERE tp_Objeto = "1" AND lic.nu_Licitacao = ? AND lic.tp_Licitacao = ? AND lic.cd_UGestora = ?
GROUP BY lic.nu_Licitacao, lic.tp_Licitacao, lic.cd_UGestora;



-- nu: 000012011
-- tp: 3
-- ug: 101002
