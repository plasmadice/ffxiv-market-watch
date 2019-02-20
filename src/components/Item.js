import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import soundFile from "../data/mario-coin.wav";

export default function Item({ first, name, second, third, userName, muted }) {
  const lister = first.CraftSignature;
  const alert = new Audio(soundFile);

  if (userName.toLowerCase() !== lister.toLowerCase() && !muted) {
    alert.play();
  }

  const styles = {
    good: {
      width: "22rem",
      margin: "10px",
      backgroundColor: "#99AAB5"
    },
    bad: {
      width: "22rem",
      margin: "10px",
      backgroundColor: "#dc3545"
    }
  };

  return (
    <Card
      style={
        userName.toLowerCase() !== lister.toLowerCase()
          ? styles.bad
          : styles.good
      }
    >
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Order / Name / Retainer
        </Card.Subtitle>
        <Card.Header style={{ backgroundColor: "#33393e" }}>
          Current Lowest Price: {first.PricePerUnit}
        </Card.Header>
        <ListGroup>
          <ListGroup.Item
            style={
              userName.toLowerCase() !== first.CraftSignature.toLowerCase()
                ? { backgroundColor: "#7289DA" }
                : { backgroundColor: "#23272A" }
            }
          >
            1st: {`${first.CraftSignature}[${first.RetainerName}]`}
          </ListGroup.Item>
          {second !== undefined ? (
            <ListGroup.Item
              style={
                userName.toLowerCase() !== second.CraftSignature.toLowerCase()
                  ? { backgroundColor: "#7289DA" }
                  : { backgroundColor: "#23272A" }
              }
            >
              2nd: {`${second.CraftSignature}[${second.RetainerName}]`}
            </ListGroup.Item>
          ) : null}
          {third !== undefined ? (
            <ListGroup.Item
              style={
                userName.toLowerCase() !== third.CraftSignature.toLowerCase()
                  ? { backgroundColor: "#7289DA" }
                  : { backgroundColor: "#23272A" }
              }
            >
              3rd: {`${third.CraftSignature}[${third.RetainerName}]`}
            </ListGroup.Item>
          ) : null}
        </ListGroup>
        {/* <Card.Text>Price: {price}</Card.Text> */}
        <Card.Text>Item ID #: {first.ID}</Card.Text>
      </Card.Body>
    </Card>
  );
}
