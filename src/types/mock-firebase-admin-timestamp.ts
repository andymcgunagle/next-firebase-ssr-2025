/* eslint-disable @typescript-eslint/no-explicit-any */

const MS_TO_NANOS = 1000000;
const MIN_SECONDS = -62135596800;

/**
 * Mock implementation of the Firebase Admin SDK `Timestamp` class.
 *
 * This is used solely for typing purposes in environments where
 * `firebase-admin` cannot be imported (e.g., client-side code).
 *
 * ⚠️ DO NOT export or use this class directly - export and use the type only.
 *
 * @see https://github.com/googleapis/nodejs-firestore/blob/main/dev/src/timestamp.ts
 */
class MockFirebaseAdminTimestamp {
  private readonly _seconds: number;
  private readonly _nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this._seconds = seconds;
    this._nanoseconds = nanoseconds;
  }

  static now(): MockFirebaseAdminTimestamp {
    return MockFirebaseAdminTimestamp.fromMillis(Date.now());
  }

  static fromDate(date: Date): MockFirebaseAdminTimestamp {
    return MockFirebaseAdminTimestamp.fromMillis(date.getTime());
  }

  static fromMillis(milliseconds: number): MockFirebaseAdminTimestamp {
    const seconds = Math.floor(milliseconds / 1000);
    const nanos = Math.floor((milliseconds - seconds * 1000) * MS_TO_NANOS);
    return new MockFirebaseAdminTimestamp(seconds, nanos);
  }

  static fromProto(timestamp: any): MockFirebaseAdminTimestamp {
    return new MockFirebaseAdminTimestamp(
      Number(timestamp.seconds || 0),
      timestamp.nanos || 0,
    );
  }

  get seconds(): number {
    return this._seconds;
  }

  get nanoseconds(): number {
    return this._nanoseconds;
  }

  toDate(): Date {
    return new Date(
      this._seconds * 1000 + Math.round(this._nanoseconds / MS_TO_NANOS),
    );
  }

  toMillis(): number {
    return this._seconds * 1000 + Math.floor(this._nanoseconds / MS_TO_NANOS);
  }

  isEqual(other: any): boolean {
    return (
      this === other ||
      (other instanceof MockFirebaseAdminTimestamp &&
        this._seconds === other.seconds &&
        this._nanoseconds === other.nanoseconds)
    );
  }

  toProto(): any {
    const timestamp: any = {};

    if (this.seconds) {
      timestamp.seconds = this.seconds.toString();
    }

    if (this.nanoseconds) {
      timestamp.nanos = this.nanoseconds;
    }

    return { timestampValue: timestamp };
  }

  valueOf(): string {
    const adjustedSeconds = this.seconds - MIN_SECONDS;
    // Note: Up to 12 decimal digits are required to represent all valid 'seconds' values.
    const formattedSeconds = String(adjustedSeconds).padStart(12, "0");
    const formattedNanoseconds = String(this.nanoseconds).padStart(9, "0");
    return formattedSeconds + "." + formattedNanoseconds;
  }
}

export type MockFirebaseAdminTimestampType = MockFirebaseAdminTimestamp;
