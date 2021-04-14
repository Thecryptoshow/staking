
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Card extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <React.Fragment>
        <div className="grid-item">
        <NavLink to={this.props.redirectLink}>   
          <div className="gurd-image">
            <img src={this.props.image} />
          </div>
          <div className="gurd-footer">
            <h3>{this.props.title}
              <span class="apr-init">x10% APR</span>
            </h3>
            <div className="wrap-element">
              <div className="footer-location">{new Date(this.props.date).toLocaleDateString()}</div>
              <div className="footer-date" style={{display: "flex", justifyContent: "space-between"}}>
                {/* <div class="card-size">0.00</div> */}
                <img src={this.props.logoImg} /> <p class="price">22,456</p>
              </div>
            </div>
          </div>
          </NavLink>
        </div>
        {/* <Card>
            <Card.Img variant="top" src={img} />
            <Card.Body>
              <Card.Title>{this.props.title}</Card.Title>
              <Card.Text>
                {this.props.description}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="footer-card">
              <div className="user-card">
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{this.props.username}</Tooltip>}>
                  <Image src={this.props.user_image} roundedCircle />
                </OverlayTrigger>
                {this.props.username}
              </div>
              <div className="card-price">
                ${this.props.price}
              </div>
            </Card.Footer>
          </Card> */}
      </React.Fragment>
    );
  }
}
export default (Card);