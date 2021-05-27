import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import store from '../store';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../actions/types';

class ProductEditScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: 0,
      image: '',
      brand: '',
      countInStock: 0,
      category: '',
      description: '',
      uploading: false
    };
  }

  componentDidMount() {
    this.props.listProductDetails(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    const { product, successUpdate } = this.props;

    if (prevProps.product !== product) {
      this.setState({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        countInStock: product.countInStock,
        category: product.category,
        description: product.description
      });
    }

    if (successUpdate) {
      store.dispatch({ type: PRODUCT_UPDATE_RESET });

      this.props.history.push('/admin/productlist');
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

  handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    this.setState({
      uploading: true
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const { data } = await axios.post('/api/v1/upload', formData, config);

      this.setState({
        image: data,
        uploading: false
      });
    } catch (err) {
      console.error(err);
      this.setState({
        uploading: false
      });
    }
  };

  onSubmit = (event) => {
    event.preventDefault();

    this.props.updateProduct({
      _id: this.props.match.params.id,
      name: this.state.name,
      price: this.state.price,
      image: this.state.image,
      brand: this.state.brand,
      category: this.state.category,
      description: this.state.description,
      countInStock: this.state.countInStock
    });
  };

  render() {
    const {
      name,
      price,
      image,
      brand,
      countInStock,
      category,
      description,
      uploading
    } = this.state;
    const { loading, error, loadingUpdate, errorUpdate } = this.props;

    return (
      <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
          Go Back
        </Link>
        <Container>
          <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
              <h1>Edit Product</h1>
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
                  <Form.Group controlId='price'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder='Enter price'
                      name='price'
                      value={price}
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='image'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter image URL'
                      name='image'
                      value={image}
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.File
                    id='image-file'
                    label='Choose File'
                    custom
                    onChange={this.handleFileUpload}
                  >
                    {uploading && <Loader />}
                  </Form.File>
                  <Form.Group controlId='brand'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter brand'
                      name='brand'
                      value={brand}
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='countInStock'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder='Enter count in stock'
                      name='countInStock'
                      value={countInStock}
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='category'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter category'
                      name='category'
                      value={category}
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter description'
                      name='description'
                      value={description}
                      onChange={this.onChange}
                    ></Form.Control>
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
  product: state.productDetails.product,
  loading: state.productDetails.loading,
  error: state.productDetails.error,
  loadingProduct: state.productUpdate.loading,
  loadingError: state.productUpdate.error,
  successUpdate: state.productUpdate.success
});

export default connect(mapStateToProps, { listProductDetails, updateProduct })(
  ProductEditScreen
);
