import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class Meta extends Component {
  render() {
    const { title, description, keywords } = this.props;

    return (
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keyword' content={keywords} />
      </Helmet>
    );
  }
}

Meta.defaultProps = {
  title: 'Welcome to ProShop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electronics'
};

export default Meta;
