<?php
include_once 'modules/tarea.php';

//--------------------------------GET

$app->get("/tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new Tarea();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------DELETE

$app->delete("/tarea/{id}",function ($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new Tarea();
    $results = $model->delete($db, $id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------POST

$app->post("/tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new Tarea();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//---------------------------------PUT

$app->put("/tarea",function ($request, $response, $args){
    $db = SQL::connect();
    $model = new Tarea();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

?>