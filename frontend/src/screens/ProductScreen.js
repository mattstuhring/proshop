import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form
} from 'react-bootstrap';
import store from '../store';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import {
  listProductDetails,
  createProductReview
} from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../actions/types';

class ProductScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qty: 1,
      rating: 0,
      comment: '',
      reviews: []
    };
  }

  componentDidMount() {
    this.props.listProductDetails(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.successReview) {
      alert('Review submitted!');

      this.setState({
        rating: 0,
        comment: ''
      });

      store.dispatch({
        type: PRODUCT_CREATE_REVIEW_RESET
      });

      this.props.listProductDetails(this.props.match.params.id);
    }

    if (
      prevProps.productDetails.product.reviews !==
      this.props.productDetails.product.reviews
    ) {
      this.setState({
        reviews: this.props.productDetails.product.reviews
      });
    }
  }

  handleAddToCart = () => {
    this.props.history.push(
      `/cart/${this.props.match.params.id}/?qty=${this.state.qty}`
    );
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.createProductReview(this.props.match.params.id, {
      rating: this.state.rating,
      comment: this.state.comment
    });
  };

  render() {
    const { product, loading, error } = this.props.productDetails;
    const { userInfo, errorReview } = this.props;
    const { qty, rating, comment, reviews } = this.state;

    return (
      <>
        <Link className='btn btn-light my-3' to='/'>
          Go Back
        </Link>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <Meta title={product.name} />
            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid></Image>
              </Col>
              <Col md={3}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>${product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty:</Col>
                          <Col>
                            <Form.Control
                              as='select'
                              className='qty-select-dropdown'
                              name='qty'
                              value={qty}
                              onChange={this.onChange}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                      <Button
                        onClick={this.handleAddToCart}
                        className='btn-block'
                        type='button'
                        disabled={product.countInStock === 0}
                      >
                        Add to Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h2>Reviews</h2>
                {reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant='flush'>
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {errorReview && (
                      <Message variant='danger'>{errorReview}</Message>
                    )}
                    {userInfo ? (
                      <Form onSubmit={this.onSubmit}>
                        <Form.Group controlId='rating'>
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as='select'
                            value={rating}
                            name='rating'
                            onChange={this.onChange}
                          >
                            <option value=''>Select...</option>
                            <option value='1'>1 - Poor</option>
                            <option value='2'>2 - Fair</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Very Good</option>
                            <option value='5'>5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as='textarea'
                            row='3'
                            value={comment}
                            name='comment'
                            onChange={this.onChange}
                          ></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary'>
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to='/login'>sign in</Link> to write a
                        review.
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  productDetails: state.productDetails,
  loading: state.productDetails.loading,
  error: state.productDetails.error,
  errorReview: state.productCreateReview.error,
  successReview: state.productCreateReview.success
});

export default connect(mapStateToProps, {
  listProductDetails,
  createProductReview
})(ProductScreen);
