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

type Decrement = [never, 0, 1, 2];

type ExpandDepth<T, Depth extends number> = Depth extends 0
  ? T
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends Date
      ? T
      : T extends readonly (infer U)[]
        ? readonly ExpandDepth<U, Depth>[]
        : T extends Array<infer U>
          ? ExpandDepth<U, Depth>[]
          : T extends object
            ? { [K in keyof T]: ExpandDepth<T[K], Decrement[Depth]> }
            : T;

/** Expands object types up to 2 levels for clearer IDE hovers. */
export type Expand<T> = ExpandDepth<T, 2>;
