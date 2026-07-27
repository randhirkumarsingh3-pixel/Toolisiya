import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const WorkCalculatorPage = () => {
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [angle, setAngle] = useState('0');
  const [work, setWork] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const f = parseFloat(force);
    const d = parseFloat(distance);
    const a = parseFloat(angle);
    if (!isNaN(f) && !isNaN(d) && !isNaN(a)) {
      const radians = a * (Math.PI / 180);
      setWork(f * d * Math.cos(radians));
    } else {
      setWork(0);
    }
  }, [force, distance, angle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(work.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setForce('');
    setDistance('');
    setAngle('0');
  };

  return (
    <CalculatorLayout
      title="Work Calculator"
      description="Calculate the work done by a force acting on an object over a distance"
    >
      <Helmet>
        <title>Work Calculator – Calculate Work Done Easily Online</title>
        <meta name="description" content="Calculate work done instantly with our free Work Calculator. Find force, distance, and work using W=F×d formula easily." />
        <meta name="keywords" content="work calculator, work formula calculator, physics work calculator, force distance calculator, work done calculator" />
        <link rel="canonical" href="https://toolisiya.com/science/work-calculator" />
        <meta property="og:title" content="Work Calculator – Calculate Work Done Easily Online" />
        <meta property="og:description" content="Calculate work done instantly with our free Work Calculator. Find force, distance, and work using W=F×d formula easily." />
        <meta property="og:url" content="https://toolisiya.com/science/work-calculator" />
        <meta property="og:type" content="website" />
      </Helmet>

      <NavigationButtons />

      <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight mt-4">Work Calculator – Calculate Work Done Easily</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-base">Input values</Label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Force (Newtons)</Label>
              <Input type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="e.g., 10" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Distance (meters)</Label>
              <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g., 5" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Angle (degrees)</Label>
              <Input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="e.g., 0" step="any" />
              <p className="text-xs text-muted-foreground">Angle between force and displacement (0° for parallel)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Work (W)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {work.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!work}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Joules (J)</span>
            {work > 0 && <p className="mt-3 text-sm text-green-600 dark:text-green-400">Positive work (energy added)</p>}
            {work < 0 && <p className="mt-3 text-sm text-red-600 dark:text-red-400">Negative work (energy removed)</p>}
            {work === 0 && parseFloat(force) > 0 && <p className="mt-3 text-sm text-muted-foreground">No work done (perpendicular force)</p>}
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="W = F \times d \times \cos(\theta)" description="W = Work, F = Force, d = distance, θ = angle between force and displacement" />

      {/* Understanding Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm mt-12">
        <h2 className="text-2xl font-bold mb-4">Understanding the work calculator</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The Work Calculator is a fundamental physics tool for calculating the energy transferred when a force acts on an object to move it through a distance. In physics, work is defined as the product of force and displacement in the direction of the force. Work is a scalar quantity measured in Joules (J), where 1 Joule equals 1 Newton-meter (N·m). Understanding work is essential for analyzing energy transfer, mechanical systems, and the relationship between force and motion in countless real-world applications.
          </p>
          <p>
            The force-displacement relationship is crucial to understanding work. Only the component of force that acts in the direction of motion does work – this is why the angle between force and displacement matters. When force and displacement are parallel (0°), maximum work is done. When they're perpendicular (90°), no work is done because cos(90°) = 0. When force opposes motion (180°), negative work is done, removing energy from the system. This concept explains why pushing a box horizontally across a floor does work, but holding a heavy object stationary does not, even though you're exerting force.
          </p>
          <p>
            Work calculations are practically important across engineering, physics, and everyday life. Engineers use work calculations to design machines, determine energy requirements, and optimize mechanical systems. The work-energy theorem states that the net work done on an object equals its change in kinetic energy, connecting force, motion, and energy. This calculator simplifies these calculations, allowing students, engineers, and scientists to quickly determine work done in various scenarios, from simple mechanical systems to complex engineering applications, enabling better understanding of energy transfer and system efficiency.
          </p>
        </div>
      </section>

      {/* Formulas Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Formulas & methodology</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">1. Work formula (general)</h3>
            <FormulaDisplay formula="W = F \times d \times \cos(\theta)" description="Work with angle consideration" />
            <p className="text-sm text-muted-foreground mt-2">The general work formula accounts for the angle between force and displacement. Only the force component parallel to displacement does work.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">2. Force from work</h3>
            <FormulaDisplay formula="F = \frac{W}{d \times \cos(\theta)}" description="Calculate force from work and displacement" />
            <p className="text-sm text-muted-foreground mt-2">Rearranging the work formula allows you to find the force required to do a certain amount of work over a given distance.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">3. Distance from work</h3>
            <FormulaDisplay formula="d = \frac{W}{F \times \cos(\theta)}" description="Calculate displacement from work and force" />
            <p className="text-sm text-muted-foreground mt-2">This formula determines how far an object moves when a known force does a specific amount of work.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">4. Work for parallel force</h3>
            <FormulaDisplay formula="W = F \times d" description="When force and displacement are parallel (θ = 0°)" />
            <p className="text-sm text-muted-foreground mt-2">When force acts in the same direction as motion (θ = 0°), cos(0°) = 1, simplifying the formula to W = F × d.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold mb-1">Select calculation type</h3>
              <p className="text-muted-foreground text-sm">Choose what you want to calculate: work (from force and distance), force (from work and distance), or distance (from work and force). The calculator adapts to your needs.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold mb-1">Enter known values</h3>
              <p className="text-muted-foreground text-sm">Input the values you know in the appropriate fields. For work calculations, enter force in Newtons and distance in meters. Ensure all values use SI units for accurate results.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold mb-1">Specify angle</h3>
              <p className="text-muted-foreground text-sm">Enter the angle between the force and displacement direction in degrees. Use 0° when force and motion are parallel, 90° when perpendicular, and 180° when force opposes motion. This angle determines how much of the force contributes to work.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold mb-1">Get results</h3>
              <p className="text-muted-foreground text-sm">View the calculated work in Joules with four decimal places for precision. The calculator also indicates whether work is positive (energy added), negative (energy removed), or zero (no energy transfer). You can copy the result for use in reports or further calculations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Tips & best practices</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Understand the force-displacement relationship – work is only done when force causes displacement. Holding a heavy object stationary requires force but does no work because there's no displacement, even though you expend energy.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Always use consistent SI units (Newtons for force, meters for distance, Joules for work) to ensure accurate calculations. If your values are in other units (pounds, feet, etc.), convert them to SI units first using standard conversion factors.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Remember that perpendicular forces do no work – when force acts at 90° to displacement (like the normal force on a sliding object or centripetal force in circular motion), cos(90°) = 0, so W = 0. Only the force component parallel to motion does work.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Consider the angle carefully in real-world problems – when pulling a sled with a rope at an angle, only the horizontal component of the tension does work moving the sled forward. The vertical component doesn't contribute to horizontal displacement.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Distinguish between positive and negative work – positive work (0° ≤ θ &lt; 90°) adds energy to the system, while negative work (90° &lt; θ ≤ 180°) removes energy. Friction always does negative work because it opposes motion (θ = 180°).</span>
          </li>
        </ul>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Common use cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Mechanical systems</h3>
            <p className="text-muted-foreground text-sm">Engineers calculate work done by machines, motors, and mechanical systems to determine energy requirements, efficiency, and power needs. This includes analyzing conveyor belts, elevators, cranes, and manufacturing equipment to optimize performance and energy consumption.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Physics problems</h3>
            <p className="text-muted-foreground text-sm">Students and physicists use work calculations to solve mechanics problems involving energy transfer, apply the work-energy theorem, and understand the relationship between force, displacement, and energy in various scenarios from simple machines to complex systems.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Engineering applications</h3>
            <p className="text-muted-foreground text-sm">Mechanical engineers calculate work to design efficient machines, determine motor requirements, analyze energy consumption, and optimize mechanical advantage in systems like pulleys, levers, and hydraulic systems. Work calculations are essential for power transmission and energy efficiency analysis.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Sports physics</h3>
            <p className="text-muted-foreground text-sm">Sports scientists analyze work done by athletes to understand energy expenditure, optimize training, and improve performance. This includes calculating work in weightlifting, running, cycling, and other activities to develop better training programs and equipment.</p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              What is work in physics?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Work is the energy transferred to or from an object via the application of force along a displacement. It's calculated as W = F × d × cos(θ), where F is force, d is displacement, and θ is the angle between them. Work is a scalar quantity measured in Joules (J), where 1 J = 1 N·m. Work can be positive (energy added to the system), negative (energy removed), or zero (no energy transfer). The concept of work is fundamental to understanding energy transfer and the work-energy theorem.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Why does the angle matter in work calculations?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Only the component of force that acts in the direction of displacement does work. The cosine of the angle calculates this component: cos(0°) = 1 (maximum work when parallel), cos(90°) = 0 (no work when perpendicular), cos(180°) = -1 (negative work when opposing). For example, when pulling a sled with a rope at 30° above horizontal, only the horizontal component of tension does work moving the sled forward; the vertical component doesn't contribute to horizontal displacement.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Can work be negative?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Yes, work is negative when force opposes displacement (90° &lt; θ ≤ 180°). Negative work removes energy from the system. Common examples include friction (always opposes motion, θ = 180°), air resistance on a moving object, and braking forces on a vehicle. When you catch a ball, your hands do negative work on the ball, removing its kinetic energy and bringing it to rest. The work-energy theorem states that net work equals change in kinetic energy, so negative work decreases kinetic energy.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Why is no work done when holding an object stationary?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Work requires both force AND displacement: W = F × d. When you hold a heavy object stationary, you exert an upward force equal to the object's weight, but there's no displacement (d = 0), so W = F × 0 = 0. Even though you expend biological energy (your muscles consume energy to maintain tension), no mechanical work is done on the object because it doesn't move. This distinction between biological energy expenditure and mechanical work is important in physics – work is only done when force causes displacement.
            </p>
          </details>

          <details className="group border-b pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              What is the work-energy theorem?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              The work-energy theorem states that the net work done on an object equals its change in kinetic energy: W_net = ΔKE = KE_final - KE_initial = ½m(v_f² - v_i²). This fundamental principle connects force, displacement, and energy. For example, if you push a 2 kg box from rest to 5 m/s over 10 meters, the net work done is W = ½(2)(5² - 0²) = 25 J. This theorem is powerful for solving mechanics problems because it relates work (force × distance) directly to velocity changes without needing to know acceleration or time.
            </p>
          </details>

          <details className="group pb-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              How do you calculate work done against gravity?
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              When lifting an object vertically at constant velocity, the upward force equals the object's weight (F = mg), and the displacement is the height (d = h). Since force and displacement are parallel (θ = 0°), work done against gravity is W = F × d = mgh. For example, lifting a 10 kg object 2 meters high requires W = (10)(9.8)(2) = 196 J. This work increases the object's gravitational potential energy by the same amount. When lowering the object, gravity does positive work (adds energy), while your hands do negative work (remove energy) to control the descent.
            </p>
          </details>
        </div>
      </section>
    </CalculatorLayout>
  );
};

export default WorkCalculatorPage;