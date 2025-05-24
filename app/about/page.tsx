"use client";

import React from "react";
import Link from "next/link";
import { Target, Eye, Star, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b border-neutral-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold mb-4">About Applymandu</h1>
              <p className="text-neutral-600 text-lg">
                Connecting talent with opportunity across Nepal and beyond
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                  alt="Team Collaboration"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-neutral-600 mb-4 text-lg">
                  Founded in 2025, Applymandu emerged from a simple vision: to
                  transform how people find jobs and companies discover talent
                  in Nepal.
                </p>
                <p className="text-neutral-600 mb-8 text-lg">
                  We have grown from a small startup to become Nepals leading
                  career platform, connecting thousands of professionals with
                  their dream careers.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-neutral-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-neutral-600">Active Users</div>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">1000+</div>
                    <div className="text-neutral-600">Companies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 bg-neutral-50 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
              <p className="text-neutral-600 text-lg">
                Guided by our commitment to excellence and innovation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Mission",
                  description:
                    "To empower careers and drive business growth through meaningful connections",
                  color: "bg-blue-50",
                  iconColor: "text-blue-600",
                },
                {
                  icon: Eye,
                  title: "Vision",
                  description:
                    "To be the most trusted career platform in Nepal and beyond",
                  color: "bg-green-50",
                  iconColor: "text-green-600",
                },
                {
                  icon: Star,
                  title: "Values",
                  description:
                    "Integrity, Innovation, and Impact in everything we do",
                  color: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-200"
                >
                  <div
                    className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Meet Our Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "CEO & Founder",
                  avatar: "444",
                  linkedin: "#",
                  twitter: "#",
                },
                {
                  name: "Michael Chen",
                  role: "CTO",
                  avatar: "555",
                  linkedin: "#",
                  twitter: "#",
                },
                {
                  name: "Emily Patel",
                  role: "Head of Operations",
                  avatar: "666",
                  linkedin: "#",
                  twitter: "#",
                },
              ].map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${member.avatar}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-neutral-600 mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href={member.linkedin}
                      className="text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href={member.twitter}
                      className="text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-neutral-900 text-white border-b border-white border-opacity-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-neutral-400 mb-8">
                Have questions? We would love to hear from you.
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-neutral-100"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
