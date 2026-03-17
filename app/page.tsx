"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  Wrench,
  Clock,
  Shield,
  MapPin,
  DollarSign,
  Search,
  CreditCard,
  Star,
  Zap,
  Users,
} from "lucide-react";

const services = [
  { service: "Electrician", image: "/electrician.jpg" },
  { service: "Plumber", image: "/Plumber.jpg" },
  { service: "Carpentry", image: "/carpenter.svg" },
  { service: "Painting", image: "/painter.jpg" },
  { service: "Cleaning", image: "/cleaner.svg" },
  { service: "Masonry", image: "/mason.jpg" },
  { service: "Piping", image: "/pipeFitter.svg" },
  { service: "Welding", image: "/welder.svg" },
  { service: "A/C Technician", image: "/acTechnician.jpg" },
  { service: "Labour", image: "/labour.jpg" },
];

export default function Home() {
  return (
    <div className="relative w-full bg-background font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-24 md:pb-24 px-4 md:px-8">
        <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-4"
          >
            Local Services on Demand
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
          >
            Expert Help,{" "}
            <span className="text-orange-500">Just a Tap Away</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4"
          >
            No more waiting for help. Get it now with NearLy.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-10"
          >
            Connect with verified local professionals for any task. Reliable,
            fast, and right in your neighborhood.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="group cursor-pointer bg-orange-500 hover:bg-orange-600"
              asChild
            >
              <Link
                href="/login"
                className="flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group cursor-pointer hover:border-orange-500/50 hover:text-orange-500"
              asChild
            >
              <Link href="/services" className="flex items-center gap-2">
                View Services
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Strip */}
      <section className="py-12 md:py-16">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Services We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From plumbing to electrical—find the right professional for any job.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden bg-muted/30 dark:bg-black/20">
            <InfiniteMovingCards
              items={services}
              direction="right"
              speed="normal"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 border-y border-border bg-background">
        <motion.div
          className="max-w-6xl mx-auto px-4 md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Verified Professionals" },
              { value: "50+", label: "Service Categories" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="text-center mb-12 md:mb-16">
            <p className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-2">
              Simple Process
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-orange-500">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get help in three easy steps. No hassle, no waiting.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                icon: Search,
                title: "Choose Your Service",
                desc: "Select the service you need from our wide range of categories. From plumbing to electrical, we've got you covered.",
              },
              {
                step: "02",
                icon: Users,
                title: "Find Nearby Pros",
                desc: "We match you with verified professionals in your area. See ratings, reviews, and availability in real time.",
              },
              {
                step: "03",
                icon: CreditCard,
                title: "Book & Pay Securely",
                desc: "Schedule at your convenience and pay securely. Track your booking from start to finish.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative text-center md:text-left"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                {i < 2 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%+16px)] w-[calc(100%-32px)] max-w-[80px] h-px bg-linear-to-r from-orange-500/40 to-transparent" />
                )}
                <span className="text-5xl font-bold text-orange-500/20">
                  {item.step}
                </span>
                <div className="flex justify-center md:justify-start mt-2">
                  <div className="size-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <item.icon className="size-7 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="text-center mb-12 md:mb-16">
            <p className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-2">
              Trust & Quality
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-orange-500">NearLy</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re built on trust, speed, and local expertise. Here&apos;s what sets us apart.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Matching",
                desc: "Get connected with nearby professionals in minutes, not days.",
              },
              {
                icon: Shield,
                title: "Verified Pros",
                desc: "Every professional is vetted. Quality and reliability guaranteed.",
              },
              {
                icon: Star,
                title: "Transparent Pricing",
                desc: "No hidden fees. See the cost before you book.",
              },
              {
                icon: MapPin,
                title: "Local Expertise",
                desc: "Work with pros who know your area and deliver faster.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-xl border border-border/50 bg-background p-6 hover:border-orange-500/30 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <item.icon className="size-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Customer Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            <motion.div
              className="flex-1 order-2 lg:order-1"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-2">
                For Customers
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Get Professionals{" "}
                <span className="text-orange-500">Nearby You</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Get the professionals you need, when you need it. We ensure our
                customers get help quickly at the most affordable price.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: MapPin, text: "Local professionals" },
                  { icon: Clock, text: "Quick response" },
                  { icon: Shield, text: "Verified & trusted" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 rounded-lg bg-background/80 px-4 py-2 border border-border/50"
                  >
                    <item.icon className="size-4 text-orange-500" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="group cursor-pointer bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/c/dashboard" className="flex items-center gap-2">
                  Book a Service
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex-1 order-1 lg:order-2"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/getHelp1.jpg"
                      alt="Get help"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/getHelp2.jpg"
                      alt="Get help"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/getHelp3.jpg"
                      alt="Get help"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/getHelp4.jpg"
                      alt="Get help"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Worker Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/Earning1.jpg"
                      alt="Earnings"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/Earning2.jpg"
                      alt="Earnings"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/Earning3.jpg"
                      alt="Earnings"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <Image
                      src="/Earning4.jpg"
                      alt="Earnings"
                      width={240}
                      height={160}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-2">
                For Professionals
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Flexible Hours,{" "}
                <span className="text-orange-500">High Earnings</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Work when you want, earn as much as you want. We ensure our
                workers get paid quickly and efficiently.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Clock, text: "Flexible schedule" },
                  { icon: DollarSign, text: "Fast payments" },
                  { icon: Wrench, text: "More jobs" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 rounded-lg bg-muted/80 px-4 py-2 border border-border/50"
                  >
                    <item.icon className="size-4 text-orange-500" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="group cursor-pointer bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/c/dashboard" className="flex items-center gap-2">
                  Start Earning
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="text-center mb-12">
            <p className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-2">
              Testimonials
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              What Our <span className="text-orange-500">Customers Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust NearLy for their home service needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Found a plumber in under 10 minutes. Professional, on time, and fixed the leak in no time. NearLy is a game-changer!",
                name: "Sarah M.",
                role: "Homeowner",
              },
              {
                quote: "I needed an electrician urgently. The app matched me with someone nearby who came within the hour. Highly recommend.",
                name: "James K.",
                role: "Small Business Owner",
              },
              {
                quote: "Transparent pricing, verified professionals, and easy booking. No more endless searching or waiting for callbacks.",
                name: "Aisha R.",
                role: "Homeowner",
              },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-muted/30 p-6 hover:border-orange-500/20 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="size-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-foreground mb-4">
                  &quot;{item.quote}&quot;
                </p>
                <p className="font-semibold text-foreground text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of satisfied customers and professionals. Help is just
            a tap away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group cursor-pointer bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/login" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="cursor-pointer" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
