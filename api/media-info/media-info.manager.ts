import { AppError, CommonErrors } from '@helper/app-error';
import { InitializationMessage } from '@interfaces/initialization-message.interface';
import { MediaInfoCurlService, Track } from '@services/media-info-curl.service';
import { IconikService } from '@workflowwin/iconik-api';
import { MediaInfoUrl } from './media-info.inteface';
import { MediaInfoService } from './media-info.service';

/**
 * It's the feature manager
 * Its methods should implement some feature's functionality
 */
export class MediaInfoManager {
  private readonly service: MediaInfoService;

  constructor() {
    /**
     * The feature service should be created in the constructor of the feature manager
     * Other services should be provided in the feature manager's methods
     */
    this.service = new MediaInfoService();
  }

  async initializeMediaInfo(iconikService: IconikService): Promise<InitializationMessage> {
    try {
      return {
        message: 'MediaInfo feature is successfully initialized.',
      } as InitializationMessage;
    } catch (e) {
      console.log(e);
      throw new AppError(
        CommonErrors.InternalServerError,
        'Cannot initialize MediaInfo feature. Connect WIN Support team.'
      );
    }
  }

  /**
   * This method implements some feature's functionality
   * It should validate required data
   * It should display the main steps of the algorithm without implementation
   * All implementation should be placed in the feature service's methods
   * @param mediaInfoUrl - required data
   * @param mediaInfoCurlService - required services
   */
  getMediaInfo(mediaInfoUrl: MediaInfoUrl, mediaInfoCurlService: MediaInfoCurlService): Promise<Track> {
    /**
     * Validate required data -> Check if url exists
     */
    if (!mediaInfoUrl.url) {
      throw new AppError(CommonErrors.BadRequest, "The param 'url' is required.");
    }

    /**
     * Display the main step of the algorithm and call the feature service's method -> Return Media Info
     */
    return this.service.getMediaInfo(mediaInfoUrl.url, mediaInfoCurlService);
  }
}
