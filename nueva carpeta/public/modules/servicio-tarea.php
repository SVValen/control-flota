<?php 

class ServicioTarea {
    public $table = 'ServicioTarea';
    public $fields = 'setaId
                    ,setaServId
                    ,setaTareId
                    ,CONVERT(VARCHAR, setaFechaAlta, 126) setaFechaAlta
                    ,setaBorrado
                    ,tareNombre';
    public $join = " LEFT OUTER JOIN Tarea ON setaTareId = tareId";

    //----------------------------------GET
    public function get($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE setaBorrado = 0 ";
        $params = null;

        if (isset($_GET["setaServId"])) {
            $params = [$_GET["setaServId"]];
            $sql = $sql . " AND setaServId = ?";
        };

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
                SET setaBorrado = 1
                WHERE setaId = ?";
        $params = [$id];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);

        return [];
    }
    
    //---------------------------------POST

    public function post($db) {
        $sql = "INSERT INTO $this->table
                (setaServId
                ,setaTareId
                ,setaFechaAlta
                ,setaBorrado) 
                VALUES(?,?,GETDATE(),0);
                
                SELECT @@IDENTITY setaId, CONVERT(VARCHAR, GETDATE(),126) setaFechaAlta;";

        $params = [DATA["setaServId"],DATA["setaTareId"]];
        $stmt = SQL::query($db, $sql, $params);

        sqlsrv_fetch($stmt);
        sqlsrv_next_result($stmt);
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["setaId"] = $row["setaId"];
        $results["setaFechaAlta"] = $row["setaFechaAlta"];
        $results["setaBorrado"] = 0;
        

        return $results;
}
    //---------------------------------PUT

    public function put($db) {
        $sql = "UPDATE $this->table
                SET setaServId = ?
                    ,setaTareId = ?
                WHERE setaId = ?";
        $params = [DATA["setaServId"],DATA["setaTareId"],DATA["setaId"]];
        $stmt = SQL::query($db,$sql,$params);

        sqlsrv_fetch($stmt);

        return DATA;
    }
}
?>