import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../actions/types';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: null,
      success: false
    };
  }

  componentDidMount() {
    const { user, userInfo, success } = this.props;

    if (!userInfo) {
      this.props.history.push('/login');
    } else {
      if (!user || !user.name || success) {
        store.dispatch({ type: USER_UPDATE_PROFILE_RESET });
        this.props.getUserDetails('profile');
        this.props.listMyOrders();
      } else {
        this.setState({
          name: user.name,
          email: user.email
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        name: this.props.user.name,
        email: this.props.user.email
      });
    }
  }

  componentWillUnmount() {
    this.setState({ success: false });
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({
        message: 'Passwords do not match'
      });
    } else {
      const updatedUser = {
        id: this.props.user._id,
        name,
        email,
        password
      };
      this.props.updateUserProfile(updatedUser);

      this.setState({
        success: true,
        message: null
      });
    }
  };

  render() {
    const { name, email, password, confirmPassword, message, success } =
      this.state;
    const { loading, error, loadingOrders, errorOrders, orders } = this.props;

    return (
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          {success && <Message variant='success'>Profile udpated.</Message>}
          {loading && <Loader />}
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                name='name'
                value={name}
                onChange={this.onChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                name='email'
                value={email}
                onChange={this.onChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                name='password'
                value={password}
                onChange={this.onChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={this.onChange}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        </Col>
        <Col md={9}>
          <h2>My Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant='danger'>{errorOrders}</Message>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
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
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant='light'>Details</Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  user: state.userDetails.user,
  loading: state.userDetails.loading,
  error: state.userDetails.error,
  success: state.userUpdateProfile.success,
  orders: state.orderListMy.orders,
  loadingOrders: state.orderListMy.loading,
  errorOrders: state.orderListMy.error
});

export default connect(mapStateToProps, {
  getUserDetails,
  updateUserProfile,
  listMyOrders
})(ProfileScreen);
