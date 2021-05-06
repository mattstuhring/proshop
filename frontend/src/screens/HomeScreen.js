import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/api/v1/products');
      this.setState({
        products: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { products } = this.state;

    return (
      <>
        <h1>Latest Products</h1>
        <Row>
          {products.map(product => {
            return (
              <Col key={product._id} sm={12} md={6} lg={4}>
                <Product product={product} />
              </Col>
            );
          })}
        </Row>
      </>
    );
  }
}

export default HomeScreen;
