'use client';
import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export const Map = ()=>{

    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
      const initMap = async ()=>{
        // Set options first
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        });

        // Import the maps library
        const { Map } = await importLibrary('maps');
        
        const position = {
            lat: 43.642693,
            lng: -79.387118,
        }

        // init a marker 
        const {Marker} =await importLibrary('marker') as google.maps.MarkerLibrary;

        // Map Options
        const mapOptions: google.maps.MapOptions = {
            center: position,
            zoom: 17,
            mapId: 'MY_NEXTJS_MAP_ID'
        }

        // Setup the map
        // if (mapRef.current) {
          const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
        // }

        // put up a marker 
        const marker = new Marker({
            map: map,
            position: position
        })

      }
  
      initMap();
    }, [])

    return (
        <div>
            <h1>Google Map</h1>
            <div style={{width: '100%', height: '500px'}} className="rounded-lg overflow-hidden" ref={mapRef} />
      </div>
    );
  };