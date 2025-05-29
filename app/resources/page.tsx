"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Video,
  BookOpen,
  Laptop,
  GraduationCap,
  Award,
  Briefcase,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b border-neutral-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Career Advice & Resources
              </h1>
              <p className="text-neutral-600 text-lg">
                Expert guidance and resources to help you navigate your career
                journey successfully
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16 bg-white 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  image:
                    "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
                  title: "Crafting the Perfect Resume",
                  description:
                    "Learn how to create a resume that stands out and gets you noticed by employers.",
                  category: "Resume Writing",
                  readTime: "8 min read",
                },
                {
                  image:
                    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
                  title: "Ace Your Job Interview",
                  description:
                    "Essential tips and strategies to help you prepare for and excel in job interviews.",
                  category: "Interview Tips",
                  readTime: "10 min read",
                },
                {
                  image:
                    "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
                  title: "Career Growth Strategies",
                  description:
                    "Discover effective ways to advance your career and achieve your professional goals.",
                  category: "Career Development",
                  readTime: "12 min read",
                },
              ].map((article, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                    fill={true}
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-neutral-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.readTime}
                      </span>
                      <Button
                        variant="link"
                        className="text-black hover:text-neutral-700 p-0 h-auto"
                      >
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Resources */}
        <section className="py-16 bg-neutral-50 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Career Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FileText,
                  title: "Resume Templates",
                  description:
                    "Professional templates to help you create a winning resume",
                  color: "bg-blue-50",
                  iconColor: "text-blue-600",
                },
                {
                  icon: Video,
                  title: "Video Tutorials",
                  description: "Step-by-step guides for career development",
                  color: "bg-red-50",
                  iconColor: "text-red-600",
                },
                {
                  icon: BookOpen,
                  title: "Career Guides",
                  description: "Comprehensive guides for various career paths",
                  color: "bg-green-50",
                  iconColor: "text-green-600",
                },
                {
                  icon: Laptop,
                  title: "Online Courses",
                  description: "Self-paced learning for skill development",
                  color: "bg-purple-50",
                  iconColor: "text-purple-600",
                },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 ${resource.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <resource.icon
                      className={`h-6 w-6 ${resource.iconColor}`}
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{resource.title}</h3>
                  <p className="text-neutral-600">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Advice */}
        <section className="py-16 bg-white 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Expert Advice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  avatar: "123",
                  name: "Sarah Chen",
                  role: "Career Coach",
                  title: "Navigating Career Transitions",
                  description:
                    "Expert insights on making successful career changes and transitions.",
                  credentials: [
                    "10+ years experience",
                    "Career Development Certified",
                  ],
                },
                {
                  avatar: "456",
                  name: "Michael Roberts",
                  role: "Brand Strategist",
                  title: "Building Your Personal Brand",
                  description:
                    "Learn how to create and maintain a strong professional presence.",
                  credentials: [
                    "Personal Branding Expert",
                    "LinkedIn Top Voice",
                  ],
                },
              ].map((expert, index) => (
                <div
                  key={index}
                  className="flex gap-6 bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <Image
                      width={64}
                      height={64}
                      src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${expert.avatar}`}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{expert.title}</h3>
                    <p className="text-neutral-600 mb-4">
                      {expert.description}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium">{expert.name}</span>
                      <span className="text-sm text-neutral-500">
                        {expert.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {expert.credentials.map((credential, i) => (
                        <span
                          key={i}
                          className="text-xs bg-neutral-100 px-2 py-1 rounded-full"
                        >
                          {credential}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
