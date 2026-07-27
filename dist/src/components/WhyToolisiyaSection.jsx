import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cloud, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  { 
    title: 'Fast & Free', 
    desc: 'All tools are completely free with instant, real-time results. No waiting, no paywalls.', 
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  },
  { 
    title: 'Secure & Private', 
    desc: 'Your data is safe. We process locally where possible and store no data unless you explicitly create an account to save it.', 
    icon: Shield,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  { 
    title: 'No Installation Required', 
    desc: 'Access our entire suite of tools directly from your browser. Skip the bulky app downloads and setup processes.', 
    icon: Cloud,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  { 
    title: 'Mobile Friendly', 
    desc: 'Designed responsively from the ground up to work perfectly on all your devices — desktop, tablet, and mobile phone.', 
    icon: Smartphone,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
];

const WhyToolisiyaSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4">Why Choose Toolisiya?</h2>
          <p className="text-muted-foreground text-lg">Everything you need to work efficiently, securely, and seamlessly in one centralized platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:bg-muted/30 transition-colors duration-300 shadow-none hover:shadow-soft">
                  <CardContent className="p-8 flex items-start gap-6">
                    <div className={`h-16 w-16 rounded-2xl ${feature.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyToolisiyaSection;