<?php
include_once 'modules/servicio-tarea.php';

//----------------------------------GET

$app->get("/servicio-tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new ServicioTarea();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------DELETE

$app->delete("/servicio-tarea/{id}",function ($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new ServicioTarea();
    $results = $model->delete($db,$id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------POST

$app->post("/servicio-tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new ServicioTarea();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------PUT

$app->put("/servicio-tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new ServicioTarea();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});
?>