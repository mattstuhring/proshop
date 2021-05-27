import React, { Component } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Row, Col, Image, Card, ListGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getOrderDetails,
  payOrder,
  deliverOrder
} from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import store from '../store';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../actions/types';

class OrderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sdkReady: false
    };
  }

  componentDidMount() {
    const { order, match, userInfo } = this.props;

    if (!userInfo) {
      this.props.history('/login');
    }

    if (!order || order._id !== match.params.id) {
      this.props.getOrderDetails(match.params.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { order, match, successPay, successDeliver } = this.props;

    if (
      prevProps.order !== order ||
      prevProps.successPay !== successPay ||
      prevProps.successDeliver !== successDeliver
    ) {
      // Dynamically adding required paypal script
      const addPayPalScript = async () => {
        const { data: clientId } = await axios.get('/api/v1/config/paypal');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        script.async = true;
        script.onload = () => {
          this.setState({
            sdkReady: true
          });
        };
        document.body.appendChild(script);
      };

      if (!order || successPay || successDeliver) {
        store.dispatch({ type: ORDER_PAY_RESET });
        store.dispatch({ type: ORDER_DELIVER_RESET });
        this.props.getOrderDetails(match.params.id);
      } else if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          this.setState({
            sdkReady: true
          });
        }
      }
    }
  }

  handleDeliver = () => {
    this.props.deliverOrder(this.props.order);
  };

  handleSuccessPayment = (paymentResult) => {
    this.props.payOrder(this.props.order._id, paymentResult);
  };

  render() {
    const { order, loading, loadingPay, error, userInfo, loadingDeliver } =
      this.props;
    const { sdkReady } = this.state;

    if (!loading) {
      const addDecimals = (num) => {
        return Math.round((num * 100) / 100).toFixed(2);
      };

      order.itemsPrice = addDecimals(
        this.props.order.orderItems.reduce((acc, item) => {
          return acc + item.price * item.qty;
        }, 0)
      );
    }

    return loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <>
        <h1>Order {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>

                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant='success'>
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant='danger'>Not delivered.</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant='success'>Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant='danger'>Not paid.</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty.</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {order.orderItems.map((item, index) => {
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
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={this.handleSuccessPayment}
                      />
                    )}
                  </ListGroup.Item>
                )}
                {loadingDeliver && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type='button'
                        className='btn btn-block'
                        onClick={this.handleDeliver}
                      >
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  order: state.orderDetails.order,
  loading: state.orderDetails.loading,
  error: state.orderDetails.error,
  loadingPay: state.orderPay.loading,
  successPay: state.orderPay.success,
  loadingDeliver: state.orderDeliver.loading,
  successDeliver: state.orderDeliver.success
});

export default connect(mapStateToProps, {
  getOrderDetails,
  payOrder,
  deliverOrder
})(OrderScreen);
