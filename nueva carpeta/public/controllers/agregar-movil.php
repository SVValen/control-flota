<?php
include_once 'modules/agregar-movil.php';
//----------------------------------GET

$app->get("/agregar-movil",function($request,$response,$args) {
    $db = SQL::connect();
    $model = new AgregarMovil();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});
?>