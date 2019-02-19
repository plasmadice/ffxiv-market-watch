import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Item from "./components/Item";
import { Button, Col, Form } from "react-bootstrap";

class App extends Component {
  state = {
    items: [
      23769, // knuckles
      23770, // axe
      23771, // lance
      23774, // odachi
      23781 // katana
    ],
    counter: 0,
    itemInfo: [],
    userName: "",
    itemField: "",
    muted: false
  };

  componentDidMount = () => {
    this.staggerCalls();
  };

  componentDidUpdate = () => {
    if (this.state.items.length > 0) {
      if (this.state.counter >= this.state.items.length) {
        this.setState({ counter: 0 });
      }
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.itemField.startsWith("-")) {
      const newItems = this.state.items.filter(item => {
        // eslint-disable-next-line
        return item != this.state.itemField.slice(1);
      });

      const newItemInfo = this.state.itemInfo.filter(item => {
        // eslint-disable-next-line
        return item.Item.ID != this.state.itemField.slice(1);
      });

      this.setState({ items: newItems, itemInfo: newItemInfo });
    } else {
      const oldItems = this.state.items;
      oldItems.push(Number(this.state.itemField));
    }
  };

  handleUserNameChange = event => {
    this.setState({ userName: event.target.value });
  };

  handleItemFieldChange = event => {
    this.setState({ itemField: event.target.value });
  };

  handleMute = () => {
    this.setState((prevState, props) => {
      return { muted: !prevState.muted };
    });
  };

  staggerCalls = () => {
    setInterval(() => {
      if (this.state.items.length > 0) {
        this.getPrices(this.state.items[this.state.counter]);

        this.setState(() => {
          return { counter: this.state.counter + 1 };
        });
      }
    }, 1000);
  };

  getPrices = item => {
    const itemInfo = this.state.itemInfo;
    const url = "https://xivapi.com";
    const key = "d8e0653f39804f04aa69ab6a";

    axios
      .get(`${url}/market/excalibur/items/${item}?key=${key}`)
      .then(res => {
        if (res.status === 200) {
          itemInfo[this.state.counter] = res.data;
          this.setState({ itemInfo: itemInfo });
        }
      })
      .catch(error => console.log("You broke something", error));
  };

  render() {
    return (
      <div className="main-container">
        <Button
          className="mute-button"
          onClick={this.handleMute}
          variant={!this.state.muted ? "success" : "danger"}
        >
          {!this.state.muted ? "Unmute" : "Mute"}
        </Button>
        <h1>FFXIV Item Watcher</h1>
        <h3 />
        <Form onSubmit={this.handleSubmit}>
          <Form.Row>
            <Col>
              <Form.Control
                onChange={this.handleUserNameChange}
                type="text"
                value={this.state.userName}
                placeholder="Character Name"
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                onChange={this.handleItemFieldChange}
                value={this.state.itemField}
                placeholder="Item ID"
              />
            </Col>
            <Col>
              <Button variant="info" type="submit" block>
                Submit
              </Button>
            </Col>
          </Form.Row>
        </Form>
        {this.state.items.length !== this.state.itemInfo.length && (
          <code>
            Loading items... If this takes too long you entered a bad item ID
          </code>
        )}
        <h4>Instructions</h4>
        <p style={{ textAlign: "center" }}>
          Enter your character name to be notified when someone undercuts you.
          <br /> To add items enter the item ID <code>23788</code>. To remove
          items put a '-' before the id <code>-23788</code>
        </p>
        <div className="items">
          {this.state.items.length &&
            this.state.itemInfo.map(item => {
              const cheapestItem = item.Prices.sort((a, b) => {
                return a.PricePerUnit - b.PricePerUnit;
              });

              return (
                <Item
                  userName={this.state.userName}
                  key={item.Prices[0].ID + Math.random()}
                  name={item.Item.Name}
                  info={cheapestItem[0]}
                  competitor={cheapestItem[1]}
                  muted={this.state.muted}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

export default App;
