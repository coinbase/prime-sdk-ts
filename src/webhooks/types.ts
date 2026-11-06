/**
 * Copyright 2026-present Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Expand } from '../shared/brand';
import {
  CreateWebhookSubscriptionRequest as CreateWebhookSubscriptionBody,
  CreateWebhookSubscriptionResponse as internalCreateWebhookSubscriptionResponse,
  GetWebhookDeliveryAttemptsResponse as internalGetWebhookDeliveryAttemptsResponse,
  GetWebhookDeliveryLogsResponse as internalGetWebhookDeliveryLogsResponse,
  GetWebhookEventTypesResponse as internalGetWebhookEventTypesResponse,
  GetWebhookOwnerStatsResponse as internalGetWebhookOwnerStatsResponse,
  GetWebhookSubscriptionResponse as internalGetWebhookSubscriptionResponse,
  GetWebhookSubscriptionStatsResponse as internalGetWebhookSubscriptionStatsResponse,
  ListWebhookSubscriptionsResponse as internalListWebhookSubscriptionsResponse,
  ReplayWebhookEventRequest as ReplayWebhookEventBody,
  ReplayWebhookEventResponse as internalReplayWebhookEventResponse,
  RotateWebhookHMACSecretRequest as RotateWebhookHMACSecretBody,
  RotateWebhookHMACSecretResponse as internalRotateWebhookHMACSecretResponse,
  SendWebhookSimulationRequest as SendWebhookSimulationBody,
  SendWebhookSimulationResponse as internalSendWebhookSimulationResponse,
  UpdateWebhookSubscriptionRequest as UpdateWebhookSubscriptionBody,
  UpdateWebhookSubscriptionResponse as internalUpdateWebhookSubscriptionResponse,
  WebhookDeliveryLogEntry,
  WebhookSubscription,
} from '../model/';
import { WebhookDeliveryStatus } from '../model/enums/WebhookDeliveryStatus';
import {
  PaginatedListResponse,
  BasePaginatedRequest,
} from '../shared/paginatedResponse';

/**
 * Aggregation window for webhook delivery statistics.
 */
export type WebhookStatsPeriod =
  | 'WEBHOOK_STATS_PERIOD_24H'
  | 'WEBHOOK_STATS_PERIOD_7D'
  | 'WEBHOOK_STATS_PERIOD_30D';

export type ListWebhookSubscriptionsRequest = {
  portfolioId: string;
  includeDisabled?: boolean;
  eventTypeFilter?: string;
  cursor?: string;
};

export type ListWebhookSubscriptionsResponse = PaginatedListResponse<
  // `hasNext` is replaced by the pagination helper method of the same name.
  Omit<internalListWebhookSubscriptionsResponse, 'hasNext'>,
  ListWebhookSubscriptionsRequest & BasePaginatedRequest,
  WebhookSubscription
>;

export type CreateWebhookSubscriptionRequest = Expand<
  CreateWebhookSubscriptionBody & { portfolioId: string }
>;

export type CreateWebhookSubscriptionResponse =
  Expand<internalCreateWebhookSubscriptionResponse>;

export type GetWebhookSubscriptionRequest = {
  portfolioId: string;
  subscriptionId: string;
};

export type GetWebhookSubscriptionResponse =
  Expand<internalGetWebhookSubscriptionResponse>;

/**
 * Field mask selecting which fields an update applies to.
 *
 * The Prime API decodes `updateMask` as an object with a `paths` array of
 * snake_case field names (not the comma-separated string shown in the OpenAPI
 * spec). Supported paths: `event_types`, `target_url`, `auth_type`,
 * `oauth_config`, `custom_headers`, `description`, `is_enabled`.
 */
export type WebhookUpdateMask = {
  paths: string[];
};

export type UpdateWebhookSubscriptionRequest = Expand<
  Omit<UpdateWebhookSubscriptionBody, 'updateMask'> & {
    portfolioId: string;
    subscriptionId: string;
    /**
     * Fields to update. Pass `{ paths: ['target_url'] }`. A comma-separated
     * string (e.g. `'targetUrl,isEnabled'`) is also accepted and converted to
     * the object form with snake_case paths.
     */
    updateMask?: WebhookUpdateMask | string;
  }
>;

export type UpdateWebhookSubscriptionResponse =
  Expand<internalUpdateWebhookSubscriptionResponse>;

export type DeleteWebhookSubscriptionRequest = {
  portfolioId: string;
  subscriptionId: string;
};

/**
 * The delete endpoint returns an empty object on success
 * (`DeleteWebhookSubscriptionResponse` has no fields in the spec).
 */
export type DeleteWebhookSubscriptionResponse = Record<string, never>;

export type RotateWebhookHMACSecretRequest = Expand<
  RotateWebhookHMACSecretBody & {
    portfolioId: string;
    subscriptionId: string;
  }
>;

export type RotateWebhookHMACSecretResponse =
  Expand<internalRotateWebhookHMACSecretResponse>;

export type SendWebhookSimulationRequest = Expand<
  SendWebhookSimulationBody & {
    portfolioId: string;
    subscriptionId: string;
  }
>;

export type SendWebhookSimulationResponse =
  Expand<internalSendWebhookSimulationResponse>;

export type GetWebhookEventTypesRequest = Record<string, never>;

export type GetWebhookEventTypesResponse =
  Expand<internalGetWebhookEventTypesResponse>;

export type GetWebhookDeliveryLogsRequest = {
  portfolioId: string;
  subscriptionId: string;
  statusFilter?: WebhookDeliveryStatus;
  eventTypeFilter?: string;
  cursor?: string;
};

export type GetWebhookDeliveryLogsResponse = PaginatedListResponse<
  Omit<internalGetWebhookDeliveryLogsResponse, 'hasNext'>,
  GetWebhookDeliveryLogsRequest & BasePaginatedRequest,
  WebhookDeliveryLogEntry
>;

export type GetWebhookDeliveryAttemptsRequest = {
  portfolioId: string;
  subscriptionId: string;
  eventId: string;
};

export type GetWebhookDeliveryAttemptsResponse =
  Expand<internalGetWebhookDeliveryAttemptsResponse>;

export type GetWebhookSubscriptionStatsRequest = {
  portfolioId: string;
  subscriptionId: string;
  period?: WebhookStatsPeriod;
};

export type GetWebhookSubscriptionStatsResponse =
  Expand<internalGetWebhookSubscriptionStatsResponse>;

export type GetWebhookOwnerStatsRequest = {
  portfolioId: string;
  period?: WebhookStatsPeriod;
};

export type GetWebhookOwnerStatsResponse =
  Expand<internalGetWebhookOwnerStatsResponse>;

export type ReplayWebhookEventRequest = Expand<
  ReplayWebhookEventBody & {
    portfolioId: string;
    eventId: string;
  }
>;

export type ReplayWebhookEventResponse =
  Expand<internalReplayWebhookEventResponse>;

/* GENERATED-METHOD-ERRORS-START */
export type {
  CreateWebhookSubscriptionError,
  DeleteWebhookSubscriptionError,
  GetWebhookDeliveryAttemptsError,
  GetWebhookDeliveryLogsError,
  GetWebhookEventTypesError,
  GetWebhookOwnerStatsError,
  GetWebhookSubscriptionError,
  GetWebhookSubscriptionStatsError,
  ListWebhookSubscriptionsError,
  ReplayWebhookEventError,
  RotateWebhookHmacSecretError,
  SendWebhookSimulationError,
  UpdateWebhookSubscriptionError,
} from '../model/errors/methodErrors';
/* GENERATED-METHOD-ERRORS-END */
