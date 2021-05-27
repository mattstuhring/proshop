import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import {
  listProducts,
  deleteProduct,
  createProduct
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../actions/types';

class ProductListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    store.dispatch({ type: PRODUCT_CREATE_RESET });
    const pageNumber = this.props.match.params.pageNumber || 1;
    const { userInfo, history, successCreate, createdProduct } = this.props;

    if (!userInfo.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      this.props.listProducts('', pageNumber);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { products, history, createdProduct } = this.props;
    const pageNumber = this.props.match.params.pageNumber;

    if (prevProps.products !== products) {
      this.setState({ products: products });
    }

    if (prevProps.createdProduct !== createdProduct) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    }

    if (prevProps.match.params.pageNumber !== pageNumber) {
      this.props.listProducts('', pageNumber);
    }
  }

  handleCreateProduct = () => {
    this.props.createProduct();
  };

  handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure?')) {
      this.props.deleteProduct(id);

      this.setState({
        products: this.state.products.filter((product) => product._id !== id)
      });
    }
  };

  render() {
    const {
      loading,
      error,
      pages,
      page,
      loadingDelete,
      errorDelete,
      loadingCreate,
      errorCreate
    } = this.props;
    const { products } = this.state;

    return (
      <>
        <Row className='align-items-center'>
          <Col>
            <h1>Products</h1>
          </Col>
          <Col className='text-right'>
            <Button className='my-3' onClick={this.handleCreateProduct}>
              <i className='fas fa-plus'></i> Create Product
            </Button>
          </Col>
        </Row>
        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!products
                  ? null
                  : products.map((product) => (
                      <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                          <LinkContainer
                            to={`/admin/product/${product._id}/edit`}
                          >
                            <Button variant='light' className='btn-sm'>
                              <i className='fas fa-edit'></i>
                            </Button>
                          </LinkContainer>
                          <Button
                            variant='danger'
                            className='btn-sm'
                            onClick={() =>
                              this.handleDeleteProduct(product._id)
                            }
                          >
                            <i className='fas fa-trash'></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  products: state.productList.products,
  pages: state.productList.pages,
  page: state.productList.page,
  loading: state.productList.loading,
  error: state.productList.error,
  loadingDelete: state.productDelete.loading,
  errorDelete: state.productDelete.error,
  successDelete: state.productDelete.success,
  loadingCreate: state.productCreate.loading,
  errorCreate: state.productCreate.error,
  successCreate: state.productCreate.success,
  createdProduct: state.productCreate.product
});

export default connect(mapStateToProps, {
  listProducts,
  deleteProduct,
  createProduct
})(ProductListScreen);
