import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions';

class UserListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.isAdmin) {
      this.props.listUsers();
    } else {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.users !== this.props.users) {
      this.setState({ users: this.props.users });
    }
  }

  handleDeleteUser = (id) => {
    if (window.confirm('Are you sure?')) {
      this.props.deleteUser(id);

      this.setState({
        users: this.state.users.filter((user) => user._id !== id)
      });
    }
  };

  render() {
    const { loading, error } = this.props;
    const { users } = this.state;

    return (
      <>
        <h1>Users</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!users
                ? null
                : users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>
                        {user.isAdmin ? (
                          <i
                            className='fas fa-check'
                            style={{ color: 'green' }}
                          ></i>
                        ) : (
                          <i
                            className='fas fa-times'
                            style={{ color: 'red' }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                          <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant='danger'
                          className='btn-sm'
                          onClick={() => this.handleDeleteUser(user._id)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
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
  users: state.userList.users,
  loading: state.userList.loading,
  error: state.userList.error,
  successDelete: state.userDelete.success
});

export default connect(mapStateToProps, { listUsers, deleteUser })(
  UserListScreen
);
