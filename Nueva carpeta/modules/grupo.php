<?php

class Grupo
{

    public $table = 'Grupo';
    public $fields = 'grupId
                ,grupNombre
                ,grupDescripcion
                ,CONVERT(VARCHAR, grupFechaAlta, 126) grupFechaAlta
                ,grupBorrado'; 
    public $join = '';

    //----------------------------------GET
    public function get($db) {
        $sql = "SELECT $this->fields FROM $this->table
                WHERE grupBorrado = 0 ";
        $params = null;
        $stmt = SQL::query($db, $sql, $params);

        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }
    
    //---------------------------------DELETE
    public function delete($db,$id) {
        $sql = "UPDATE $this->table
                SET grupBorrado = 1
                WHERE grupId = ?";
        $params = [$id];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return [];
    }
    
    //---------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (grupNombre
                ,grupDescripcion
                ,grupFechaAlta
                ,grupBorrado) 
                VALUES(?,?,GETDATE(),0);
                
                SELECT @@IDENTITY grupId, CONVERT(VARCHAR, GETDATE(),126) grupFechaAlta;";

        $params = [DATA["grupNombre"],DATA["grupDescripcion"]];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["grupId"] = $row["grupId"];
        $results["grupFechaAlta"] = $row["grupFechaAlta"];
        $results["grupBorrado"] = 0;
        

        return $results;
}
    //---------------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET grupNombre = ?
                    ,grupDescripcion = ?
                WHERE grupId = ?";
        $params = [DATA["grupNombre"],DATA["grupDescripcion"],DATA["grupId"]];
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);

        return DATA;
    }
}
?>