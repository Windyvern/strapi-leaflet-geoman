import { prefixPluginTranslations } from "@strapi/strapi/admin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import getTrad from "./utils/getTrad";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import generateStyles from "./utils/generate-styles";

const name = pluginPkg.strapi.displayName;

export default {
  register(app: any) {
    app.addSettingsLink("global", {
      id: `${pluginId}-link-label`,
      intlLabel: {
        id: getTrad("settings.link-label"),
        defaultMessage: "Configuration",
      },
      to: `/settings/${pluginId}`,
      Component: async () => import("./pages/Settings"),
      permissions: [{ action: `plugin::${pluginId}.config`, subject: null }],
    });

    app.addFields([
      {
        name: "geojson",
        pluginId,
        type: "json",
        intlLabel: {
          id: getTrad("input.label"),
          defaultMessage: name,
        },
        intlDescription: {
          id: getTrad("input.description"),
          defaultMessage: "Draw/pick your location",
        },
        icon: PluginIcon,
        components: {
          Input: async () => import("./components/Input"),
        },
        options: {
          advanced: [
            {
              name: "optionsLatitude",
              type: "string",
              intlLabel: {
                id: getTrad("attribute.item.defaultLat"),
                defaultMessage: "Default latitude",
              },
            },
            {
              name: "optionsLongitude",
              type: "string",
              intlLabel: {
                id: getTrad("attribute.item.defaultLng"),
                defaultMessage: "Default longitude",
              },
            },
            {
              name: "optionsZoom",
              type: "number",
              intlLabel: {
                id: getTrad("attribute.item.defaultZoom"),
                defaultMessage: "Default Zoom Level",
              },
            },
            {
              name: "optionsTileURL",
              type: "string",
              intlLabel: {
                id: getTrad("attribute.item.defaultTileURL"),
                defaultMessage: "Tile URL",
              },
            },
            {
              name: "optionsTileAttribution",
              type: "string",
              intlLabel: {
                id: getTrad("attribute.item.defaultTileAttribution"),
                defaultMessage: "Tile Attribution",
              },
            },
            {
              name: "optionsTileAccessToken",
              type: "string",
              intlLabel: {
                id: getTrad("attribute.item.defaultTileAccessToken"),
                defaultMessage: "Tile Access Token",
              },
            },
            {
              sectionTitle: {
                id: "global.settings",
                defaultMessage: "Settings",
              },
              items: [
                {
                  name: "required",
                  type: "checkbox",
                  intlLabel: {
                    id: "form.attribute.item.requiredField",
                    defaultMessage: "Required field",
                  },
                  description: {
                    id: "form.attribute.item.requiredField.description",
                    defaultMessage:
                      "You won't be able to create an entry if this field is empty",
                  },
                },
              ],
            },
          ],
        },
      },
    ]);

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: true,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {
    generateStyles();
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
