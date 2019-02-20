import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Item from "./components/Item";
import { Button, Col, Form } from "react-bootstrap";
import servers from "./data/servers";

class App extends Component {
  state = {
    items: [],
    counter: 0,
    itemInfo: [],
    userName: "",
    itemField: "",
    muted: false,
    server: "excalibur"
  };

  componentDidMount = () => {
    if (localStorage.FFXIVMarket !== undefined) {
      const { muted, items, userName, server } = JSON.parse(
        localStorage.getItem("FFXIVMarket")
      );

      this.setState({
        muted: muted,
        items: items,
        userName: userName,
        server: server
      });
    }

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

    // removal
    if (this.state.itemField.startsWith("-")) {
      const newItems = this.state.items.filter(item => {
        // eslint-disable-next-line
        return item != this.state.itemField.slice(1);
      });

      const newItemInfo = this.state.itemInfo.filter(item => {
        // eslint-disable-next-line
        return item.Item.ID != this.state.itemField.slice(1);
      });

      const local = {
        muted: this.state.muted,
        items: newItems,
        userName: this.state.userName,
        server: this.state.server
      };

      localStorage.setItem("FFXIVMarket", JSON.stringify(local));

      this.setState({ items: newItems, itemInfo: newItemInfo, itemField: "" });
    } else {
      // addition
      const oldItems = this.state.items;
      oldItems.push(Number(this.state.itemField));

      const local = {
        muted: this.state.muted,
        items: this.state.items,
        userName: this.state.userName,
        server: this.state.server
      };

      localStorage.setItem("FFXIVMarket", JSON.stringify(local));
      this.setState({ itemField: "" });
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

    const local = {
      muted: !this.state.muted,
      items: this.state.items,
      userName: this.state.userName,
      server: this.state.server
    };

    localStorage.setItem("FFXIVMarket", JSON.stringify(local));
  };

  onServerChange = event => {
    this.setState({ server: event.target.value.toLowerCase() });
  };

  staggerCalls = () => {
    setInterval(() => {
      if (this.state.items.length > 0) {
        this.getPrices(this.state.items[this.state.counter]);

        this.setState(() => {
          return { counter: this.state.counter + 1 };
        });
      }
    }, 330);
  };

  getPrices = item => {
    const itemInfo = this.state.itemInfo;
    const url = "https://xivapi.com";
    const key = "d8e0653f39804f04aa69ab6a";
    const server = this.state.server;

    axios
      .get(`${url}/market/${server}/items/${item}?key=${key}`)
      .then(res => {
        if (res.status === 200) {
          itemInfo[this.state.counter] = res.data;
          this.setState({ itemInfo: itemInfo });
        }
      })
      .catch(error => {
        console.log("Probably bad item ID", error);

        this.setState({
          items: this.state.items.filter(itemID => {
            // eslint-disable-next-line
            return itemID !== item;
          })
        });
      });
  };

  render() {
    return (
      <div className="main-container">
        <Button
          className="mute-button"
          onClick={this.handleMute}
          variant={this.state.muted ? "danger" : "success"}
        >
          {this.state.muted ? "Unmute" : "Mute"}
        </Button>
        <h1 className="headline">FFXIV Item Watcher</h1>
        <Form onSubmit={this.handleSubmit} className="input-form">
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
              <Form.Control as="select" onChange={this.onServerChange}>
                <option>Server</option>
                {servers.map(server => {
                  return <option key={server}>{server}</option>;
                })}
              </Form.Control>
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
        <h4 className="instructions">Instructions</h4>
        <p style={{ textAlign: "center" }}>
          Enter your character name to be notified when someone undercuts you.
          <br /> To add items enter the item ID <code>"23788"</code>. To remove
          items put a '-' before the id <code>"-23788"</code>
        </p>
        <div className="items">
          {this.state.items.length &&
            this.state.itemInfo.map(item => {
              const cheapestItem = item.Prices.sort((a, b) => {
                return a.PricePerUnit - b.PricePerUnit;
              });

              if (item.Prices[0] !== undefined) {
                return (
                  <Item
                    userName={this.state.userName}
                    key={item.Prices[0].ID + Math.random()}
                    name={item.Item.Name}
                    first={cheapestItem[0]}
                    second={cheapestItem[1]}
                    third={cheapestItem[2]}
                    muted={this.state.muted}
                  />
                );
              } else {
                return null;
              }
            })}
        </div>
      </div>
    );
  }
}

export default App;
