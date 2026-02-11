# Server documentation - Fetch requests

All fetch requests that the server can identify and respond to:

| Method | Path                        | Input json                                                                     | Response json                       | Description                                 |
|--------|-----------------------------|--------------------------------------------------------------------------------|-------------------------------------|---------------------------------------------|
| PUT    | /user.php?action=create     | {email: STRING, password: STRING}                                              | {return: INT}                       | Create a user                               |
| PUT    | /user.php?action=challenge  | {email: STRING, password: STRING}                                              | {return: INT}                       | Check if the user & password are registered |
| PUT    | /user.php?action=delete     | {email: STRING, password: STRING}                                              | {return: INT}                       | Delete a user                               |
| PUT    | /category.php?action=create | {email: STRING, password: STRING, title: STRING}                               | {return: INT}                       | Create a category                           |
| PUT    | /category.php?action=get    | {email: STRING, password: STRING, cat_id: INT}                                 | {return: INT, category: COLLECTION} | Get the data of a category with its id      |
| PUT    | /category.php?action=delete | {email: STRING, password: STRING, cat_id: INT}                                 | {return: INT}                       | Delete a category                           |
| PUT    | /tile.php?action=create     | {email: STRING, password: STRING, title: STRING, cat_id: INT, content: STRING} | {return: INT}                       | Create a tile                               |
| PUT    | /tile.php?action=get        | {email: STRING, password: STRING, tile_id: INT}                                | {return: INT, tile: COLLECTION}     | Get the data of a tile with its id          |
| PUT    | /tile.php?action=delete     | {email: STRING, password: STRING, tile_id: INT}                                | {return: INT}                       | Delete a tile                               |

Note: Every json input must provide the email and password of the currently authentified user for security purpose. If those doesn't pass the challenge inside the server, an authentification error will occur.

Note: The return key of the json response will contains a value from the table of the [return.md documentation](./return.md).