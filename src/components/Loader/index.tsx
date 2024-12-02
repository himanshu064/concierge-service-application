import React from 'react';
import { Flex, Spin } from 'antd';

const Loader: React.FC = () => (
  <Flex align="center" gap="middle">
    <Spin size="large" />
  </Flex>
);

export default Loader;