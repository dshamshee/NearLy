"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Zap,
  Shield,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const values = [
  {
    icon: Zap,
    title: "Speed & Convenience",
    description:
      "Get connected with local professionals in minutes, not days. We bring the on-demand experience to home services.",
  },
  {
    icon: Shield,
    title: "Trust & Verification",
    description:
      "Every professional on our platform is verified. We ensure quality and reliability for every job, every time.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We build stronger neighborhoods by connecting skilled workers with people who need help—right in their backyard.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description:
      "Work with professionals who know your area. Local knowledge means faster service and better results.",
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Verified Professionals" },
  { value: "50+", label: "Service Categories" },
  { value: "4.9", label: "Average Rating" },
];

const highlights = [
  "Instant matching with nearby professionals",
  "Transparent pricing with no hidden fees",
  "Secure payments with multiple options",
  "24/7 support for your peace of mind",
];

export default function AboutPage() {
  return (
    <div className="relative w-full bg-background font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-8">
        <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.p
            variants={fadeInUp}
            className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-4"
          >
            About NearLy
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
          >
            Expert Help,{" "}
            <span className="text-orange-500">Just Around the Corner</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;re bringing the speed and convenience of ride-sharing to home
            services. Stop searching and start fixing—with trusted local
            professionals at your fingertips.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-12 md:py-16 border-y border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
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
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <div>
              <motion.h2
                variants={fadeInUp}
                className="text-2xl md:text-4xl font-bold text-foreground mb-6"
              >
                Our Story
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground leading-relaxed mb-4"
              >
                NearLy was born from a simple frustration: finding reliable
                local help for home repairs shouldn&apos;t be this hard. We
                watched people wait days for a plumber, struggle to find an
                electrician, or overpay for simple fixes.
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground leading-relaxed"
              >
                We asked: what if you could get skilled professionals the same
                way you order a ride? Open the app, drop a pin, and help arrives
                fast. That vision became NearLy—connecting you with verified
                local professionals when you need them most.
              </motion.p>
            </div>
            <motion.div
              variants={fadeInUp}
              className="space-y-4"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <CheckCircle2 className="size-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do—from how we verify professionals
              to how we support our community.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-orange-500/30 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="pt-6">
                    <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                      <value.icon className="size-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of satisfied customers and professionals. Help is
            just a tap away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group cursor-pointer"
              asChild
            >
              <Link
                href="/c/dashboard"
                className="flex items-center gap-2"
              >
                Book a Service
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer hover:text-orange-500 hover:border-orange-500/50 transition-colors"
              asChild
            >
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
