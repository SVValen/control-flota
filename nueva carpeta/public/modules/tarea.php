<?php
class Tarea {
    public $table = 'Tarea';
    public $fields = 'tareId
                    ,tareNombre
                    ,tareDescripcion
                    ,tareUnidadMedida
                    ,tareCantidad
                    ,tareCosto
                    ,CONVERT(VARCHAR, tareFechaAlta, 126) tareFechaAlta
                    ,tareBorrado';
    
    //-------------------------------GET

    public function get($db) {
        $sql = "SELECT $this->fields
                FROM $this->table
                WHERE tareBorrado = 0";
        $params = null;
        $stmt = SQL::query($db, $sql, $params);

        $results = [];
        while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    //-----------------------------DELETE

    public function delete($db, $id) {
        $sql = "UPDATE $this->table
                SET tareBorrado = 1
                WHERE tareId = ?";
        $params = [$id];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return [];
    }

    //------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (tareNombre
                ,tareDescripcion
                ,tareUnidadMedida
                ,tareCantidad
                ,tareCosto
                ,tareFechaAlta
                ,tareBorrado)
                VALUES (?,?,?,?,?,GETDATE(),0);
                
                SELECT @@IDENTITY tareId, CONVERT(VARCHAR, GETDATE(),126) tareFechaAlta;";

        $params = [
            DATA["tareNombre"]
            ,DATA["tareDescripcion"]
            ,DATA["tareUnidadMedida"]
            ,DATA["tareCantidad"]
            ,DATA["tareCosto"]
        ];

        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        $results[] = DATA;
        $results["tareId"] = $row["tareId"];
        $results["tareFechaAlta"] = $row["tareFechaAlta"];
        $results["tareBorrado"] = 0;

        return $results;
    }

    //-----------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET tareNombre = ?,
                    tareDescripcion = ?,
                    tareUnidadMedida = ?,
                    tareCantidad = ?,
                    tareCosto = ?
                WHERE tareId = ?";
        $params = [
            DATA["tareNombre"],
            DATA["tareDescripcion"],
            DATA["tareUnidadMedida"],
            DATA["tareCantidad"],
            DATA["tareCosto"],
            DATA["tareId"]];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return  [];
    }
}
?>