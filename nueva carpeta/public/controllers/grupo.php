<?php
include_once 'modules/grupo.php';

//------------------------------------GET

$app->get('/grupo',function($request, $response, $args){
    $db = SQL::connect();
    $model = new Grupo();
    $results = $model->get($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------DELETE

$app->delete('/grupo/{id}',function($request, $response, $args){
    $id = $args['id'];
    $db = SQL::connect();
    $model = new Grupo();
    $results = $model->delete($db, $id);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------POST
$app->post('/grupo',function($request, $response, $args){
    $db = SQL::connect();
    $model = new Grupo();
    $results = $model->post($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
});

//----------------------------------PUT

$app->put('/grupo',function($request, $response, $args){
    $db = SQL::connect();
    $model = new Grupo();
    $results = $model->put($db);
    SQL::close($db);

    $payload = json_encode($results);
    $response->getBody()->write($payload);

    return $response
                    ->withHeader('Content-type','aplication/json');
})
?>