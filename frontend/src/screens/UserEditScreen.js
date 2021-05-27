import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import store from '../store';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../actions/types';

class UserEditScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      isAdmin: ''
    };
  }

  componentDidMount() {
    const { user, match } = this.props;

    if (!user.name || user._id !== match.params.id) {
      this.props.getUserDetails(match.params.id);
    } else {
      this.setState({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.successUpdate) {
      store.dispatch({
        type: USER_UPDATE_RESET
      });

      this.props.history.push('/admin/userlist');
    }

    if (prevProps.user !== this.props.user) {
      this.setState({
        name: this.props.user.name,
        email: this.props.user.email,
        isAdmin: this.props.user.isAdmin
      });
    }
  }

  onChange = (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    this.setState({
      [event.target.name]: value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.updateUser({
      _id: this.props.match.params.id,
      name: this.state.name,
      email: this.state.email,
      isAdmin: this.state.isAdmin
    });
  };

  render() {
    const { name, email, isAdmin } = this.state;
    const { loading, error, loadingUpdate, errorUpdate } = this.props;

    return (
      <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
          Go Back
        </Link>
        <Container>
          <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
              <h1>Edit User</h1>
              {loadingUpdate && <Loader />}
              {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger'>{error}</Message>
              ) : (
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
                  <Form.Group controlId='isadmin'>
                    <Form.Check
                      type='checkbox'
                      lable='Is Admin'
                      name='isAdmin'
                      checked={isAdmin}
                      onChange={this.onChange}
                    ></Form.Check>
                  </Form.Group>

                  <Button type='submit' variant='primary'>
                    Update
                  </Button>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  user: state.userDetails.user,
  loading: state.userDetails.loading,
  error: state.userDetails.error,
  loadingUpdate: state.userUpdate.loading,
  errorUpdate: state.userUpdate.error,
  successUpdate: state.userUpdate.success
});

export default connect(mapStateToProps, { getUserDetails, updateUser })(
  UserEditScreen
);
