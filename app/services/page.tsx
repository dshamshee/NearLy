"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wrench } from "lucide-react";

const services = [
  {
    service: "Electrician",
    description:
      "Wiring, installations, repairs, and electrical troubleshooting. Licensed professionals for safe, reliable work.",
    image: "/electrician.jpg",
  },
  {
    service: "Plumber",
    description:
      "Leaks, clogs, installations, and full plumbing systems. Fast response for emergencies and scheduled work.",
    image: "/Plumber.jpg",
  },
  {
    service: "Carpentry",
    description:
      "Custom furniture, repairs, installations, and woodwork. Precision craftsmanship for your home.",
    image: "/carpenter.svg",
  },
  {
    service: "Painting",
    description:
      "Interior and exterior painting, touch-ups, and finishes. Transform your space with professional results.",
    image: "/painter.jpg",
  },
  {
    service: "Cleaning",
    description:
      "Deep cleaning, regular maintenance, and specialized services. Spotless results every time.",
    image: "/cleaner.svg",
  },
  {
    service: "Masonry",
    description:
      "Brickwork, stone, concrete, and repairs. Durable solutions for foundations and structures.",
    image: "/mason.jpg",
  },
  {
    service: "Piping",
    description:
      "Pipe fitting, installations, and repairs. Expert handling for residential and commercial needs.",
    image: "/pipeFitter.svg",
  },
  {
    service: "Welding",
    description:
      "Metal fabrication, repairs, and custom welding. Strong, precise work for any project.",
    image: "/welder.svg",
  },
  {
    service: "A/C Technician",
    description:
      "Installation, maintenance, and repair of air conditioning systems. Stay cool year-round.",
    image: "/acTechnician.jpg",
  },
  {
    service: "Labour",
    description:
      "General labor, moving, and heavy lifting. Reliable help for any task.",
    image: "/labour.jpg",
  },
];

const featuredServices = services.slice(0, 6);

export default function ServicesPage() {
  return (
    <div className="relative w-full bg-background font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8">
        <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-4"
          >
            Our Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
          >
            Professional Help for{" "}
            <span className="text-orange-500">Every Need</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From plumbing emergencies to electrical fixes, carpentry to cleaning—find
            verified local professionals ready to tackle any job.
          </motion.p>
        </motion.div>
      </section>

      {/* Scrolling Services Strip */}
      <section className="py-8">
        <div className="rounded-md flex flex-col antialiased bg-muted/30 dark:bg-black dark:bg-grid-white/[0.02] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={services.map((s) => ({ service: s.service, image: s.image }))}
            direction="right"
            speed="normal"
          />
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Popular Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most requested services—all delivered by verified professionals
              in your area.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredServices.map((service, i) => (
              <motion.div
                key={service.service}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="h-full overflow-hidden border-border/50 hover:border-orange-500/30 hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.service}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white">
                        {service.service}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group/btn p-0 h-auto text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                      asChild
                    >
                      <Link
                        href="/c/dashboard"
                        className="flex items-center gap-1"
                      >
                        Book now
                        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Services List */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Full Service Catalog
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete range of professional services. Can&apos;t find
              what you need? Get in touch—we&apos;re always adding more.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {services.map((service) => (
              <motion.div
                key={service.service}
                variants={{
                  initial: { opacity: 0, x: -12 },
                  animate: { opacity: 1, x: 0 },
                }}
              >
                <Card className="h-full border-border/50 hover:border-orange-500/20 hover:bg-card/80 transition-all duration-300">
                  <CardContent className="pt-6 flex flex-row items-center gap-4">
                    <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Wrench className="size-6 text-orange-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">
                        {service.service}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 md:py-24 px-4 md:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Need Something Specific?
          </h2>
          <p className="text-muted-foreground mb-8">
            Drop a pin on the map and find professionals near you. Help is just
            a tap away.
          </p>
          <Button size="lg" className="group cursor-pointer" asChild>
            <Link href="/c/dashboard" className="flex items-center gap-2">
              Book a Service
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
