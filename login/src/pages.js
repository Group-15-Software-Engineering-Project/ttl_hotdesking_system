import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./Login.css";
import crest from "./tcd-logo.png";
import { Routes,} from "react-router-dom";
import { Link } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="Login">
      <Routes></Routes>
      <img src={crest} alt="Crest" />
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Link to="/home">
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Login
          </Button>
        </Link>
      </Form>
    </div>
  );
}

export function Home() {
  return (
    <div>
      <h1> You have successfully logged in</h1>
    </div>
  );
}
