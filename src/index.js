import globeSVG from '@plone/volto/icons/globe.svg';
import { WebmapBlockEdit, WebmapBlockView } from './WebmapBlock';

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
  // config.widgets.widget.bise_select = SelectWidget;
  return config;
};
