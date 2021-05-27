import React, { Component } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

class PaymentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentMethod: 'PayPal'
    };
  }

  componentDidMount() {
    if (!this.props.shippingAddress) {
      this.props.history.push('/shipping');
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { paymentMethod } = this.state;

    this.props.savePaymentMethod(paymentMethod);
    this.props.history.push('/placeorder');
  };

  render() {
    const { paymentMethod } = this.state;

    return (
      <Container>
        <CheckoutSteps step1 step2 step3 />
        <Row className='justify-content-md-center'>
          <Col xs={12} md={6}>
            <h1>Payment Method</h1>

            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                  <Form.Check
                    type='radio'
                    label='PayPal or Credit Card'
                    id='PayPal'
                    name='paymentMethod'
                    value={paymentMethod}
                    onChange={this.onChange}
                  ></Form.Check>
                </Col>
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

export default connect(mapStateToProps, { savePaymentMethod })(PaymentScreen);
