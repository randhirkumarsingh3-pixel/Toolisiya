import React from 'react';
import { Helmet } from 'react-helmet';
import { Bot, UserCheck, Edit3, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiContentPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>AI Content Policy | Toolisiya</title>
        <meta name="description" content="Read Toolisiya's policy on the use of AI in our Learning Center and tools, and our commitment to human editorial review." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">AI Content Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Artificial Intelligence is a powerful tool, but it is not a substitute for human expertise. Here is how we balance AI efficiency with rigorous human oversight.
          </p>
        </div>

        <div className="space-y-8">
          
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Edit3 className="text-primary w-6 h-6" />
                Content Generation & Ideation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Our editorial team occasionally uses generative AI tools (such as Large Language Models) to assist with outlining articles, summarizing long technical documentation, and generating initial drafts for repetitive content blocks.
              </p>
              <p>
                However, <strong>AI is never used as the sole author of any article published in our Learning Center.</strong> 
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <UserCheck className="text-primary w-6 h-6" />
                Mandatory Human Review
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Every single piece of content published on Toolisiya—from a tooltip on a calculator to a 3,000-word guide on PDF security—must undergo strict human review before publication.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Fact-Checking:</strong> AI models are prone to "hallucinations." Human editors manually verify all dates, formulas, legal compliance limits, and software feature claims.</li>
                <li><strong>Tone & Clarity:</strong> We rewrite AI-generated text to ensure it matches our brand voice: concise, empathetic, and jargon-free.</li>
                <li><strong>Original Examples:</strong> We inject original, real-world examples, screenshots, and custom SVG diagrams that AI cannot natively generate.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Scale className="text-primary w-6 h-6" />
                Code & Calculator Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                While our developers may use AI coding assistants to write boilerplate code, the core logic of all financial, scientific, and utility calculators is manually written, reviewed, and tested against known baselines to ensure 100% mathematical accuracy. We never deploy unreviewed AI-generated formulas to production.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
