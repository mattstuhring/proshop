import React, { Component } from 'react';
import { Button, Row, Col, Image, Card, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';

class PlaceOrderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      paymentMethod: 'PayPal'
    };
  }

  componentDidMount() {
    let itemsPrice, shippingPrice, taxPrice, totalPrice;

    const addDecimals = (num) => {
      return Math.round((num * 100) / 100).toFixed(2);
    };

    itemsPrice = addDecimals(
      this.props.cartItems.reduce((acc, item) => {
        return acc + item.price * item.qty;
      }, 0)
    );

    // TODO: Adjust shipping price
    shippingPrice = addDecimals(Number(itemsPrice) > 100.0 ? 0 : 10);

    // TODO: Adjust tax price
    taxPrice = addDecimals(Number((0.1 * itemsPrice).toFixed(2)));

    totalPrice = Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

    this.setState({
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.success) {
      this.props.history.push(`/orders/${this.props.order._id}`);
    }
  }

  handlePlaceOrder = () => {
    console.log('Order');
    this.props.createOrder({
      orderItems: this.props.cartItems,
      shippingAddress: this.props.shippingAddress,
      paymentMethod: this.props.paymentMethod
        ? this.props.paymentMethod
        : this.state.paymentMethod,
      itemsPrice: this.state.itemsPrice,
      shippingPrice: this.state.shippingPrice,
      taxPrice: this.state.taxPrice,
      totalPrice: this.state.totalPrice
    });
  };

  render() {
    const { cartItems, shippingAddress, paymentMethod, error } = this.props;
    let { itemsPrice, shippingPrice, taxPrice, totalPrice } = this.state;

    return (
      <>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Address: </strong>
                  {shippingAddress.address}, {shippingAddress.city}{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {paymentMethod ? paymentMethod : this.state.paymentMethod}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {cartItems.length === 0 ? (
                  <Message>Your cart is empty.</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {cartItems.map((item, index) => {
                      return (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x {item.price} = $
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {error && <Message variant='danger'>{error}</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block'
                    disabled={cartItems === 0}
                    onClick={this.handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  cartItems: state.cart.cartItems,
  shippingAddress: state.cart.shippingAddress,
  paymentMethod: state.cart.paymentMethod,
  order: state.orderCreate.order,
  success: state.orderCreate.success,
  error: state.orderCreate.error
});

export default connect(mapStateToProps, { createOrder })(PlaceOrderScreen);
