"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 25 employees",
      "Basic HRIS features",
      "Leave management",
      "Employee self-service portal",
      "Email support",
      "Mobile app access"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "149",
    description: "For growing businesses with advanced needs",
    features: [
      "Up to 100 employees",
      "Full HRIS & ATS platform",
      "Payroll management",
      "Performance reviews",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "API access"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited employees",
      "Everything in Professional",
      "Dedicated account manager",
      "Custom workflows",
      "Advanced security features",
      "SLA guarantee",
      "On-premise deployment option",
      "24/7 phone support"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`relative h-full bg-white rounded-2xl p-8 ${
                tier.popular 
                  ? 'border-2 border-purple-600 shadow-2xl scale-105' 
                  : 'border border-gray-200 shadow-lg'
              } transition-all duration-300 hover:shadow-2xl`}>
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  {tier.price === "Custom" ? (
                    <div className="text-4xl font-bold text-gray-900">
                      Custom
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">
                        ${tier.price}
                      </span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={tier.price === "Custom" ? "#contact" : "/dashboard"} className="block">
                  <Button 
                    className={`w-full h-12 text-base font-medium rounded-lg transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                        : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            All plans include SSL security, regular backups, and 99.9% uptime guarantee.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
