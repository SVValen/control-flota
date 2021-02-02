<?php

class Servicio 
{
    public $table = "Servicio";
    public $fields = ' servId
	                ,servNombre
	                ,servDescripcion
	                ,servPeriodo
	                ,servKM
	                ,CONVERT(VARCHAR, servFecha, 126) servFecha
	                ,CONVERT(VARCHAR, servFechaALTA, 126 ) servFechaAlta
                    ,servBorrado';
    public $join = '';

    //----------------------------------GET

    public function get($db) {
        $sql = "SELECT $this->fields FROM $this->table
                WHERE servBorrado = 0";
        $params = null;
        $stmt = SQL::query($db,$sql,$params);

        $results = [];
        while ($row = sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        };
        return $results;
    }

    //---------------------------------DELETE

    public function delete($db, $id) {
        $sql = "UPDATE $this->table
                SET servBorrado = 1
                WHERE servId = ?";
        $params = [$id];
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);

        return [];
    }

    //---------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (servNombre
                ,servDescripcion
                ,servPeriodo
                ,servKM
                ,servFecha
                ,servFechaAlta
                ,servBorrado)
                VALUES(?,?,?,?,?,GETDATE(),0);
                
                SELECT @@IDENTITY servId, CONVERT(VARCHAR, GETDATE(),126) servFechaAlta;";

        $params = [DATA["servNombre"]
                ,DATA["servDescripcion"]
                ,DATA["servPeriodo"]
                ,DATA["servKM"]
                ,DATA["servFecha"]];

        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);

        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results[] = DATA;
        $results["servId"] = $row["servId"];
        $results["servFechaAlta"] = $row["servFechaAlta"];
        $results["servBorrado"] = 0;

        return DATA;
    }

    //-----------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET servNombre = ?
                    ,servDescripcion = ?
                    ,servPeriodo = ?
                    ,servKM = ?
                    ,servFecha = ?
                WHERE servId = ?";
        
        $params = [DATA["servNombre"]
                ,DATA["servDescripcion"]
                ,DATA["servPeriodo"]
                ,DATA["servKM"]
                ,DATA["servFecha"]
                ,DATA["servId"]];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return [];

    }

}
?>