/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { resolve } from 'path';
import { i18n } from '@kbn/i18n';

import { initServer } from './server';
import mappings from './mappings.json';

export function graph(kibana) {
  return new kibana.Plugin({
    id: 'graph',
    configPrefix: 'xpack.graph',
    publicDir: resolve(__dirname, 'public'),
    require: ['kibana', 'elasticsearch', 'xpack_main'],
    uiExports: {
      app: {
        title: 'Graph',
        order: 9000,
        icon: 'plugins/graph/icon.png',
        euiIconType: 'graphApp',
        description: 'Graph exploration',
        main: 'plugins/graph/app',
      },
      styleSheetPaths: resolve(__dirname, 'public/index.scss'),
      hacks: ['plugins/graph/hacks/toggle_app_link_in_nav'],
      home: ['plugins/graph/register_feature'],
      mappings
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        canEditDrillDownUrls: Joi.boolean().default(true),
        savePolicy: Joi.string().valid(['config', 'configAndDataWithConsent', 'configAndData', 'none']).default('configAndData'),
      }).default();
    },

    init(server) {
      server.injectUiAppVars('graph', () => {
        const config = server.config();
        return {
          esApiVersion: config.get('elasticsearch.apiVersion'),
          esShardTimeout: config.get('elasticsearch.shardTimeout'),
          graphSavePolicy: config.get('xpack.graph.savePolicy'),
          canEditDrillDownUrls: config.get('xpack.graph.canEditDrillDownUrls')
        };
      });

      server.plugins.xpack_main.registerFeature({
        id: 'graph',
        name: i18n.translate('xpack.graph.featureRegistry.graphFeatureName', {
          defaultMessage: 'Graph',
        }),
        icon: 'graphApp',
        navLinkId: 'graph',
        catalogue: ['graph'],
        privileges: {
          all: {
            app: ['graph', 'kibana'],
            savedObject: {
              all: ['graph-workspace'],
              read: ['config', 'index-pattern'],
            },
            ui: [],
          },
          read: {
            app: ['graph', 'kibana'],
            savedObject: {
              all: [],
              read: ['config', 'index-pattern', 'graph-workspace'],
            },
            ui: [],
          }
        }
      });

      initServer(server);
    },
  });
}
