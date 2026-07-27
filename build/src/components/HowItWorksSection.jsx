import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Select Your Tool',
    desc: 'Browse our extensive catalog or use the smart search bar to find exactly the calculator, converter, or utility you need.'
  },
  {
    num: '02',
    title: 'Enter Details',
    desc: 'Fill in the required information, parameters, or upload files into our clean, intuitive interfaces.'
  },
  {
    num: '03',
    title: 'Get Instant Results',
    desc: 'Receive immediate, accurate results that you can copy, download, or save to your secure account instantly.'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-lg">
              We've streamlined complex calculations and document tasks into a simple, 3-step process. Get your results without the hassle.
            </p>
            
            <div className="space-y-12 relative">
              {/* Connecting Line */}
              <div className="absolute top-8 bottom-8 left-[38px] w-0.5 bg-border -z-10 hidden sm:block"></div>
              
              {STEPS.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-6 items-start"
                >
                  <div className="text-6xl font-extrabold text-primary/15 shrink-0 tabular-nums w-[80px] text-center select-none bg-background rounded-full">
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative hidden lg:block">
             <div className="absolute inset-0 bg-primary/5 rounded-[2rem] transform rotate-3 scale-105"></div>
             <img 
               src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&w=800&q=80" 
               alt="Productivity workspace showing laptop and organized desk" 
               className="rounded-[2rem] shadow-2xl relative z-10 object-cover aspect-[4/3] w-full border border-border"
               loading="lazy"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;