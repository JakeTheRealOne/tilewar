<?php
// CRUD for Categories
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

function create($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["title"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
        return;
    }

    $title = $data["title"];
    $email = $data["email"];
    $password = $data["password"];

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req_insert = $db->prepare(
            "INSERT INTO Categories (author_email, title) VALUES (:email, :title)"
        );
        $req_insert->execute(["email" => $email, "title" => $title]);

        // Set update timestamp
        $db->prepare("UPDATE LastTimestamps SET updated_at = CURRENT_TIMESTAMP WHERE table_name = \"Categories\"")->execute();
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}

function get($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["cat_id"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
        return;
    }


    $cat_id = $data["cat_id"];
    $email = $data["email"];
    $password = $data["password"];

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req = $db->prepare(
            "SELECT * FROM Categories WHERE id = :id"
        );
        $req->execute(["id" => $cat_id]);
        $cat = $req->fetch();
    }

    $return = array(
        'return' => $ret,
        'category' => $cat,
    );

    echo json_encode($return);
}


function delete($data)
{
    global $db;

    if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["cat_id"])) {
        echo json_encode(array(
            'return' => 322507,
        ));
        return;
    }

    $cat_id = $data["cat_id"];
    $email = $data["email"];
    $password = $data["password"];

    $ret = 322500;

    if (!inner_challenge($email, $password)) {
        $ret = 322506;
    } else {
        $req_del = $db->prepare("DELETE FROM Categories WHERE id = :cat_id");
        $req_del->execute(["cat_id" => $cat_id]);
        if ($req_del->rowCount() == 0) {
            $ret = 322508;
        }

        // Set update timestamp
        $db->prepare("UPDATE LastTimestamps SET updated_at = CURRENT_TIMESTAMP WHERE table_name = \"Categories\"")->execute();
    }

    $return = array(
        'return' => $ret,
    );

    echo json_encode($return);
}
