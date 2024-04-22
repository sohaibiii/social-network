export const SLICE_NAME = "ads";

export interface AdsInterface {
  configs: AdsConfigs;
}

export interface AdsConfigs {
  adEnabledProperty: boolean;
  adEnabledCityCountryRegion: boolean;
  adEnabledDestinations: boolean;
  adEnabledTop20: boolean;
  adEnabledThingsToDo: boolean;
  adEnabledMoreRelatedProperties: boolean;
}

export interface Placement {
  accompanied_html: string;
  rct: string;
  has_quota: boolean;
  banner_id: string;
  tracking_pixel: string;
  image_url: string;
  body: string;
  user_frequency_views: string;
  refresh_time: string;
  target: string;
  placement_id: string;
  rcb: string;
  alt_text: string;
  impressions_remaining: number;
  width: string;
  eligible_url: string;
  viewable_url: string;
  user_frequency_expiry: string;
  redirect_url: string;
  user_frequency_start: string;
  height: number;
  refresh_url: string;
}
