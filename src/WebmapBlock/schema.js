export const MapFiltersSchema = () => ({
  title: 'Map filters',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [],
    },
  ],
  properties: {},
  required: [],
});

export const MapLayerSchema = () => ({
  title: 'Map Layer',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['map_service_url', 'layer'],
    },
  ],
  properties: {
    map_service_url: {
      title: 'Map service URL',
      widget: 'confirm_url',
      description: 'Enter a map service URL and confirm with Enter key',
    },
    layer: {
      title: 'Map layer',
      // widget: 'bise_select',
      choices: [],
    },
  },
  required: [],
});

export const MapSchema = () => ({
  title: 'ESRI Layer Map',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['base_layer', 'map_layers', 'align'],
    },
  ],

  properties: {
    base_layer: {
      title: 'Base topographic layer',
      choices: [
        'dark-gray',
        'dark-gray-vector',
        'gray',
        'gray-vector',
        'hybrid',
        'national-geographic',
        'oceans',
        'osm',
        'satellite',
        'streets',
        'streets-navigation-vector',
        'streets-night-vector',
        'streets-relief-vector',
        'streets-vector',
        'terrain',
        'topo',
        'topo-vector',
      ].map((n) => [n, n]),
    },
    map_layers: {
      title: 'Map layers',
      schema: MapLayerSchema(),
      widget: 'object_list_inline',
    },
    align: {
      widget: 'align',
      title: 'Alignment',
    },
  },

  required: ['base_layer'],
});
