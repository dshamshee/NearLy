'use client';
import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

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
            position: { lat: workerLat, lng: workerLng },
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
              position: { lat: custLat, lng: custLng },
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

        // Calculate and display route - only when both origin and destination are valid
        const sameLocation = Math.abs(workerLat - custLat) < 0.0001 && Math.abs(workerLng - custLng) < 0.0001;

        if (hasValidCustomer && hasValidWorker && !sameLocation) {
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
        
        const newWorkerPosition = {
          lat: workerLat,
          lng: workerLng,
        };
        
        // Update worker marker position
        if (workerMarkerRef.current) {
          workerMarkerRef.current.setPosition(newWorkerPosition);
        }
        
        // Create or update customer marker if coordinates are valid
        const hasValidWorker = (workerLat !== 0 || workerLng !== 0);
        const hasValidCustomer = (custLat !== 0 || custLng !== 0);
        const sameLocation = Math.abs(workerLat - custLat) < 0.0001 && Math.abs(workerLng - custLng) < 0.0001;

        if (hasValidCustomer) {
          const customerPosition = { lat: custLat, lng: custLng };
          
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
          if (directionsServiceRef.current && hasValidWorker && !sameLocation) {
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
          } else if (directionsRendererRef.current && (!hasValidWorker || sameLocation)) {
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