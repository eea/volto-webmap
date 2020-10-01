import { Component } from 'react';
import { connect } from 'react-redux';

import { MapSchema, MapFiltersSchema } from './schema';
// import { addPrivacyProtectionToSchema } from 'volto-embed';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import withMapLayers from './withMapLayers';

class SchemaProvider extends Component {
  deriveSchemaFromProps = () => {
    const schema = MapSchema();

    // console.log('props', this.props);

    // const mapFiltersSchema = MapFiltersSchema();

    // const choices = (this.props.service_info?.layers || []).map((l) => [
    //   l.id.toString(),
    //   l.name,
    // ]);
    // schema.properties.layer.choices = choices;
    //
    // const uniqueValues = (
    //   this.props.layer_info?.drawingInfo?.renderer?.uniqueValueInfos || []
    // ).map((s) => [s.value.toString(), s.label]);
    //
    // const fields = (this.props.layer_info?.fields || []).filter(
    //   (f) => f.type === 'esriFieldTypeString',
    // );
    //
    // const fieldset = {
    //   id: 'filters',
    //   title: 'Map filters',
    //   fields: ['map_filters'],
    // };
    // schema.fieldsets.push(fieldset);
    // schema.properties.map_filters = {
    //   title: 'Map filters',
    //   widget: 'object',
    //   schema: mapFiltersSchema,
    // };
    //
    // mapFiltersSchema.fieldsets[0].fields = [...fields.map(({ name }) => name)];
    //
    // fields.forEach(({ name }) => {
    //   mapFiltersSchema.properties[name] = {
    //     title: name,
    //     choices: uniqueValues,
    //   };
    // });
    return schema;
  };

  render() {
    return this.props.children(this.deriveSchemaFromProps());
    // const schema = addPrivacyProtectionToSchema(this.deriveSchemaFromProps());
    // return this.props.children(schema);
  }
}

export default withMapLayers(SchemaProvider);
// export default connect(
//   (state, props) => {
//     const { subrequests } = state.content;
//     // console.log('subrequests', subrequests);
//     const { data = {} } = props;
//
//     const map_service_infos = {};
//     const map_layer_infos = {};
//
//     const { map_layers = [] } = { data };
//
//     // Request info for the map service
//     map_layers.forEach(({ map_service_url, layer = null }) => {
//       map_service_infos[map_service_url] = subrequests[map_service_url]?.data;
//       const layer_url = layer !== null ? `${map_service_url}/${layer}` : null;
//       const layer_info = layer_url ? subrequests[layer_url]?.data : null;
//       map_layer_infos[layer_url] = layer_info;
//     });
//
//     return {
//       subrequests,
//       map_service_infos,
//       map_layer_infos,
//     };
//   },
//   { getProxiedExternalContent },
// )(withMapLayers(SchemaProvider));
//
// componentDidMount() {
//   this.refresh();
// }
// componentDidUpdate() {
//   this.refresh();
// }
//
// refresh = () => {
//   const {
//     data = {},
//     subrequests,
//     map_service_infos,
//     map_layer_infos,
//   } = this.props;
//
//   const { map_layers = [] } = data;
//
//   // Request info for the map service
//   map_layers.forEach(({ map_service_url, layer = null }) => {
//     map_service_infos[map_service_url] = subrequests[map_service_url]?.data;
//     if (
//       !map_service_infos[map_service_url] &&
//       !subrequests[map_service_url]
//     ) {
//       this.props.getProxiedExternalContent(
//         `${map_service_url}?f=json`,
//         null,
//         map_service_url,
//       );
//     }
//     const layer_url = layer !== null ? `${map_service_url}/${layer}` : null;
//     const layer_info = layer_url ? subrequests[layer_url]?.data : null;
//     map_layer_infos[layer_url] = layer_info;
//     if (layer_url && !layer_info && !subrequests[layer_url]) {
//       this.props.getProxiedExternalContent(
//         `${layer_url}?f=json`,
//         null,
//         layer_url,
//       );
//     }
//   });
// };
