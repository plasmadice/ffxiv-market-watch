import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import soundFile from "../data/mario-coin.wav";

export default function Item({ info, name, competitor, userName, muted }) {
  const lister = info.CraftSignature;
  const price = info.PricePerUnit;
  const secondPrice = competitor.PricePerUnit;
  const alert = new Audio(soundFile);

  if (userName !== lister && !muted) {
    alert.play();
  }

  return (
    <Card
      style={{ width: "18rem", margin: "10px", backgroundColor: "#99AAB5" }}
    >
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{lister}</Card.Subtitle>
        <ListGroup>
          <ListGroup.Item
            style={
              userName !== lister
                ? { backgroundColor: "red" }
                : { backgroundColor: "#7289DA" }
            }
          >
            Lowest Price: {price}
          </ListGroup.Item>
          <ListGroup.Item style={{ backgroundColor: "#7289DA" }}>
            2nd lowest: {secondPrice}
          </ListGroup.Item>
        </ListGroup>
        {/* <Card.Text>Price: {price}</Card.Text> */}
        <Card.Text>Item ID #:{info.ID}</Card.Text>
      </Card.Body>
    </Card>
  );
}
