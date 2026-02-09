<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset: UTF-8');

$action = $_GET['action'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);
$db = new PDO("mysql:host=localhost;dbname=tilewar_database", "admin", "ift3225");

switch ($action) {
    case 'signup':
        registerUser($input);
        break;

    case 'login':
        tryUser($input);
        break;

    case 'delUser':
        deleteUser($input);
        break;

    default:
        http_response_code(404);
        echo json_encode(["return" => 322501]);
        break;
}

function registerUser($data)
{
    $email = $data["email"];
    $password = $data["password"];

    $return = array(
        'return' => 322500,
        'email' => $email,
        'password' => $password,
    );

    echo json_encode($return);
}

function tryUser($data)
{
    global $db;

    $email = $data["email"];
    $password = $data["password"];

    // SQL query
    $req = $db->prepare(
        "SELECT email, pw FROM Users WHERE email = :email"
    );
    $req->execute(["email" => $email]);
    $user = $req->fetch();
    $ret = 322500;

    if ($user) {
        if ($password != $user["pw"]) {
            $ret = 322504;
        }
    } else {
        $ret = 322503;
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}


function deleteUser($data)
{
    $return = array(
        'return' => 322500,
    );

    echo json_encode($return);
}
