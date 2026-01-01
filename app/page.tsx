
// import { DummyContent } from "@/components/navbar";
import { Map } from "@/components/map";
import { Searching } from "@/components/searching";
import { Button } from "@/components/ui/button";



export default function Home() {



  return (
    <div className="relative w-full font-sans bg-background">
      <div className="flex flex-col items-center mt-20 justify-center">
      <h1 className="text-5xl font-bold">Expert Help, Just a Tap Away</h1>
      <p className="text-xl text-gray-500">No more waiting for help. Get it now with NearLy</p>
      </div>
      <div className="flex items-center justify-center mt-10">
        {/* <Searching /> */}
      </div>

      {/* <Map /> */}
    </div>
  );
}
