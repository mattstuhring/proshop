import React, { Component } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

class ShippingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    };
  }

  componentDidMount() {
    const { shippingAddress } = this.props;

    if (shippingAddress.address) {
      this.setState({
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country
      });
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { address, city, postalCode, country } = this.state;

    this.props.saveShippingAddress({ address, city, postalCode, country });
    this.props.history.push('/payment');
  };

  render() {
    const { address, city, postalCode, country } = this.state;

    return (
      <Container>
        <CheckoutSteps step1 step2 />
        <Row className='justify-content-md-center'>
          <Col xs={12} md={6}>
            <h1>Shipping</h1>

            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter address'
                  name='address'
                  value={address}
                  required
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter city'
                  name='city'
                  value={city}
                  required
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='postalCode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter postal code'
                  name='postalCode'
                  value={postalCode}
                  required
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter country'
                  name='country'
                  value={country}
                  required
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>
              <Button type='submit' variant='primary'>
                Continue
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  shippingAddress: state.cart.shippingAddress
});

export default connect(mapStateToProps, { saveShippingAddress })(
  ShippingScreen
);
