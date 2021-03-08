<?php
class AgregarMovil {
    public $table = 'Movil';
    public $fields = 'B.moviId
                    ,CONVERT(VARCHAR, B.moviModoFecha, 126) moviModoFecha
                    ,moviModoOdometro
                    ,CONVERT(VARCHAR, B.moviFechaAlta, 126) moviFechaAlta
                    ,B.moviBorrado
                    ,A.movilID
                    ,A.patente
                    ,A.descripcion
                    ,C.Nombre dependencia
                    ,C.OrdenamientoArbol dependenciaCompleta
                    ,A.marca
                    ,A.modelo
                    ,A.anio
                    ,A.chasis
                    ,T.Nombre tipoMovil
                    ,A.numeroMovil
                    ,A.color
                    ,A.seguro
                    ,A.poliza
                    ,A.numeroMotor
                    ,A.peso      
                    ,A.tienePatrullaje
                    ,A.CUIT';
    
    //------------------------------------GET
    public function get($db) {
        $sql = "SELECT TOP 100 $this->fields
        FROM AVL_Estructura.dbo.Movil A
        LEFT OUTER JOIN SISEP_ControlFlota.dbo.Movil B ON A.MovilID = B.moviId
        LEFT OUTER JOIN AVL_Estructura.dbo.Comp C ON A.CompID = C.CompID
        LEFT OUTER JOIN AVL_Estructura.dbo.TipoMovil T ON T.TipoMovilID = A.TipoMovilID 
        WHERE A.Activa = 1 AND A.Borrado = 0 ";

        $params = null;

        if(isset($_GET["patente"])){
            $params = ["%" . $_GET["patente"] . "%"];
            $sql = $sql . "AND A.patente LIKE ? ";
        };

        if(isset($_GET["descripcion"])){
            $params = ["%" . $_GET["descripcion"] . "%"];
            $sql = $sql . "AND A.descripcion LIKE ? ";
        };

        if(isset($_GET["dependencia"])){
            $params = ["%" . $_GET["dependencia"] . "%"];
            $sql = $sql . "AND C.nombre LIKE ? ";
        };

        $stmt = SQL::query($db, $sql, $params);
        $results = [];

        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;

    }

}

?>