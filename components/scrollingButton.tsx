'use client';

import { Button } from "./ui/button";

export const ScrollingButton = ({text}: {text: string})=>{

  const handleScroll = ()=>{
    document.getElementById('searching')?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
  }


    return (
        <Button className="cursor-pointer" variant="default" size="lg" onClick={handleScroll}>{text}</Button>
    )
}