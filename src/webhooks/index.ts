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
import { IPrimeApiClient, CoinbaseCallOptions, Method } from '../clients';
import { validate } from '../shared/validation';
import {
  BasePaginatedRequest,
  createPaginatedResponse,
  getDefaultPaginationOptions,
  ResponseExtractors,
} from '../shared/paginatedResponse';

import {
  ListWebhookSubscriptionsRequest,
  ListWebhookSubscriptionsResponse,
  CreateWebhookSubscriptionRequest,
  CreateWebhookSubscriptionResponse,
  GetWebhookSubscriptionRequest,
  GetWebhookSubscriptionResponse,
  UpdateWebhookSubscriptionRequest,
  UpdateWebhookSubscriptionResponse,
  DeleteWebhookSubscriptionRequest,
  DeleteWebhookSubscriptionResponse,
  RotateWebhookHMACSecretRequest,
  RotateWebhookHMACSecretResponse,
  SendWebhookSimulationRequest,
  SendWebhookSimulationResponse,
  GetWebhookEventTypesRequest,
  GetWebhookEventTypesResponse,
  GetWebhookDeliveryLogsRequest,
  GetWebhookDeliveryLogsResponse,
  GetWebhookDeliveryAttemptsRequest,
  GetWebhookDeliveryAttemptsResponse,
  GetWebhookSubscriptionStatsRequest,
  GetWebhookSubscriptionStatsResponse,
  GetWebhookOwnerStatsRequest,
  GetWebhookOwnerStatsResponse,
  ReplayWebhookEventRequest,
  ReplayWebhookEventResponse,
  WebhookUpdateMask,
} from './types';

/**
 * Converts an update mask to the `{ paths: [...] }` object the API expects.
 * Strings are split on commas and camelCase names are converted to snake_case.
 */
function normalizeUpdateMask(
  mask: WebhookUpdateMask | string | undefined
): WebhookUpdateMask | undefined {
  if (typeof mask !== 'string') {
    return mask;
  }
  return {
    paths: mask
      .split(',')
      .map((path) => path.trim())
      .filter(Boolean)
      .map((path) => path.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)),
  };
}

export interface IWebhooksService {
  /**
   * List Webhook Subscriptions
   *
   * Returns cursor-paginated webhook subscriptions for the portfolio in the URL path.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListWebhookSubscriptionsError}.
   */
  listWebhookSubscriptions(
    request: ListWebhookSubscriptionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListWebhookSubscriptionsResponse>;

  /**
   * Create Webhook Subscription
   *
   * Creates a new webhook subscription for the portfolio in the URL path. Returns the HMAC signing secret exactly once; store it securely.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link CreateWebhookSubscriptionError}.
   */
  createWebhookSubscription(
    request: CreateWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateWebhookSubscriptionResponse>;

  /**
   * Get Webhook Subscription
   *
   * Returns a single webhook subscription by ID. Auth secrets are never returned.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetWebhookSubscriptionError}.
   */
  getWebhookSubscription(
    request: GetWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookSubscriptionResponse>;

  /**
   * Update Webhook Subscription
   *
   * Applies a partial patch to a webhook subscription using FieldMask semantics.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link UpdateWebhookSubscriptionError}.
   */
  updateWebhookSubscription(
    request: UpdateWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<UpdateWebhookSubscriptionResponse>;

  /**
   * Delete Webhook Subscription
   *
   * Soft-deletes a webhook subscription. The subscription stops matching events immediately but audit history is retained.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link DeleteWebhookSubscriptionError}.
   */
  deleteWebhookSubscription(
    request: DeleteWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<DeleteWebhookSubscriptionResponse>;

  /**
   * Rotate Webhook HMAC Secret
   *
   * Issues a new HMAC signing secret for the subscription and returns the plaintext exactly once. By default the previous secret remains valid for a server-configured grace window; set revoke_previous_immediately to invalidate it at once.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link RotateWebhookHmacSecretError}.
   */
  rotateWebhookHmacSecret(
    request: RotateWebhookHMACSecretRequest,
    options?: CoinbaseCallOptions
  ): Promise<RotateWebhookHMACSecretResponse>;

  /**
   * Send Webhook Simulation
   *
   * Fires a synthetic simulation event to the subscription's endpoint for integration testing.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link SendWebhookSimulationError}.
   */
  sendWebhookSimulation(
    request: SendWebhookSimulationRequest,
    options?: CoinbaseCallOptions
  ): Promise<SendWebhookSimulationResponse>;

  /**
   * Get Webhook Event Types
   *
   * Returns the registered webhook event types available to subscribe to.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetWebhookEventTypesError}.
   */
  getWebhookEventTypes(
    request?: GetWebhookEventTypesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookEventTypesResponse>;

  /**
   * Get Webhook Delivery Logs
   *
   * Returns cursor-paginated delivery logs for a single subscription.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetWebhookDeliveryLogsError}.
   */
  getWebhookDeliveryLogs(
    request: GetWebhookDeliveryLogsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookDeliveryLogsResponse>;

  /**
   * Get Webhook Delivery Attempts
   *
   * Returns all HTTP POST attempts for a specific (event_id, subscription_id) pair.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetWebhookDeliveryAttemptsError}.
   */
  getWebhookDeliveryAttempts(
    request: GetWebhookDeliveryAttemptsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookDeliveryAttemptsResponse>;

  /**
   * Get Webhook Subscription Stats
   *
   * Returns pre-aggregated delivery statistics for a single subscription over a fixed time window.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetWebhookSubscriptionStatsError}.
   */
  getWebhookSubscriptionStats(
    request: GetWebhookSubscriptionStatsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookSubscriptionStatsResponse>;

  /**
   * Get Webhook Owner Stats
   *
   * Returns a dashboard-level rollup of delivery statistics across all subscriptions for the portfolio in the URL path.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetWebhookOwnerStatsError}.
   */
  getWebhookOwnerStats(
    request: GetWebhookOwnerStatsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookOwnerStatsResponse>;

  /**
   * Replay Webhook Event
   *
   * Replays a previously published event for the portfolio in the URL path. When subscription_id is set the event is re-delivered to that single subscription; otherwise it is re-delivered to every matching subscription owned by the path owner.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ReplayWebhookEventError}.
   */
  replayWebhookEvent(
    request: ReplayWebhookEventRequest,
    options?: CoinbaseCallOptions
  ): Promise<ReplayWebhookEventResponse>;
}

export class WebhooksService implements IWebhooksService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async listWebhookSubscriptions(
    request: ListWebhookSubscriptionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListWebhookSubscriptionsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    // Webhook list endpoints accept only filters and a cursor (no limit or
    // sortDirection), so the shared getQueryParams helper is not used here.
    const { portfolioId, includeDisabled, eventTypeFilter, cursor } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/subscriptions`,
      queryParams: { includeDisabled, eventTypeFilter, cursor },
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listWebhookSubscriptions.bind(this),
      request as ListWebhookSubscriptionsRequest & BasePaginatedRequest,
      ResponseExtractors.webhookSubscriptions,
      paginationOptions
    ) as ListWebhookSubscriptionsResponse;
  }

  async createWebhookSubscription(
    request: CreateWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateWebhookSubscriptionResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const { portfolioId, ...bodyParams } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/subscriptions`,
      bodyParams,
      method: Method.POST,
      callOptions: options,
    });

    return response.data as CreateWebhookSubscriptionResponse;
  }

  async getWebhookSubscription(
    request: GetWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookSubscriptionResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/webhooks/subscriptions/${request.subscriptionId}`,
      callOptions: options,
    });

    return response.data as GetWebhookSubscriptionResponse;
  }

  async updateWebhookSubscription(
    request: UpdateWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<UpdateWebhookSubscriptionResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const { portfolioId, subscriptionId, updateMask, ...rest } = request;
    // The API expects `updateMask` as `{ paths: [...] }`, not a string.
    const bodyParams = {
      ...rest,
      updateMask: normalizeUpdateMask(updateMask),
    };
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/subscriptions/${subscriptionId}`,
      bodyParams,
      method: Method.PATCH,
      callOptions: options,
    });

    return response.data as UpdateWebhookSubscriptionResponse;
  }

  async deleteWebhookSubscription(
    request: DeleteWebhookSubscriptionRequest,
    options?: CoinbaseCallOptions
  ): Promise<DeleteWebhookSubscriptionResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/webhooks/subscriptions/${request.subscriptionId}`,
      method: Method.DELETE,
      callOptions: options,
    });

    return response.data as DeleteWebhookSubscriptionResponse;
  }

  async rotateWebhookHmacSecret(
    request: RotateWebhookHMACSecretRequest,
    options?: CoinbaseCallOptions
  ): Promise<RotateWebhookHMACSecretResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const { portfolioId, subscriptionId, ...bodyParams } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/subscriptions/${subscriptionId}/rotate-hmac-secret`,
      bodyParams,
      method: Method.POST,
      callOptions: options,
    });

    return response.data as RotateWebhookHMACSecretResponse;
  }

  async sendWebhookSimulation(
    request: SendWebhookSimulationRequest,
    options?: CoinbaseCallOptions
  ): Promise<SendWebhookSimulationResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const { portfolioId, subscriptionId, ...bodyParams } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/subscriptions/${subscriptionId}/simulate`,
      bodyParams,
      method: Method.POST,
      callOptions: options,
    });

    return response.data as SendWebhookSimulationResponse;
  }

  async getWebhookEventTypes(
    request?: GetWebhookEventTypesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookEventTypesResponse> {
    const response = await this.client.request({
      url: `webhooks/event-types`,
      callOptions: options,
    });

    return response.data as GetWebhookEventTypesResponse;
  }

  async getWebhookDeliveryLogs(
    request: GetWebhookDeliveryLogsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookDeliveryLogsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const {
      portfolioId,
      subscriptionId,
      statusFilter,
      eventTypeFilter,
      cursor,
    } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/subscriptions/${subscriptionId}/deliveries`,
      queryParams: { statusFilter, eventTypeFilter, cursor },
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.getWebhookDeliveryLogs.bind(this),
      request as GetWebhookDeliveryLogsRequest & BasePaginatedRequest,
      ResponseExtractors.webhookDeliveryLogs,
      paginationOptions
    ) as GetWebhookDeliveryLogsResponse;
  }

  async getWebhookDeliveryAttempts(
    request: GetWebhookDeliveryAttemptsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookDeliveryAttemptsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .requiredString((r) => r.eventId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/webhooks/subscriptions/${request.subscriptionId}/deliveries/${request.eventId}/attempts`,
      callOptions: options,
    });

    return response.data as GetWebhookDeliveryAttemptsResponse;
  }

  async getWebhookSubscriptionStats(
    request: GetWebhookSubscriptionStatsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookSubscriptionStatsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.subscriptionId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/webhooks/subscriptions/${request.subscriptionId}/stats`,
      queryParams: { period: request.period },
      callOptions: options,
    });

    return response.data as GetWebhookSubscriptionStatsResponse;
  }

  async getWebhookOwnerStats(
    request: GetWebhookOwnerStatsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetWebhookOwnerStatsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/webhooks/stats`,
      queryParams: { period: request.period },
      callOptions: options,
    });

    return response.data as GetWebhookOwnerStatsResponse;
  }

  async replayWebhookEvent(
    request: ReplayWebhookEventRequest,
    options?: CoinbaseCallOptions
  ): Promise<ReplayWebhookEventResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.eventId)
      .check();

    const { portfolioId, eventId, ...bodyParams } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/webhooks/events/${eventId}/replay`,
      bodyParams,
      method: Method.POST,
      callOptions: options,
    });

    return response.data as ReplayWebhookEventResponse;
  }
}
