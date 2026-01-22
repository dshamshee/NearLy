import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react"
import Link from "next/link"

export const Footer = () => {

    return (

        <div className="mainContainer bg-gray-100 py-5  mt-10">


            <div className="flex flex-row items-center justify-around md:gap-14 gap-4 text-sm md:text-base">
                <div className="links flex flex-row items-center justify-around md:gap-14 gap-4">
                    <div className="1 flex flex-col items-center justify-around gap-4">
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                    </div>
                    <div className="2 flex flex-col items-center justify-around gap-4">
                        <Link href="/services">Services</Link>
                        <Link href="/contact-us">Contact Us</Link>
                    </div>
                    <div className="3 flex flex-col items-center justify-around gap-4">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-and-conditions">Terms & Conditions</Link>
                    </div>
                </div>

                <div className="socials flex flex-row items-center justify-around md:gap-14 gap-4">
                    <div className="1 flex flex-col items-center justify-around gap-4">
                        <Link href="/"><IconBrandGithub className="hover:text-green-600" /></Link>
                        <Link href="/"><IconBrandX className="hover:text-blue-500" /></Link>
                    </div>
                    <div className="2 flex flex-col items-center justify-around gap-4">
                        <Link href="/"><IconBrandInstagram className="hover:text-pink-500" /></Link>
                        <Link href="/"><IconBrandLinkedin className="hover:text-blue-500" /></Link>
                    </div>
                </div>
            </div>

            <div className="copyright flex flex-col items-center justify-center mt-10">
                <p>Copyright © 2026 NearLy. All rights reserved.</p>
                <p className="text-sm">Developed by <Link href="https://github.com/dshamshee" className="hover:text-blue-500">Danish Shamshee</Link></p>
            </div>
        </div>
    )
}