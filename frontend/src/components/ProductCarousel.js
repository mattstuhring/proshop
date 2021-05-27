import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';

class ProductCarousel extends Component {
  componentDidMount() {
    this.props.listTopProducts();
  }

  render() {
    const { loading, error, products } = this.props;
    return loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <Carousel pause='hover' className='bg-dark'>
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption className='carousel-caption'>
                <h4>
                  {product.name} (${product.price})
                </h4>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.productTopRated.products,
  loading: state.productTopRated.loading,
  error: state.productTopRated.error
});

export default connect(mapStateToProps, { listTopProducts })(ProductCarousel);
