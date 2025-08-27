/*
 *
 * SettingsPage
 *
 */

import pluginId from "../../pluginId";
import { CheckPermissions } from "@strapi/strapi/admin";
import Settings from "../../components/Settings";

const permissions = [{ action: `plugin::${pluginId}.config`, subject: null }];

const SettingsPage = () => {
  return (
    <CheckPermissions permissions={permissions}>
      <Settings />
    </CheckPermissions>
  );
};

export default SettingsPage;
