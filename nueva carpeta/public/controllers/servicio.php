<?php
include_once 'modules/servicio.php';

//----------------------------------GET

$app->get("/servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new Servicio();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------DELETE

$app->delete("/servicio/{id}",function ($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new Servicio();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------POST

$app->post("/servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new Servicio();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------PUT

$app->put("/servicio",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new Servicio();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});
?>