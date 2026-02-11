<?php
// CRUD for Tiles
// Author: Bilal Vandenberge

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset: UTF-8');

$action = $_GET['action'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);
$db_options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$db = new PDO("mysql:host=localhost;dbname=tilewar_database", "admin", "ift3225", $db_options);

switch ($action) {
    case 'create':
        create($input);
        break;

    case 'get':
        get($input);
        break;

    case 'delete':
        delete($input);
        break;

    default:
        http_response_code(404);
        echo json_encode(["return" => 322501]);
        break;
}

function user_inner_challenge($email, $password)
{
    global $db;

    // SQL query
    $req = $db->prepare(
        "SELECT email, pw FROM Users WHERE email = :email"
    );
    $req->execute(["email" => $email]);
    $user = $req->fetch();

    return ($user && password_verify($password, $user["pw"]));
}

function category_inner_challenge($cat_id)
{
    global $db;

    // SQL query
    $req = $db->prepare(
        "SELECT id FROM Categories WHERE id = :cat_id"
    );
    $req->execute(["cat_id" => $cat_id]);
    $cat = $req->fetch();

    return ($cat);
}

function create($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["title"]) || !isset($data["cat_id"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
    }

    $content = $data["content"];
    $cat_id = $data["cat_id"];
    $title = $data["title"];
    $email = $data["email"];
    $password = $data["password"];

    $ret = 322500;

    if (!user_inner_challenge($email, $password)) {
        $ret = 322506;
    } else if (!category_inner_challenge($cat_id)) {
        $ret = 322508;
    } else {
        $req_insert = $db->prepare(
            "INSERT INTO Tiles (author_email, cat_id, title, content) VALUES (:email, :cat_id, :title, :content)"
        );
        $req_insert->execute(["email" => $email, "cat_id" => $cat_id, "title" => $title, "content" => $content]);
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}

function get($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["tile_id"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
    }


    $tile_id = $data["tile_id"];
    $email = $data["email"];
    $password = $data["password"];

    $ret = 322500;

    if (!user_inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT * FROM Tiles WHERE id = :id"
        );
        $req->execute(["id" => $tile_id]);
        $tile = $req->fetch();
    }

    $return = array(
        'return' => $ret,
        'tile' => $tile,
    );

    echo json_encode($return);
}


function delete($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["tile_id"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
    }

    $tile_id = $data["tile_id"];
    $email = $data["email"];
    $password = $data["password"];

    $ret = 322500;

    if (!user_inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req_del = $db->prepare("DELETE FROM Tiles WHERE id = :cat_id");
        $req_del->execute(["cat_id" => $tile_id]);
        if ($req_del->rowCount() == 0) {
            $ret = 322509;
        }
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}
