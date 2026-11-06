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
import { Method } from '../../clients';
import { WebhooksService } from '../index';

const PORTFOLIO_ID = '11111111-1111-4111-8111-111111111111';
const SUBSCRIPTION_ID = 'sub-123';

function makeService(responses: unknown[] = [{}]) {
  const request = jest.fn();
  responses.forEach((data) => request.mockResolvedValueOnce({ data }));
  const client = {
    request,
    getDefaultPaginationLimit: () => 25,
    getMaxPages: () => 10,
    getMaxItems: () => 1000,
  };
  return { service: new WebhooksService(client as any), request };
}

describe('WebhooksService', () => {
  it('lists subscriptions without limit or sortDirection query params', async () => {
    const { service, request } = makeService([
      {
        subscriptions: [{ subscriptionId: 'a' }],
        nextCursor: 'cursor-2',
        hasNext: true,
      },
    ]);

    await service.listWebhookSubscriptions({
      portfolioId: PORTFOLIO_ID,
      includeDisabled: true,
      eventTypeFilter: 'ORDER_FILLED',
    });

    expect(request).toHaveBeenCalledTimes(1);
    const call = request.mock.calls[0][0];
    expect(call.url).toBe(`portfolios/${PORTFOLIO_ID}/webhooks/subscriptions`);
    expect(call.queryParams).toEqual({
      includeDisabled: true,
      eventTypeFilter: 'ORDER_FILLED',
      cursor: undefined,
    });
  });

  it('paginates using top-level hasNext / nextCursor', async () => {
    const { service, request } = makeService([
      {
        subscriptions: [{ subscriptionId: 'a' }],
        nextCursor: 'cursor-2',
        hasNext: true,
      },
      {
        subscriptions: [{ subscriptionId: 'b' }],
        nextCursor: '',
        hasNext: false,
      },
    ]);

    const page = await service.listWebhookSubscriptions({
      portfolioId: PORTFOLIO_ID,
    });

    expect(page.hasNext()).toBe(true);
    expect(page.getNextCursor()).toBe('cursor-2');

    const all = await page.fetchAll();
    expect(all.map((s) => s.subscriptionId)).toEqual(['a', 'b']);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1][0].queryParams.cursor).toBe('cursor-2');
    expect(request.mock.calls[1][0].queryParams).not.toHaveProperty('limit');
  });

  it('reports no next page when hasNext is false', async () => {
    const { service } = makeService([
      { entries: [{ eventId: 'e1' }], nextCursor: '', hasNext: false },
    ]);

    const page = await service.getWebhookDeliveryLogs({
      portfolioId: PORTFOLIO_ID,
      subscriptionId: SUBSCRIPTION_ID,
    });

    expect(page.hasNext()).toBe(false);
    expect(await page.next()).toBeNull();
  });

  it('updates a subscription with PATCH and keeps path params out of the body', async () => {
    const { service, request } = makeService();

    await service.updateWebhookSubscription({
      portfolioId: PORTFOLIO_ID,
      subscriptionId: SUBSCRIPTION_ID,
      isEnabled: false,
      updateMask: { paths: ['is_enabled'] },
    });

    const call = request.mock.calls[0][0];
    expect(call.method).toBe(Method.PATCH);
    expect(call.url).toBe(
      `portfolios/${PORTFOLIO_ID}/webhooks/subscriptions/${SUBSCRIPTION_ID}`
    );
    expect(call.bodyParams).toEqual({
      isEnabled: false,
      updateMask: { paths: ['is_enabled'] },
    });
  });

  it('converts a string update mask to the { paths } object form', async () => {
    const { service, request } = makeService();

    await service.updateWebhookSubscription({
      portfolioId: PORTFOLIO_ID,
      subscriptionId: SUBSCRIPTION_ID,
      targetUrl: 'https://example.com/hook',
      updateMask: 'targetUrl, isEnabled',
    });

    expect(request.mock.calls[0][0].bodyParams.updateMask).toEqual({
      paths: ['target_url', 'is_enabled'],
    });
  });

  it('deletes a subscription with DELETE', async () => {
    const { service, request } = makeService();

    await service.deleteWebhookSubscription({
      portfolioId: PORTFOLIO_ID,
      subscriptionId: SUBSCRIPTION_ID,
    });

    const call = request.mock.calls[0][0];
    expect(call.method).toBe(Method.DELETE);
    expect(call.url).toBe(
      `portfolios/${PORTFOLIO_ID}/webhooks/subscriptions/${SUBSCRIPTION_ID}`
    );
  });

  it('replays an event with an optional subscription in the body', async () => {
    const { service, request } = makeService();

    await service.replayWebhookEvent({
      portfolioId: PORTFOLIO_ID,
      eventId: 'evt-1',
      subscriptionId: SUBSCRIPTION_ID,
    });

    const call = request.mock.calls[0][0];
    expect(call.method).toBe(Method.POST);
    expect(call.url).toBe(
      `portfolios/${PORTFOLIO_ID}/webhooks/events/evt-1/replay`
    );
    expect(call.bodyParams).toEqual({ subscriptionId: SUBSCRIPTION_ID });
  });

  it('rotates the HMAC secret and fetches event types without a portfolio', async () => {
    const { service, request } = makeService([{}, {}]);

    await service.rotateWebhookHmacSecret({
      portfolioId: PORTFOLIO_ID,
      subscriptionId: SUBSCRIPTION_ID,
      revokePreviousImmediately: true,
    });
    await service.getWebhookEventTypes();

    expect(request.mock.calls[0][0].url).toBe(
      `portfolios/${PORTFOLIO_ID}/webhooks/subscriptions/${SUBSCRIPTION_ID}/rotate-hmac-secret`
    );
    expect(request.mock.calls[0][0].bodyParams).toEqual({
      revokePreviousImmediately: true,
    });
    expect(request.mock.calls[1][0].url).toBe('webhooks/event-types');
  });

  it('rejects an invalid portfolio ID', async () => {
    const { service } = makeService();
    await expect(
      service.getWebhookOwnerStats({ portfolioId: 'not-a-uuid' })
    ).rejects.toThrow();
  });
});
