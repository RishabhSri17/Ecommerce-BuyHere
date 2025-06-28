import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'BuyHere | Buy Things Online',
  description:
    'Discover a wide range of quality products at competitive prices. Enjoy fast shipping, secure payments, and exceptional customer service.',
  keywords:
    'online shopping, ecommerce, fashion, home goods, electronics, beauty, deals, discounts'
};

export default Meta;