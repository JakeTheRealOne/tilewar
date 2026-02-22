<?php
// Get all categories, get all tiles and get all users
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
    case 'users':
        users($input);
        break;

    case 'categories':
        categories($input);
        break;

    case 'tiles':
        tiles($input);
        break;

    // case 'users_last_update':
    //     usersLastUpdate($input);
    //     break;

    case 'categories_last_update':
        categoriesLastUpdate($input);
        break;

    case 'tiles_last_update':
        tilesLastUpdate($input);
        break;

    default:
        http_response_code(404);
        echo json_encode(["return" => 322501]);
        break;
}

function inner_challenge($email, $password)
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

function users($data)
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

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT email FROM Users"
        );
        $req->execute([]);
        $all_users = $req->fetchAll();
    }

    $return = array(
        'return' => $ret,
        'users' => $all_users,
    );

    echo json_encode($return);
}

function categories($data)
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

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT id, title FROM Categories"
        );
        $req->execute([]);
        $all_categories = $req->fetchAll();
    }

    $return = array(
        'return' => $ret,
        'categories' => $all_categories,
    );

    echo json_encode($return);
}

function tiles($data)
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

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT id, cat_id, title, content, author_email FROM Tiles"
        );
        $req->execute([]);
        $all_tiles = $req->fetchAll();
    }

    $return = array(
        'return' => $ret,
        'tiles' => $all_tiles,
    );

    echo json_encode($return);
}

function categoriesLastUpdate($data)
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

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT updated_at FROM LastTimestamps WHERE table_name = \"Categories\""
        );
        $req->execute([]);
        $timestamp = $req->fetch();
    }

    $return = array(
        'return' => $ret,
        'timestamp' => strtotime($timestamp["updated_at"]),
    );

    echo json_encode($return);
}

function tilesLastUpdate($data)
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

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT updated_at FROM LastTimestamps WHERE table_name = \"Tiles\""
        );
        $req->execute([]);
        $timestamp = $req->fetch();
    }

    $return = array(
        'return' => $ret,
        'timestamp' => strtotime($timestamp["updated_at"]),
    );

    echo json_encode($return);
}
