
// import { DummyContent } from "@/components/navbar";
import { Map } from "@/components/map";
import { ScrollingButton } from "@/components/scrollingButton";
import { Searching } from "@/components/searching";
import { Button } from "@/components/ui/button";
import Link from "next/link";




export default function Home() {





  return (
    <div className="relative w-full font-sans bg-background">
      <div className="flex flex-col items-center mt-20 justify-center">
      <h1 className="md:text-5xl text-3xl font-bold">Expert Help, Just a Tap Away</h1>
      <p className="md:text-xl text-md text-foreground">No more waiting for help. Get it now with NearLy</p>
      <p className="md:text-md text-sm text-center md:w-[30%] w-[75%] mx-auto text-gray-500">NearLy connects you with verified local professionals for any task. Reliable, fast, and right in your neighborhood.</p>

      <div className="flex flex-row gap-4 md:gap-8 items-center justify-center mt-4">
        {/* <Button variant="default" size="lg" >Find a Worker</Button> */}
        <ScrollingButton text="Find a Worker" />
        <Button variant="outline" size="default" ><Link href={'/login'}>Join as a Professional</Link></Button>
      </div>
      </div>
      <div id="searching" className="flex flex-col md:flex-row gap-10 md:gap-20 md:p-8 p-4 bg-accent items-center justify-center mt-10">
        <Searching />
        <div className="w-full h-full">
      <Map />
        </div>
      </div>

    </div>
  );
}
