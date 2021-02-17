<?php
class GrupoServicio {
    public $table = 'GrupoServicio';
    public $fields = 'grusId
                    ,grusGrupId
                    ,grusServId
                    ,grusPeriodo
                    ,grusKM
                    ,grusFecha
                    ,CONVERT(VARCHAR, grusFechaAlta, 126) grusFechaAlta
                    ,grusBorrado
                    
                    ,servNombre';
    public $join = "LEFT OUTER JOIN Servicio ON grusServId = servId";

    //---------------------------------GET

    public function get($db) {
        $sql = "SELECT $this->fields
                FROM $this->table
                $this->join
                WHERE grusBorrado = 0";
        $params = null;

        if(isset($_GET["grusGrupId"])) {
            $params = [$_GET["grusGrupId"]];
            $sql = $sql . "AND grusGrupId = ?";
        };

        $stmt = SQL::query($db, $sql, $params);

        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        };

        return $results;
    }

    //-------------------------------DELETE

    public function delete($db,$id) {
        $sql = "UPDATE $this->table
                SET grusBorrado = 1
                WHERE grusId = ?";
        $params = [$id];
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);

        return [];
    }

    //------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (grusGrupId
                ,grusServId
                ,grusPeriodo
                ,grusKM
                ,grusFecha
                ,grusFechaAlta
                ,grusBorrado)
                VALUES (?,?,?,?,?,GETDATE(),0);
                
                SELECT @@IDENTITY grusId, CONVERT(VARCHAR, GETDATE(),126 ) grusFechaAlta;";

        $params = [
                DATA["grusGrupId"],
                DATA["grusServId"],
                DATA["grusPeriodo"],
                DATA["grusKM"],
                DATA["grusFecha"]
                ];
        
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);

        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["grusId"] = $row["grusId"];
        $results["grusFechaAlta"] = $row["grusFechaAlta"];
        $results["grusBorrado"] = 0;

        return DATA;
    }

    //----------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET grusGrupId = ?,
                    grusServId = ?,
                    grusPeriodo = ?,
                    grusKM = ?,
                    grusFecha = ?
                WHERE grusId = ?";
        $params=[DATA["grusGrupId"]
                ,DATA["grusServId"]
                ,DATA["grusPeriodo"]
                ,DATA["grusKM"]
                ,DATA["grusFecha"]
                ,DATA["grusId"]];
                
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return DATA;
    }
}

?>