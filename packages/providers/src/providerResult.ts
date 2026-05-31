/**
 * Possible states describing the quality or availability of provider data.
 */
export type DataState =
  | 'UNKNOWN'
  | 'NOT_AVAILABLE'
  | 'LOW_CONFIDENCE'
  | 'MANUAL_REVIEW'
  | 'OK';

/**
 * Standard wrapper returned by all providers.  Every provider should describe
 * where data came from, when it was produced, when it was received, and its
 * confidence and state.  If data is missing, `data` will be undefined and
 * `missingReason` should describe why.
 */
export interface ProviderResult<T> {
  /** Identifier of the provider (e.g. 'news-feed', 'market-data'). */
  source: string;
  /** Timestamp when the provider produced the data (ISO string). */
  providerTimestamp: string;
  /** Timestamp when the system received the data (ISO string). */
  receivedTimestamp: string;
  /** The payload returned by the provider, if available. */
  data?: T;
  /** Confidence score between 0 and 1 indicating provider certainty. */
  confidence?: number;
  /** Current state of the data. */
  state: DataState;
  /** Optional schema version to track changes in data structure. */
  schemaVersion: string;
  /** Optional list of warnings or anomalies detected by the provider. */
  warnings?: string[];
  /** Reason for missing data if `state` is not OK. */
  missingReason?: string;
  /** References to raw evidence (e.g. URLs, file paths) used to derive this result. */
  evidence?: string[];
}