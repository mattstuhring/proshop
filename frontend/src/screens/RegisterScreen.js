import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    const redirect = this.props.location.search
      ? this.props.location.search.split('=')[1]
      : '/';

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: null,
      redirect
    };
  }

  componentDidMount() {
    if (this.props.userInfo) {
      this.props.history.push(this.state.redirect);
    }
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({
        message: 'Passwords do not match'
      });
    } else {
      this.props.register(name, email, password, this.props.history);
      this.setState({
        message: null
      });
    }
  };

  render() {
    const {
      name,
      email,
      password,
      confirmPassword,
      redirect,
      message
    } = this.state;
    const { loading, error } = this.props;

    return (
      <Container>
        <Row className='justify-content-md-center'>
          <Col xs={12} md={6}>
            <h1>Sign Up</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
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
                Register
              </Button>
            </Form>

            <Row className='py-3'>
              <Col>
                Have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                  Login
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userLogin.userInfo,
  loading: state.userRegister.loading,
  error: state.userRegister.error
});

export default connect(mapStateToProps, { register })(RegisterScreen);
