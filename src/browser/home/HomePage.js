/* @flow */
import React from 'react';
import SwitchTheme from './SwitchTheme';
import {
  Box,
  Heading,
  Image,
  Link,
  PageHeader,
  Paragraph,
  Title,
  Button,
  Text,
} from '../app/components';

const HomePage = () => (
  <Box>
    <Title message="Este.js" />
    <PageHeader
      heading="Este"
      description="Starter kit for universal full–fledged React apps. One stack
        for browser, mobile, server."
    />
    <Heading size={2}>
      Heading
    </Heading>
    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </Paragraph>
    <Paragraph>
      <Link to="https://github.com/este/este">
        github.com/este/este
      </Link>
    </Paragraph>
    <Text size={0}>normal text</Text><br />
    <Text size={-1}>small text</Text><br />
    <Text size={5}>text 5</Text><br />
    <Box marginVertical={1.5}>
      <Image
        alt="50x50 placeholder"
        height={50}
        src={require('./50x50.png')}
        width={50}
      />
    </Box>
    <Box marginBottom={1}>
      {[
        'primary',
        'success',
        'warning',
        'danger',
      ].map((color, i) => (
        <Button
          backgroundColor={color}
          key={color}
          marginLeft={i && '.75em'}
        >
          {color}
        </Button>
      ))}
    </Box>
    <SwitchTheme />
  </Box>
);

export default HomePage;
