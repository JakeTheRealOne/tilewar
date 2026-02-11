# Tilewar - Project 1 IFT3225

Website for collaborative tile organisation.

## Navigation

## Authors

| **First name** | **Last name** | **Student number** |
|----------------|---------------|--------------------|
| Bilal          | Vandenberge   | 20346870           |
| Moulay Ali     | Lablih        | ?                  |

## Instalation

Clone this repo.

## Execution - client side

After running the php server locally, open this page in your browser:

```path
?
```

## Execution - server side

To run the server (locally):

### 1. Be sure that mysql and php are installed on your machine

```bash
mysql --version
php --version
```

### 2. Create the database (in the directory `server_side/sql`)

```bash
mysql -u root -p < server_side/sql/init.sql
# Enter your password (default: blank)
```

### 3. Run the php server (in the directory `server_side/server`)

```bash
php -S localhost:8000
```

## License

This is a project for the cours "IFT3225" of the University of Montreal and is under the GNU General Public License v3.