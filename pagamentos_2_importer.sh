#!/bin/bash

sql="""
INSERT INTO pagamentos_2
SELECT ep.* FROM

  (SELECT p.* FROM

    (SELECT cd_UGestora AS ug, dt_Ano AS ano, cd_UnidOrcamentaria AS uo, nu_Empenho AS ne FROM empenhos_2 LIMIT 20 OFFSET ?) AS e

  INNER JOIN pagamentos AS p ON p.cd_UGestora = e.ug AND p.dt_Ano = e.ano AND p.cd_UnidOrcamentaria = e.uo AND p.nu_Empenho = e.ne) AS ep;
  SELECT \"?\";
  """

offset=0
step=20

echo "" > pagamentos_2.sql

while [ $offset -lt "26100" ]; do

  echo $offset
  offset=$((offset+step))
  echo $sql | sed "s/\?/$offset/g" >> pagamentos_2.sql

done
