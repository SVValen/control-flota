<?php
include_once 'modules/grupo-servicio.php';

//----------------------------------GET

$app->get("/grupo-servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new GrupoServicio();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------DELETE

$app->delete("/grupo-servicio/{id}",function ($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new GrupoServicio();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------POST

$app->post("/grupo-servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new GrupoServicio();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------POST

$app->put("/grupo-servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new GrupoServicio();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

?>