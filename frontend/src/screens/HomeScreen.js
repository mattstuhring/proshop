import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';
import ProductCarousel from '../components/ProductCarousel';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      pages: 1,
      page: 1
    };
  }

  componentDidMount() {
    const { keyword } = this.props.match.params;
    const pageNumber = this.props.match.params.pageNumber || 1;
    this.props.listProducts(keyword, pageNumber);
  }

  componentDidUpdate(prevProps, prevState) {
    const { keyword, pageNumber } = this.props.match.params;

    if (prevProps.products !== this.props.products) {
      this.setState({
        products: this.props.products,
        pages: this.props.pages,
        page: this.props.page
      });
    }

    if (
      prevProps.match.params.keyword !== keyword ||
      prevProps.match.params.pageNumber !== pageNumber
    ) {
      this.props.listProducts(keyword, pageNumber);
      this.setState({
        products: this.props.products,
        pages: this.props.pages,
        page: this.props.page
      });
    }
  }

  render() {
    const { loading, error } = this.props;
    const { keyword } = this.props.match.params;
    const { products, pages, page } = this.state;

    return (
      <>
        <Meta />
        {!keyword ? (
          <ProductCarousel />
        ) : (
          <Link to='/' className='btn btn-light'>
            Go Back
          </Link>
        )}
        <h1>Latest Products</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <Row>
              {products.map((product) => {
                return (
                  <Col key={product._id} sm={12} md={6} lg={4}>
                    <Product product={product} />
                  </Col>
                );
              })}
            </Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            />
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.productList.products,
  pages: state.productList.pages,
  page: state.productList.page,
  loading: state.productList.loading,
  error: state.productList.error
});

export default connect(mapStateToProps, { listProducts })(HomeScreen);
