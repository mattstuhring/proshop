import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  componentDidMount() {
    if (this.props.userInfo) {
      this.props.history.push('/');
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.login(this.state.email, this.state.password, this.props.history);
  };

  render() {
    const { email, password } = this.state;
    const { loading, error } = this.props;

    let redirect = this.props.userInfo ? '/' : '/register';

    return (
      <Container>
        <Row className='justify-content-md-center'>
          <Col xs={12} md={6}>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={this.onSubmit}>
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

              <Button type='submit' variant='primary'>
                Submit
              </Button>
            </Form>

            <Row className='py-3'>
              <Col>
                New Customer? <Link to={redirect}>Register</Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  loading: state.userLogin.loading,
  error: state.userLogin.error
});

export default connect(mapStateToProps, { login })(LoginScreen);
