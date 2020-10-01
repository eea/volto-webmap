import React from 'react';
import { loadModules } from 'esri-loader';
import { connect } from 'react-redux';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

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
  console.log('webmap props', props);
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
      loadModules(MODULES, options).then((modules) => {
        const [Map, MapView, FeatureLayer, MapImageLayer] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
        });
      });
    }
  }, [setModules, options]);

  // return <div>Map</div>;

  // const layer_url = layer ? `${map_service_url}/${layer}` : null;
  //
  // const initial_map_filter_query = React.useRef(
  //   map_filters ? filterToWhereParams(map_filters) : null,
  // );

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

    console.log('layers', layers);
    view.whenLayerView(layers[0]).then((layerView) => {
      layerView.watch('updating', (val) => {
        setMapIsUpdating(true);
        // layerView.queryExtent().then((results) => {
        //   console.log('results', results);
        //   if (results.count > 0) {
        //     setMapIsUpdating(false);
        //     view.goTo(results.extent);
        //   }
        // });
      });
      // if (initial_map_filter_query.current) {
      //   layerView.filter = {
      //     where: initial_map_filter_query.current,
      //   };
      // }
    });
    return { view, map };
  }, [modules, base_layer, map_layers]);

  // const currentLayerView = esri.view?.layerViews?.items?.[0];
  // React.useEffect(() => {
  //   if (!currentLayerView) return;
  //
  //   if (currentLayerView && map_filters) {
  //     currentLayerView.filter = {
  //       where: filterToWhereParams(map_filters),
  //     };
  //   }
  // }, [currentLayerView, layer, map_filters]);
  //
  return (
    <div>
      <div>{mapIsUpdating ? 'Waiting for map server...' : ''}</div>
      <div ref={mapRef} className="esri-map"></div>
    </div>
  );
};

export default Webmap;

// export default connect(
//   (state, props) => {
//     const subrequests = state.content.subrequests;
//
//     const { map_layers = [] } = props;
//     // const map_service_infos = {};
//     const map_layer_infos = {};
//
//     // Request info for the map service
//     map_layers.forEach(({ map_service_url, layer = null }) => {
//       // map_service_infos[map_service_url] = subrequests[map_service_url]?.data;
//       const layer_url = layer !== null ? `${map_service_url}/${layer}` : null;
//       const layer_info = layer_url ? subrequests[layer_url]?.data : null;
//       map_layer_infos[layer_url] = layer_info;
//     });
//
//     return {
//       subrequests,
//       // map_service_infos,
//       map_layer_infos,
//     };
//   },
//   { getProxiedExternalContent },
// )(Webmap);

// service_info: subrequests[map_service_url]?.data,
// layer_info: layer_url ? subrequests[layer_url]?.data : null,
// map_filters, map_service_url, layer,
// map_filters={map_filters}
// map_service_url={map_service_url}
// layer={layer}
//
// const { data = {} } = props;
// const { map_service_url, layer } = data || {};
// const layer_url = map_service_url ? `${map_service_url}/${layer}` : null;
