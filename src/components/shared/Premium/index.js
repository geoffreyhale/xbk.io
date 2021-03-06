import React from 'react';
import Card from 'react-bootstrap/Card';

export const HowToGetPremium = () => (
  <>
    <h6>One Year Premium:</h6>
    <p>
      Send $30 to geoffreyhale@gmail.com via{' '}
      <a href="paypal.com" target="_blank">
        PayPal
      </a>
      .
      <ul>
        <li>"Sending to a friend"</li>
        <li>
          Add a note: "{'<'}youremail@gmail.com{'>'} premium"
        </li>
      </ul>
    </p>
  </>
);

export const PremiumSaleCard = () => {
  const premiumSaleCardVariants = [
    'success',
    'danger',
    'warning',
    'info',
    'dark',
  ];
  const randomPremiumSaleCardVariant =
    premiumSaleCardVariants[
      Math.floor(Math.random() * premiumSaleCardVariants.length)
    ];
  return (
    <Card
      className="mb-3"
      bg={randomPremiumSaleCardVariant}
      text="white"
      style={{ display: 'inline-block' }}
    >
      <Card.Body>
        <Card.Title>Premium Sale &#11088;</Card.Title>
        <h5>Features</h5>
        <ul>
          <li>View user profiles</li>
          <li>Access to premium rooms</li>
          <li>Access to Modality Trainer</li>
          <li>Access to Community Page</li>
          <li>Edit your posts</li>
          <li>Select a username</li>
          <li>Remove this ad</li>
        </ul>
        <p>
          <HowToGetPremium />
        </p>
      </Card.Body>
    </Card>
  );
};

export const PremiumFeature = ({ featureName }) => (
  <Card>
    <Card.Body>
      <Card.Title className="mb-3">Premium Feature</Card.Title>
      <p>
        {featureName ? <strong>{featureName}</strong> : 'This'} is a premium
        feature.
      </p>
      <p>
        <HowToGetPremium />
      </p>
    </Card.Body>
  </Card>
);