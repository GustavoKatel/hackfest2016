#!/bin/bash

sql="""
INSERT INTO empenhos_2
SELECT le.* FROM

  (SELECT e.* FROM

    (SELECT nu_Licitacao AS nl, cd_UGestora AS ug, tp_Licitacao AS tl, vl_Licitacao AS vlt, de_Obs AS obs FROM licitacao WHERE tp_Objeto = \"1\" LIMIT 20 OFFSET ?) AS t

  INNER JOIN empenhos AS e ON e.cd_UGestora = t.ug AND e.nu_Licitacao = t.nl AND e.tp_Licitacao = t.tl) AS le;

  SELECT \"?\";

  """

offset=0
step=20

echo "" > empenhos_2.sql

while [ $offset -lt "15020" ]; do

  echo $offset
  offset=$((offset+step))
  echo $sql | sed "s/\?/$offset/g" >> empenhos_2.sql

done
