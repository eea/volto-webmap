/**
 * A HOC to provide map service and map layer JSON info, from the map server
 *
 *
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

function withMapLayers(WrappedComponent) {
  return (props) => {
    const { data = {} } = props;
    const { map_layers = [] } = data;

    const dispatch = useDispatch();
    const subrequests = useSelector((state) => state.content.subrequests);
    const requests = Object.assign(
      {},
      ...map_layers.map(({ map_service_url, layer }) => {
        const o = {};
        if (map_service_url) o[map_service_url] = subrequests[map_service_url];
        if (map_service_url && layer) {
          const url = `${map_service_url}/${layer.id}`;
          o[url] = subrequests[url];
        }
        return o;
      }),
    );

    React.useEffect(() => {
      map_layers.forEach(({ map_service_url, layer }) => {
        if (map_service_url && !requests[map_service_url])
          dispatch(
            getProxiedExternalContent(
              `${map_service_url}?f=json`,
              null,
              map_service_url,
            ),
          );
        if (
          map_service_url &&
          layer &&
          !requests[`${map_service_url}/${layer.id}`]
        ) {
          dispatch(
            getProxiedExternalContent(
              `${map_service_url}/${layer.id}?f=json`,
              null,
              `${map_service_url}/${layer.id}`,
            ),
          );
        }
      });
    }, [map_layers, requests, dispatch]);

    return <WrappedComponent {...props} requests={requests} />;
  };
}

export default withMapLayers;
