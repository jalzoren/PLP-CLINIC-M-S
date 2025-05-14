<?php
class Database {
    private $host = 'localhost';
    private $user = 'root';
    private $password = '';
    private $database = 'clinic_system'; // Specify your database name here
    public $conn;

    

    public function __construct() {
        $this->conn = new mysqli($this->host, $this->user, $this->password, $this->database);
        
        if ($this->conn->connect_error) {
            throw new Exception("Connection failed: " . $this->conn->connect_error);
        }
    }

    

    public function getConnection() {
        return $this->conn;
    }

    public function close() {
        $this->conn->close();
    }
}
?>
