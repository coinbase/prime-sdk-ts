/**
 * Copyright 2025-present Coinbase Global, Inc.
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
  GetFcmBalanceResponse,
  GetFuturesSweepsResponse,
  GetPositionsResponse,
  SetAutoSweepResponse,
  ScheduleFuturesSweepRequest,
  ScheduleFuturesSweepResponse,
  CancelFuturesSweepResponse,
  GetFcmRiskLimitsResponse,
  GetFcmMarginCallDetailsResponse,
  GetFcmSettingsResponse as internalGetFcmSettingsResponse,
  SetFcmSettingsResponse as internalSetFcmSettingsResponse,
  GetFcmEquityResponse as internalGetFcmEquityResponse,
  GetDerivativesCurrencySummaryResponse as internalGetDerivativesCurrencySummaryResponse,
  GetDerivativePositionsResponse as internalGetDerivativePositionsResponse,
} from '../model/';

export type ListEntityFuturesSweepsRequest = {
  entityId: string;
};

export type ListEntityFuturesSweepsResponse = Expand<GetFuturesSweepsResponse>;

export type GetEntityFuturesBalanceRequest = {
  entityId: string;
};

export type GetEntityFuturesBalanceResponse = Expand<GetFcmBalanceResponse>;

export type GetEntityFuturesPositionsRequest = {
  entityId: string;
  productId?: string;
};

export type GetEntityFuturesPositionsResponse = Expand<GetPositionsResponse>;

export type UpdateEntityFuturesAutoSweepRequest = {
  entityId: string;
  autoSweep: boolean;
};

export type UpdateEntityFuturesAutoSweepResponse = Expand<SetAutoSweepResponse>;

export type ScheduleEntityFuturesSweepRequest = ScheduleFuturesSweepRequest & {
  entityId: string;
};

export type ScheduleEntityFuturesSweepResponse =
  Expand<ScheduleFuturesSweepResponse>;

export type CancelEntitySweepRequest = {
  entityId: string;
};

export type CancelEntitySweepResponse = Expand<CancelFuturesSweepResponse>;

export type GetEntityFuturesRiskLimitsRequest = {
  entityId: string;
};

export type GetEntityFuturesRiskLimitsResponse =
  Expand<GetFcmRiskLimitsResponse>;

export type GetEntityFuturesMarginCallDetailsRequest = {
  entityId: string;
};

export type GetEntityFuturesMarginCallDetailsResponse =
  Expand<GetFcmMarginCallDetailsResponse>;

export type GetFcmSettingsRequest = {
  entityId: string;
};

export type GetFcmSettingsResponse = Expand<internalGetFcmSettingsResponse>;

export type SetFcmSettingsRequest = {
  entityId: string;
  targetDerivativesExcess: string;
};

export type SetFcmSettingsResponse = Expand<internalSetFcmSettingsResponse>;

export type GetEntityFcmEquityRequest = {
  entityId: string;
};

export type GetEntityFcmEquityResponse = Expand<internalGetFcmEquityResponse>;

export type GetDerivativesCurrencySummaryRequest = {
  portfolioId: string;
};

export type GetDerivativesCurrencySummaryResponse =
  Expand<internalGetDerivativesCurrencySummaryResponse>;

export type ListDerivativePositionsRequest = {
  portfolioId: string;
  productId?: string;
};

export type ListDerivativePositionsResponse =
  Expand<internalGetDerivativePositionsResponse>;

/* GENERATED-METHOD-ERRORS-START */
export type {
  CancelEntitySweepError,
  GetDerivativesCurrencySummaryError,
  GetEntityBalanceError,
  GetEntityEquityError,
  GetEntityPositionsError,
  GetFcmSettingsError,
  GetMarginCallDetailsError,
  GetRiskLimitsError,
  ListDerivativePositionsError,
  ListEntitySweepsError,
  ScheduleEntitySweepError,
  SetFcmSettingsError,
  UpdateEntityAutoSweepError,
} from '../model/errors/methodErrors';
/* GENERATED-METHOD-ERRORS-END */
