import axios from "axios";
import { Credential } from "./types/credential"; // Adjust these imports based on your actual file structure
import { Source } from "./types/source"; // Adjust these imports based on your actual file structure
import { sendAlert } from "./alerts";
import logger from "./logger";
import { moveStringToFront } from "./util/array";
import { Setting } from "./types/setting";
import { writeConfigFile } from "./config";

/**
 * Process a single source setting which includes a source URL and multiple credentials.
 */
const processSingleSource = async (setting: Setting): Promise<boolean> => {
  const providerData = await axios.get(setting.source);
  //   logger.info(providerData.data);
  //   logger.info(setting.source);

  const su = providerData.data.su.split(",");
  let updatedSource: boolean = false;

  for (const credential of setting.credentials) {
    let foundEndpoint: string = "";

    // Move the current endpoint to the front of the array if it's in there, so we can just check that one first
    const orderedSu = moveStringToFront(su, credential.endpoint);

    // Loop through the source URLs
    for (const sourceUrl of orderedSu) {
      const urlToCheck = `${sourceUrl}/player_api.php?username=${encodeURIComponent(
        credential.username
      )}&password=${encodeURIComponent(credential.password)}`;
      logger.debug(
        `Attempt to use ${urlToCheck} with ${credential.username} for ${credential.name}`
      );

      // Make the request
      try {
        const response = await axios.get(urlToCheck);
        logger.debug(`Response for ${urlToCheck} is ${response.status}`);

        if (
          response.data.user_info &&
          response.data.user_info.status === "Active"
        ) {
          logger.debug(
            `Login successful for ${credential.username} at ${sourceUrl}`
          );
          foundEndpoint = sourceUrl;
          logger.info(`Endpoint is ${foundEndpoint} for ${credential.name}`);
          break;
        }
      } catch (error) {
        // We treat an error here as no auth, as different providers return different errors
        // So we do nothing, and just carry on
      }
    }

    // Have we found an endpoint and is it different to the existing endpoint?
    if (foundEndpoint.length > 0 && foundEndpoint !== credential.endpoint) {
      logger.info(
        `Found new endpoint ${foundEndpoint} for ${credential.name} at ${setting.source}`
      );
      await sendAlert(
        `Found new endpoint ${foundEndpoint} for ${credential.name} at ${setting.source}`
      );

      updatedSource = true;

      // Update the endpoint and endpoint history
      if (credential.endpoint)
        credential.endpointHistory.push(credential.endpoint);
      credential.endpoint = foundEndpoint;
    } else if (foundEndpoint.length === 0 && credential.endpoint.length > 0) {
      logger.info(
        `No endpoint available found for ${credential.name} at ${setting.source}`
      );
      await sendAlert(
        `No endpoint available found for ${credential.name} at ${setting.source}`
      );
      credential.endpointHistory.push(credential.endpoint);
      credential.endpoint = "";
      updatedSource = true;
    }
  }

  return updatedSource;
};

/**
 * Processes an array of SourceSetting objects.
 * Each SourceSetting includes a source URL and associated credentials.
 */
export const processUrls = async (settings: Setting[]): Promise<boolean> => {
  let anySettingUpdated = false;
  for (const setting of settings) {
    const result: boolean = await processSingleSource(setting);

    // If any of the settings were updated, we need to return that
    if (result) anySettingUpdated = true;
  }
  return anySettingUpdated;
};

// Additional helper functions or logic can be added here as needed
