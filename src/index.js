import globeSVG from '@plone/volto/icons/globe.svg';
import { WebmapBlockEdit, WebmapBlockView } from './WebmapBlock';
import MapLayerSelectWidget from './WebmapBlock/Widgets/MapLayerSelectWidget';
import ConfirmInputWidget from './Widgets/ConfirmInputWidget';

export default (config) => {
  config.blocks.blocksConfig.esriWebmap = {
    id: 'esriWebmap',
    title: 'ESRI Webmap',
    icon: globeSVG,
    group: 'common',
    view: WebmapBlockView,
    edit: WebmapBlockEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  config.widgets.widget.select_map_layer = MapLayerSelectWidget;
  config.widgets.widget.confirm_url = ConfirmInputWidget;
  return config;
};
