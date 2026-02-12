import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Image from "next/image";



export default function Home() {

  return (
    <div className="relative w-full bg-background font-serif">
      <div className="flex flex-col items-center mt-20 justify-center">
        <h1 className="md:text-5xl text-3xl font-bold">
          Expert Help, Just a Tap Away
        </h1>
        <p className="md:text-xl text-md text-foreground">
          No more waiting for help. Get it now with NearLy
        </p>
        <p className="md:text-md text-sm text-center md:w-[30%] w-[75%] mx-auto text-gray-500">
          NearLy connects you with verified local professionals for any task.
          Reliable, fast, and right in your neighborhood.
        </p>

        <div className="flex flex-row gap-4 md:gap-8 items-center justify-center mt-4">
          {/* <Button variant="default" size="lg" >Find a Worker</Button> */}
          {/* <ScrollingButton text="Get Started" /> */}
          <Button variant="default" size="lg">
            <Link href={"/c/dashboard"}>Get Started</Link>
          </Button>
          <Button variant="outline" size="default">
            <Link href={"/login"}>Join as a Professional</Link>
          </Button>
        </div>
      </div>
      {/* <div id="searching" className="flex flex-col md:flex-row gap-10 md:gap-20 md:p-8 p-4 bg-accent items-center justify-center mt-10">
        <Searching />
        <div className="w-full h-full">
      <Map />
        </div>
      </div> */}

      {/* Our Services */}
      <div className="services px-5 mt-20">
        {/* <h2 className="text-xl font-semibold md:ml-4 font-serif text-foreground">Our Services</h2> */}
        <div className=" rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={services}
            direction="right"
            speed="normal"
          />
        </div>
      </div>

      <hr className="my-10 dark:border-gray-700 border-gray-200"/>

      {/* Get Quick Help (This section showcase for customers interaction) */}
      <div className="QuickHelp px-3 flex flex-row items-center justify-between gap-4 mt-20">
        <div className="head md:ml-28">
        <h1 className="text-md md:text-3xl font-semibold">Get Professionals Nearby you</h1>
        <h2 className="text-sm md:text-lg text-gray-500">Get the Professionals Nearby you, when you need it. <br /> <span className="hidden md:block"> We ensure our customers get help quickly at the most afordable price.</span></h2>
        <Button variant="default" size="lg" className="mt-5">
          <Link href={"/c/dashboard"}>Book a Service</Link> 
        </Button>
        </div>

        <div className="img flex w-[50%] flex-row md:gap-4 gap-2 justify-center p-3">
          <div className="1 flex flex-col md:gap-4 gap-2 mt-3 md:mt-5">
            {/* <Image src={"/getHelp4.jpg"} className=" rounded-2xl" alt="Quick Help" width={150} height={20} /> */}
            <Image src={"/getHelp1.jpg"} className=" rounded-xl" alt="Quick Help" width={200} height={100} />
            <Image src={"/getHelp2.jpg"} className=" rounded-xl border-2" alt="Quick Help" width={200} height={100} />
          </div>
          <div className="2 flex flex-col md:gap-4 gap-2">
          <Image src={"/getHelp3.jpg"} className=" rounded-xl" alt="Quick Help" width={200} height={100} />
          <Image src={"/getHelp4.jpg"} className=" rounded-xl" alt="Quick Help" width={200} height={100} />
            {/* <Image src={"/getHelp3.jpg"} className=" rounded-2xl" alt="Quick Help" width={150} height={100} /> */}
          </div>
        </div>
      </div>

<hr className="my-10 dark:border-gray-700 border-gray-200"/>
      {/* Flexible Hour and High Earnings (This section showcase for workers interaction) */}
      <div className="flex flex-row items-center justify-between gap-4">

      <div className="img flex w-[50%] flex-row md:gap-4 gap-2 justify-center p-3">
          <div className="1 flex flex-col md:gap-4 gap-2 ">
            {/* <Image src={"/getHelp4.jpg"} className=" rounded-2xl" alt="Quick Help" width={150} height={20} /> */}
            <Image src={"/Earning1.jpg"} className=" rounded-xl" alt="Quick Help" width={200} height={100} />
            <Image src={"/Earning2.jpg"} className=" rounded-xl border-2" alt="Quick Help" width={200} height={100} />
          </div>
          <div className="2 flex flex-col md:gap-4 gap-2 mt-3 md:mt-5">
          <Image src={"/Earning3.jpg"} className=" rounded-xl" alt="Quick Help" width={200} height={100} />
          <Image src={"/Earning4.jpg"} className=" rounded-xl" alt="Quick Help" width={200} height={100} />
            {/* <Image src={"/getHelp3.jpg"} className=" rounded-2xl" alt="Quick Help" width={150} height={100} /> */}
          </div>
        </div>


        <div className="head md:mr-28 text-right mr-3">
        <h1 className="text-md md:text-3xl font-semibold text-left">Flexible Hours, High Earnings</h1>
        <h2 className="text-sm md:text-lg text-left text-gray-500"><span className="hidden md:block"> We ensure our workers get paid quickly and efficiently.</span>Work when you want, earn as much as you want. <br /> </h2>
        <Button variant="default" size="lg" className="mt-5">
          <Link href={"/c/dashboard"}>Start Earnings</Link> 
        </Button>
        </div>
      </div>


      {/* <Footer /> */}
      
    </div>
  );
}

const services = [
  {
    service: "Electrician",
    // description: "We offer a wide range of plumbing services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/electrician.jpg"
  },
  {
    service: "Plumber",
    // description: "We offer a wide range of electrical services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/Plumber.jpg"
  },
  {
    service: "Carpentry",
    // description: "We offer a wide range of carpentry services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/carpenter.svg"
  },
  {
    service: "Painting",
    // description: "We offer a wide range of painting services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/painter.jpg"
  },
  {
    service: "Cleaning",
    // description: "We offer a wide range of cleaning services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/cleaner.svg"
  },
  {
    service: "Masonry",
    // description: "We offer a wide range of masonry services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/mason.jpg"  // change this 
  },
  {
    service: "Piping",
    // description: "We offer a wide range of piping services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/pipeFitter.svg"
  },
  {
    service: "Welding",
    // description: "We offer a wide range of welding services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/welder.svg"
  },
  {
    service: "A/C Technician",
    // description: "We offer a wide range of A/C technician services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/acTechnician.jpg"
  },
  {
    service: "Labour",
    // description: "We offer a wide range of labour services to meet your needs. From simple repairs to complex installations, we have you covered.",
    image: "/labour.jpg"  // change this 
  },
  // {
  //   service: "Other",
  //   description: "We offer a wide range of other services to meet your needs. From simple repairs to complex installations, we have you covered.",
  //   image: "/images/other.jpg"
  // }
];
