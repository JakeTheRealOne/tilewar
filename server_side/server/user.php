<?php
// CRUD for Users
// Author: Bilal Vandenberge

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset: UTF-8');

$action = $_GET['action'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);
$db = new PDO("mysql:host=localhost;dbname=tilewar_database", "admin", "ift3225");

switch ($action) {
    case 'create':
        create($input);
        break;

    case 'challenge':
        challenge($input);
        break;

    case 'delete':
        delete($input);
        break;

    default:
        http_response_code(404);
        echo json_encode(["return" => 322501]);
        break;
}

function create($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
        return;
    }

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
        $ret = 322502;
    } else {
        $pw_hash = password_hash($password, PASSWORD_DEFAULT);
        $req_insert = $db->prepare("INSERT INTO Users (email, pw) VALUES (:email, :pw)");
        $req_insert->execute(["email" => $email, "pw" => $pw_hash]);

        // Set update timestamp
        $db->prepare("UPDATE LastTimestamps SET updated_at = CURRENT_TIMESTAMP WHERE table_name = \"Users\"")->execute();
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}

function challenge($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
        return;
    }

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
        if (!password_verify($password, $user["pw"])) {
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


function delete($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
        return;
    }

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
        if (!password_verify($password, $user["pw"])) {
            $ret = 322504;
        } else {
            $req_del = $db->prepare("DELETE FROM Users WHERE email = :email");
            $req_del->execute(["email" => $email]);

            // Set update timestamp
            $db->prepare("UPDATE LastTimestamps SET updated_at = CURRENT_TIMESTAMP WHERE table_name = \"Users\"")->execute();
        }
    } else {
        $ret = 322503;
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}
