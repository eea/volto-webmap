/* eslint-disable */
import { Component } from 'react';

import { MapSchema, MapFiltersSchema } from './schema';
import withMapLayers from './withMapLayers';

class SchemaProvider extends Component {
  deriveSchemaFromProps = () => {
    return MapSchema();
  };

  render() {
    return this.props.children(this.deriveSchemaFromProps());
  }
}

export default withMapLayers(SchemaProvider);
