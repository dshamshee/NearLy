'use client';
import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// ~20 meters - when worker and customer are this close (e.g. same device, different browsers),
// show both markers at the same position so they overlap (browsers return slightly different coords)
const SAME_LOCATION_THRESHOLD = 0.0002;

export const Map = ({workerLat, workerLng, custLat, custLng}: {workerLat: number, workerLng: number, custLat: number, custLng: number})=>{

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workerMarkerRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customerMarkerRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directionsRendererRef = useRef<any>(null);
    const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
    const isInitializedRef = useRef<boolean>(false);

    useEffect(()=>{
      const initMap = async ()=>{
        if (!mapRef.current || isInitializedRef.current) return; // Prevent re-initialization
        
        // Set options for the API loader
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        });

        // Import the maps library - this will load the API if not already loaded
        const { Map } = await importLibrary('maps');
        const { Marker } = await importLibrary('marker') as google.maps.MarkerLibrary;

        // Calculate center point between worker and customer (use customer if worker is invalid)
        const hasValidWorker = (workerLat !== 0 || workerLng !== 0);
        const hasValidCustomer = (custLat !== 0 || custLng !== 0);
        const centerLat = hasValidWorker && hasValidCustomer ? (workerLat + custLat) / 2 : (hasValidCustomer ? custLat : 20.5937);
        const centerLng = hasValidWorker && hasValidCustomer ? (workerLng + custLng) / 2 : (hasValidCustomer ? custLng : 78.9629);

        // When both are very close (same device/browser variance), use shared position so markers overlap
        const areSameLocation = hasValidWorker && hasValidCustomer &&
            Math.abs(workerLat - custLat) < SAME_LOCATION_THRESHOLD &&
            Math.abs(workerLng - custLng) < SAME_LOCATION_THRESHOLD;
        const sharedPosition = areSameLocation ? { lat: (workerLat + custLat) / 2, lng: (workerLng + custLng) / 2 } : null;
        const workerDisplayPos = sharedPosition ?? { lat: workerLat, lng: workerLng };
        const customerDisplayPos = sharedPosition ?? { lat: custLat, lng: custLng };

        // Map Options
        const mapOptions: google.maps.MapOptions = {
            center: { lat: centerLat, lng: centerLng },
            zoom: 13,
            mapId: 'MY_NEXTJS_MAP_ID'
        }

        // Setup the map
        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
        mapInstanceRef.current = map;
        isInitializedRef.current = true;

        // Create worker marker
        const workerMarker = new Marker({
            map: map,
            position: workerDisplayPos,
            title: 'Worker Location',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
            }
        });
        workerMarkerRef.current = workerMarker;

        // Create customer marker only if coordinates are valid
        if (custLat !== 0 && custLng !== 0) {
          const customerMarker = new Marker({
              map: map,
              position: customerDisplayPos,
              title: 'Customer Location',
              icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#EA4335',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
              }
          });
          customerMarkerRef.current = customerMarker;
        }

        // Initialize Directions Service and Renderer
        const directionsService = new google.maps.DirectionsService();
        directionsServiceRef.current = directionsService;

        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true, // We'll use our custom markers
            polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 4,
                strokeOpacity: 0.8,
            }
        });
        directionsRendererRef.current = directionsRenderer;

        // Calculate and display route - only when both origin and destination are valid and not same location
        if (hasValidCustomer && hasValidWorker && !areSameLocation) {
          directionsService.route({
            origin: { lat: workerLat, lng: workerLng },
            destination: { lat: custLat, lng: custLng },
            travelMode: google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === 'OK' && result && directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(result);
              
              // Fit bounds to show both markers and route
              const bounds = new google.maps.LatLngBounds();
              bounds.extend({ lat: workerLat, lng: workerLng });
              bounds.extend({ lat: custLat, lng: custLng });
              map.fitBounds(bounds);
            } else if (status === 'ZERO_RESULTS' && directionsRendererRef.current) {
              // Clear route when no route found (e.g., same location, unreachable) - just show markers
              directionsRendererRef.current.setDirections({ routes: [] });
              const bounds = new google.maps.LatLngBounds();
              bounds.extend({ lat: workerLat, lng: workerLng });
              bounds.extend({ lat: custLat, lng: custLng });
              map.fitBounds(bounds);
            }
            // Silently skip other statuses (OVER_QUERY_LIMIT, etc.) - no need to spam console
          });
        }
      }
  
      initMap();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update worker marker position, customer marker, and route when lat/lng or customer coordinates change
    useEffect(() => {
      const updateMap = async () => {
        if (!isInitializedRef.current || !mapInstanceRef.current || !workerMarkerRef.current || !directionsRendererRef.current || !directionsServiceRef.current) return;
        
        const hasValidWorker = (workerLat !== 0 || workerLng !== 0);
        const hasValidCustomer = (custLat !== 0 || custLng !== 0);
        const areSameLocation = hasValidWorker && hasValidCustomer &&
            Math.abs(workerLat - custLat) < SAME_LOCATION_THRESHOLD &&
            Math.abs(workerLng - custLng) < SAME_LOCATION_THRESHOLD;
        const sharedPosition = areSameLocation ? { lat: (workerLat + custLat) / 2, lng: (workerLng + custLng) / 2 } : null;
        const newWorkerPosition = sharedPosition ?? { lat: workerLat, lng: workerLng };
        const customerPosition = sharedPosition ?? { lat: custLat, lng: custLng };
        
        // Update worker marker position
        if (workerMarkerRef.current) {
          workerMarkerRef.current.setPosition(newWorkerPosition);
        }
        
        // Create or update customer marker if coordinates are valid
        if (hasValidCustomer) {
          
          if (customerMarkerRef.current) {
            // Update existing customer marker position
            customerMarkerRef.current.setPosition(customerPosition);
          } else {
            // Create customer marker if it doesn't exist
            const { Marker } = await importLibrary('marker') as google.maps.MarkerLibrary;
            const customerMarker = new Marker({
              map: mapInstanceRef.current,
              position: customerPosition,
              title: 'Customer Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#EA4335',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }
            });
            customerMarkerRef.current = customerMarker;
          }
          
          // Update route - only when both locations are valid and different
          if (directionsServiceRef.current && hasValidWorker && !areSameLocation) {
            directionsServiceRef.current.route({
              origin: newWorkerPosition,
              destination: customerPosition,
              travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
              if (status === 'OK' && result && directionsRendererRef.current) {
                directionsRendererRef.current.setDirections(result);
                
                // Fit bounds to show both markers and route
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(newWorkerPosition);
                bounds.extend(customerPosition);
                mapInstanceRef.current?.fitBounds(bounds);
              } else if (status === 'ZERO_RESULTS' && directionsRendererRef.current) {
                // Clear route when no route found - just show markers
                directionsRendererRef.current.setDirections({ routes: [] });
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(newWorkerPosition);
                bounds.extend(customerPosition);
                mapInstanceRef.current?.fitBounds(bounds);
              }
            });
          } else if (directionsRendererRef.current && (!hasValidWorker || areSameLocation)) {
            // Clear route when worker location is invalid or same as customer
            directionsRendererRef.current.setDirections({ routes: [] });
            const map = mapInstanceRef.current;
            if (map) {
              if (hasValidWorker) {
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(newWorkerPosition);
                bounds.extend(customerPosition);
                map.fitBounds(bounds);
              } else {
                map.setCenter(customerPosition);
                map.setZoom(14);
              }
            }
          }
        }
      };
      
      // Only update if map is initialized
      if (isInitializedRef.current) {
        updateMap();
      }
    }, [workerLat, workerLng, custLat, custLng]);

    return (
        <div className="w-full">
            <div style={{width: '100%', height: '500px'}} className="rounded-lg overflow-hidden" ref={mapRef} />
      </div>
    );
  };  