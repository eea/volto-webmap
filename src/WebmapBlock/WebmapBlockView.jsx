import React from 'react';
import { Style } from '@plone/volto/components';
import { PrivacyProtection } from '@eeacms/volto-embed';
import Webmap from './../Webmap';

import './styles.css';

const WebmapBlockView = ({ data = {}, ...rest }) => {
  const { base_layer, map_layers = [] } = data;
  return (
    <Style data={data}>
      <PrivacyProtection data={data}>
        <Webmap data={{ base_layer, map_layers }} />
      </PrivacyProtection>
    </Style>
  );
};

export default WebmapBlockView;
