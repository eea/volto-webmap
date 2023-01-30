/* eslint-disable */
import React from 'react';
import { loadModules } from 'esri-loader';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/layers/MapImageLayer',
  // 'esri/widgets/Home',
  // 'esri/geometry/Extent',
  // 'esri/views/layers/support/FeatureFilter',
];

export const filterToWhereParams = (map_filters) => {
  //  `Country_co = 'DK'`
  let acc = '';
  Object.keys(map_filters).forEach((name) => {
    if (map_filters[name]) {
      if (acc) acc += ' AND ';
      acc += `${name} = '${map_filters[name]}' `;
    }
  });

  return acc;
};

const Webmap = (props) => {
  const { data = {} } = props;
  const { base_layer, map_layers } = data;
  // map_filters, map_service_url, layer,
  const options = {
    css: true,
  };
  const mapRef = React.useRef();
  const [modules, setModules] = React.useState({});
  const [mapIsUpdating, setMapIsUpdating] = React.useState(false);
  const modules_loaded = React.useRef(false);

  // Load the ESRI JS API
  React.useEffect(() => {
    if (!modules_loaded.current) {
      modules_loaded.current = true;
      loadModules(MODULES, options).then((_modules) => {
        const [Map, MapView, FeatureLayer, MapImageLayer] = _modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
        });
      });
    }
  }, [setModules, options]);

  const esri = React.useMemo(() => {
    if (Object.keys(modules).length === 0) return {};

    const { Map, MapView, FeatureLayer, MapImageLayer } = modules;

    let layers = map_layers
      .filter(({ map_service_url, layer }) => map_service_url && layer)
      .map(({ map_service_url, layer }) => {
        const url = `${map_service_url}/${layer.id}`;

        let mapLayer;
        switch (layer.type) {
          case 'Raster Layer':
            mapLayer = new MapImageLayer({
              url: map_service_url, // uses the map service directly
            });
            break;
          case 'Feature Layer':
            mapLayer = new FeatureLayer({ url });
            break;
          default:
            break;
        }
        return mapLayer;
      });

    const map = new Map({
      basemap: base_layer || 'hybrid',
      layers,
    });
    const view = new MapView({
      container: mapRef.current,
      map,
    });

    view.whenLayerView(layers[0]).then((layerView) => {
      layerView.watch('updating', (_val) => {
        setMapIsUpdating(true);
      });
    });
    return { view, map };
  }, [modules, base_layer, map_layers]);

  return (
    <div>
      <div>{mapIsUpdating ? 'Waiting for map server...' : ''}</div>
      <div ref={mapRef} className="esri-map"></div>
    </div>
  );
};

export default Webmap;
