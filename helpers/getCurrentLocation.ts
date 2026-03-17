export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type PositionOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
};

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
};

/**
 * Gets a single location snapshot.
 * @param options - Optional overrides for enableHighAccuracy, timeout, maximumAge
 */
export const getCurrentCoordinates = (
  options: boolean | PositionOptions = true
): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    const opts =
      typeof options === "boolean"
        ? { ...DEFAULT_OPTIONS, enableHighAccuracy: options }
        : { ...DEFAULT_OPTIONS, ...options };

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      opts
    );
  });
};

/**
 * High-accuracy location for service platforms. Forces GPS/WiFi triangulation
 * to minimize the ~500m error from IP-based or coarse cell tower geolocation.
 * Logs accuracy for debugging; accuracy > 100m often indicates estimated (IP) location.
 */
export const PRECISE_LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true, // Forces GPS/WiFi triangulation, not IP-based
  timeout: 15000,          // Wait up to 15s for satellite lock
  maximumAge: 60000,            // Never use cached (stale) location
};

export const getPreciseLocation = (): Promise<LocationCoords> => {
  return getCurrentCoordinates(PRECISE_LOCATION_OPTIONS).then((coords) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      const accuracyNote = coords.accuracy > 100
        ? " (likely estimated - IP/cell tower)"
        : " (GPS/WiFi triangulation)";
      console.log(`Location Accuracy: ${Math.round(coords.accuracy)}m${accuracyNote}`);
    }
    return coords;
  });
};

/** Accuracy threshold in meters; above this, location is likely coarse (IP-based) */
export const COARSE_ACCURACY_THRESHOLD = 100;

/**
 * Gets location with fallback: tries high accuracy first, retries with cached
 * position on timeout. Useful when GPS is slow (e.g. indoors).
 */
/** * Refined Fallback: 
 * 1. Tries fresh GPS (0 cache)
 * 2. If timeout, tries cached/WiFi (relaxed)
 */
export const getCurrentCoordinatesWithFallback = async (): Promise<LocationCoords> => {
  try {
    // Attempt 1: Fresh, High Accuracy, No Cache
    return await getCurrentCoordinates({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0, 
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === 3 || err.code === 1) { // Timeout or Permissions issue
      console.warn("Retrying with relaxed accuracy settings...");
      // Attempt 2: Use cached position (up to 1 min old) to show SOMETHING
      return await getCurrentCoordinates({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      });
    }
    throw err;
  }
};
  
/**
 * Watches the location and executes a callback on every update.
 * Returns the watcher ID so it can be cleared.
 */
export const startLocationWatch = (
    onUpdate: (coords: LocationCoords) => void,
    onError: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser");
  }
  return navigator.geolocation.watchPosition(
      (pos) => onUpdate({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      }),
      (err) => onError(err),
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    }
  );
};