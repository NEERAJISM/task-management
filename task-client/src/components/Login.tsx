import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginCard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username.length < 8 || password.length < 8) {
      setError("Username and password must be at least 8 characters long.");
    } else {
      console.log("Login clicked!");
      setError("");

      const response = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        console.log("Token:", token);
        localStorage.setItem("token", token);
        navigate("/Home");
      }
    }
  };

  const handleSignup = () => {
    if (username.length < 8 || password.length < 8) {
      setError("Username and password must be at least 8 characters long.");
    } else {
      console.log("Signup clicked!");
      setError("");
    }
  };

  return (
    <Card style={{ width: "300px", margin: "0 auto", marginTop: "100px" }}>
      <Card.Body>
        <Card.Title style={{ textAlign: "center" }}>Login</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mt-4" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
            />
          </Form.Group>

          <Form.Group className="mt-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </Form.Group>

          <div className="row mt-4">
            <div className="col">
              <Button
                variant="primary"
                className="mr-2"
                style={{ float: "right" }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
            <div className="col">
              <Button variant="success" onClick={handleSignup}>
                Signup
              </Button>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginCard;
