/* eslint-disable */
import { Component } from 'react';

import { MapSchema } from './schema';
import withMapLayers from './withMapLayers';

class SchemaProvider extends Component {
  render() {
    return this.props.children(MapSchema());
  }
}

export default withMapLayers(SchemaProvider);
