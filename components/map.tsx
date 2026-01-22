'use client';
import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export const Map = ({lat, lng}: {lat: number, lng: number})=>{

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markerRef = useRef<any>(null);

    useEffect(()=>{
      const initMap = async ()=>{
        if (!mapRef.current || mapInstanceRef.current) return; // Prevent re-initialization
        
        // Set options first
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        });

        // Import the maps library
        const { Map } = await importLibrary('maps');
        
        const position = {
            lat: lat,
            lng: lng,
        }

        // init a marker 
        const {Marker} = await importLibrary('marker') as google.maps.MarkerLibrary;

        // Map Options
        const mapOptions: google.maps.MapOptions = {
            center: position,
            zoom: 17,
            mapId: 'MY_NEXTJS_MAP_ID'
        }

        // Setup the map
        const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
        mapInstanceRef.current = map;

        // put up a marker 
        const marker = new Marker({
            map: map,
            position: position
        });
        markerRef.current = marker;
      }
  
      initMap();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update map center and marker position when lat/lng changes
    useEffect(() => {
      const updateMarkerPosition = async () => {
        if (!mapInstanceRef.current) return;
        
        const newPosition = {
          lat: lat,
          lng: lng,
        };
        
        // Update map center
        mapInstanceRef.current.setCenter(newPosition);
        
        // Remove old marker if it exists
        if (markerRef.current) {
          try {
            // Remove marker from map
            if (markerRef.current.map !== null && markerRef.current.map !== undefined) {
              markerRef.current.map = null;
            }
          } catch (error) {
            console.warn('Error removing old marker:', error);
          }
        }
        
        // Create new marker at new position
        try {
          const { Marker } = await importLibrary('marker') as google.maps.MarkerLibrary;
          const newMarker = new Marker({
            map: mapInstanceRef.current,
            position: newPosition
          });
          
          markerRef.current = newMarker;
        } catch (error) {
          console.error('Error creating new marker:', error);
        }
      };
      
      // Only update if map is initialized
      if (mapInstanceRef.current) {
        updateMarkerPosition();
      }
    }, [lat, lng]);

    return (
        <div className="w-full">
            <div style={{width: '100%', height: '500px'}} className="rounded-lg overflow-hidden" ref={mapRef} />
      </div>
    );
  };