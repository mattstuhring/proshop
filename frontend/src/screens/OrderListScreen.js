import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';

class OrderListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.isAdmin) {
      this.props.listOrders();
    } else {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.orders !== this.props.orders) {
      this.setState({
        orders: this.props.orders
      });
    }
  }

  render() {
    const { loading, error } = this.props;
    const { orders } = this.state;

    console.log(this.props.orders);

    /*
    createdAt: "2021-05-25T14:50:15.863Z"
    isDelivered: false
    isPaid: true
    orderItems: (2) [{…}, {…}]
    paidAt: "2021-05-25T14:50:52.303Z"
    paymentMethod: "PayPal"
    paymentResult: {id: "0E9039316S505352Y", status: "COMPLETED", update_time: "2021-05-25T14:50:55Z", email_address: "sb-8qqid6274532@personal.example.com"}
    shippingAddress: {address: "17910 8th PL W", city: "LYNNWOOD", postalCode: "98037", country: "United States"}
    shippingPrice: 0
    taxPrice: 65
    totalPrice: 715
    */

    return (
      <>
        <h1>Orders</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!orders
                ? null
                : orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user && order.user.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i
                            className='fas fa-times'
                            style={{ color: 'red' }}
                          ></i>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i
                            className='fas fa-times'
                            style={{ color: 'red' }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/orders/${order._id}`}>
                          <Button variant='light' className='btn-sm'>
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  orders: state.orderList.orders,
  loading: state.orderList.loading,
  error: state.orderList.error
});

export default connect(mapStateToProps, { listOrders })(OrderListScreen);
