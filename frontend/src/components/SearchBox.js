import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: ''
    };
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.keyword.trim()) {
      this.props.history.push(`/search/${this.state.keyword}`);
    } else {
      this.props.history.push('/');
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} inline>
        <Form.Control
          type='text'
          name='keyword'
          value={this.state.keyword}
          onChange={this.onChange}
          placeholder='Search Products...'
          className='mr-sm-2 ml-sm-5'
        ></Form.Control>
        <Button type='submit' variant='outline-success' className='p-2'>
          Search
        </Button>
      </Form>
    );
  }
}

export default SearchBox;
