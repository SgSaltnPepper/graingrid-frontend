import React from "react";
import { 
  BadgeCheck, 
  TrendingUp, 
  Snowflake, 
  Ship 
} from "lucide-react";

const FEATURES = [
  {
    id: "01",
    title: "Certified Halal Assurance",
    description: "Every product is sourced from government approved, Halal certified facilities ensuring full compliance with Islamic standards.",
    icon: <BadgeCheck strokeWidth={1.5} className="h-10 w-10 text-orange-600" />,
  },
  {
    id: "02",
    title: "Trusted Global Partnerships",
    description: "We maintain long term sourcing relationships with exporters across Brazil, India, Vietnam, Pakistan, and more.",
    icon: <TrendingUp strokeWidth={1.5} className="h-10 w-10 text-orange-600" />,
  },
  {
    id: "03",
    title: "Reliable Cold Chain",
    description: "Our temperature controlled logistics ensure frozen and chilled items reach clients with freshness fully intact.",
    icon: <Snowflake strokeWidth={1.5} className="h-10 w-10 text-orange-600" />,
  },
  {
    id: "04",
    title: "Timely Container Delivery",
    description: "We ensure efficient clearance and scheduled deliveries across Saudi ports, backed by strong logistics infrastructure.",
    icon: <Ship strokeWidth={1.5} className="h-10 w-10 text-orange-600" />,
  },
];

export default function FeaturesBar() {
  return (
    <section className="w-full bg-zinc-50 border-b border-zinc-200">
      {/* Use grid-cols-1 for mobile (stacking), 
         grid-cols-2 for tablets, 
         and grid-cols-4 for full desktop width 
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
        {FEATURES.map((feature) => (
          <div 
            key={feature.id} 
            className="relative p-10 lg:p-12 group hover:bg-white transition-colors duration-300"
          >
            {/* Number Top Right */}
            <span className="absolute top-10 right-10 text-xl font-black text-zinc-200 group-hover:text-orange-600 transition-colors">
              {feature.id}
            </span>

            {/* Icon Top Left */}
            <div className="mb-10 transform group-hover:scale-110 transition-transform duration-300 origin-left">
              {feature.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4 pr-8">
              {feature.title}
            </h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}