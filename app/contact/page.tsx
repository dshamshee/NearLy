"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@nearly.app",
    href: "mailto:support@nearly.app",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9430856365",
    href: "tel:+919430856365",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Parul University, Vadodara, Gujarat, India",
    href: "https://www.google.com/maps/place/Parul+University/@22.304961,73.203215,15z/data=!4m6!3m5!1s0x395fc8b14f860151:0x7673597938955754!8m2!3d22.304961!4d73.203215!16s%2Fg%2F11c48cslhz?entry=ttu&g_ep=EgoyMDI2MDIxMi4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24/7",
    href: "mailto:support@nearly.app",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="relative w-full bg-background font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8">
        <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

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
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
          >
            We&apos;d Love to{" "}
            <span className="text-orange-500">Hear From You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Have a question, feedback, or need help? Our team is here to assist
            you. Reach out and we&apos;ll get back to you as soon as possible.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info Cards */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {contactInfo.map((item) => (
                <Card
                  key={item.label}
                  className="border-border/50 hover:border-orange-500/20 transition-colors duration-300"
                >
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <item.icon className="size-5 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      {item.href.startsWith("mailto:") ||
                      item.href.startsWith("tel:") ? (
                        <a
                          href={item.href}
                          className="text-foreground hover:text-orange-500 transition-colors font-medium"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-orange-500/20 bg-orange-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="size-10 text-orange-500 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Quick Response
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 24 hours. For urgent
                        support, call us directly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-border/50 shadow-lg">
                <CardContent className="pt-8 pb-8 px-6 md:px-10">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="size-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Thank you for reaching out. We&apos;ll get back to you
                        within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSubmitted(false)}
                        className="cursor-pointer"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Send us a message
                      </h2>
                      <p className="text-muted-foreground mb-8">
                        Fill out the form below and we&apos;ll get back to you
                        soon.
                      </p>

                      <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                      >
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your name"
                              required
                              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              required
                              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="What is this regarding?"
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us how we can help..."
                            rows={5}
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="group cursor-pointer w-full sm:w-auto"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Send Message
                              <Send className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 md:py-24 px-4 md:px-8 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Prefer to Book Directly?
          </h2>
          <p className="text-muted-foreground mb-8">
            Skip the wait—find and book a professional near you right now.
          </p>
          <Button size="lg" className="group cursor-pointer" asChild>
            <Link href="/c/dashboard" className="flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
