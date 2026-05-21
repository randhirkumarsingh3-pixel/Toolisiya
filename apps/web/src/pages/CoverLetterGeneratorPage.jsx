import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Wand2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import SEOContentSection from '@/components/SEOContentSection.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const CoverLetterGeneratorPage = () => {
  const [data, setData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    jobTitle: 'Frontend Developer',
    companyName: 'Tech Innovations Inc.',
    hiringManager: 'Sarah Smith',
    skills: 'React, TailwindCSS, Node.js',
    experience: '5 years of building scalable web applications',
    interest: 'I admire your commitment to open-source technologies.'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const letterRef = useRef(null);

  const handleSave = () => {
    localStorage.setItem('coverLetterData', JSON.stringify(data));
    toast.success('Saved to local storage');
  };

  const handleCopy = () => {
    if (letterRef.current) {
      navigator.clipboard.writeText(letterRef.current.innerText);
      toast.success('Copied to clipboard');
    }
  };

  const handleDownloadPDF = async () => {
    if (!letterRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(letterRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cover_letter.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAISuggestions = () => {
    toast.success('AI Suggestions applied! (Mock)');
    setData(prev => ({
      ...prev,
      interest: 'I have been following Tech Innovations Inc. for years and am deeply inspired by your recent launch of the AI-driven analytics platform. I am eager to bring my expertise to your innovative team.'
    }));
  };

  const updateField = (field, value) => setData({ ...data, [field]: value });

  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // SEO Content Data
  const seoDescription = "Create a professional, ATS-friendly cover letter in minutes. Use our free online generator to format your details perfectly and download as a PDF for your next job application.";
  
  const seoFeatures = [
    "Professional formatting automatically applied in real-time",
    "Tailor your letter to specific companies and hiring managers",
    "Instantly copy plain text for email applications",
    "Export to high-quality PDF ready to be uploaded to ATS systems",
    "Local browser storage keeps your data safe without server tracking"
  ];

  const seoSteps = [
    { title: "Enter Your Details", description: "Fill out your name and contact information in the left panel." },
    { title: "Add Job Information", description: "Specify the exact job title you are applying for, the company name, and the hiring manager's name (if known)." },
    { title: "Draft the Body", description: "Highlight your key skills, summarize relevant experience, and write a sentence on why you admire the company." },
    { title: "Download", description: "Review the live preview on the right. If it looks good, click 'Download PDF' to generate your final document." }
  ];

  const seoFaqs = [
    { question: "Why do I need a cover letter?", answer: "While resumes show what you've done, a cover letter explains *why* you did it and *why* you belong at the company. It provides narrative context that a resume cannot, often making the difference in competitive job markets." },
    { question: "Are these cover letters ATS compatible?", answer: "Yes. Our standard formatting avoids complex multi-column structures and relies on clean text flow, ensuring that Applicant Tracking Systems can easily parse the content." },
    { question: "How long should a cover letter be?", answer: "A professional cover letter should be concise—typically 3 to 4 paragraphs, taking up no more than a single page." },
    { question: "Is my personal data saved online?", answer: "No. The cover letter generator processes everything directly within your browser. If you click 'Save', the data is securely stored in your browser's local storage, not on our servers." }
  ];

  const relatedTools = [
    { name: "Resume Builder", path: "/career/resume-builder" },
    { name: "Interview Preparation", path: "/career/interview-preparation" },
    { name: "Job Application Tracker", path: "/career/job-application-tracker" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        defaultTitle="Free Cover Letter Generator & Maker | Toolisiya" 
        defaultDescription={seoDescription}
        faqs={seoFaqs}
        toolData={{
          name: "Cover Letter Generator",
          description: seoDescription,
          applicationCategory: "BusinessApplication"
        }}
        schemaType="software"
      />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Cover Letter Generator" />
          
          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-balance">Free Cover Letter Generator</h1>
                <Button variant="outline" size="sm" onClick={handleSave} className="font-semibold"><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
              </div>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Your Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 p-6">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={data.name} onChange={e => updateField('name', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={data.email} onChange={e => updateField('email', e.target.value)} /></div>
                  <div className="space-y-2 col-span-2"><Label>Phone</Label><Input value={data.phone} onChange={e => updateField('phone', e.target.value)} /></div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Job Details</CardTitle></CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Job Title</Label><Input value={data.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Company Name</Label><Input value={data.companyName} onChange={e => updateField('companyName', e.target.value)} /></div>
                  </div>
                  <div className="space-y-2"><Label>Hiring Manager Name</Label><Input value={data.hiringManager} onChange={e => updateField('hiringManager', e.target.value)} placeholder="e.g., Hiring Manager or John Doe" /></div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-border">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b pb-4">
                  <CardTitle>Content</CardTitle>
                  <Button variant="secondary" size="sm" onClick={generateAISuggestions} className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
                    <Wand2 className="h-4 w-4 mr-2" /> AI Enhance
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2"><Label>Key Skills</Label><Input value={data.skills} onChange={e => updateField('skills', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Relevant Experience</Label><Textarea value={data.experience} onChange={e => updateField('experience', e.target.value)} rows={3} className="resize-none" /></div>
                  <div className="space-y-2"><Label>Why are you interested?</Label><Textarea value={data.interest} onChange={e => updateField('interest', e.target.value)} rows={3} className="resize-none" /></div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="flex items-center justify-end gap-2 bg-card p-4 rounded-xl border border-border shadow-sm sticky top-20 z-10">
                <Button variant="outline" onClick={handleCopy} className="bg-background font-semibold"><Copy className="h-4 w-4 mr-2" /> Copy Text</Button>
                <Button onClick={handleDownloadPDF} disabled={isGenerating} className="font-bold shadow-sm">
                  <Download className="h-4 w-4 mr-2" /> {isGenerating ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>

              <div className="bg-white text-black p-10 md:p-14 rounded-xl shadow-lg min-h-[842px] w-full max-w-[794px] mx-auto font-serif text-[15px] leading-relaxed border border-slate-200" ref={letterRef}>
                <div className="mb-10 pb-6 border-b-2 border-slate-900">
                  <h1 className="text-[2.25em] font-bold mb-1 tracking-tight text-slate-900">{data.name || '[Your Name]'}</h1>
                  <p className="text-slate-600 font-medium tracking-wide">{data.email} • {data.phone}</p>
                </div>

                <div className="mb-8 font-medium">
                  <p>{currentDate}</p>
                </div>

                <div className="mb-10">
                  <p className="font-bold text-slate-900">{data.hiringManager || 'Hiring Manager'}</p>
                  <p className="font-bold text-slate-900">{data.companyName || '[Company Name]'}</p>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-slate-900">Dear {data.hiringManager || 'Hiring Manager'},</p>
                </div>

                <div className="space-y-5 text-slate-800 text-justify">
                  <p>
                    I am writing to express my strong interest in the <strong>{data.jobTitle || '[Job Title]'}</strong> position at <strong>{data.companyName || '[Company Name]'}</strong>. 
                    {data.interest ? ` ${data.interest}` : ''}
                  </p>
                  
                  <p>
                    In my previous roles, I have gained {data.experience || '[relevant experience]'}. 
                    My core competencies include {data.skills || '[key skills]'}, which I believe align perfectly with the requirements of this role.
                  </p>

                  <p>
                    I am particularly drawn to {data.companyName || '[Company Name]'} because of your innovative approach and industry leadership. 
                    I am confident that my background and passion make me a strong candidate for this position, and I am eager to contribute to your team's continued success.
                  </p>

                  <p>
                    Thank you for considering my application. I have attached my resume for your review and would welcome the opportunity to discuss how my skills and experiences align with your needs in an interview.
                  </p>
                </div>

                <div className="mt-12">
                  <p className="text-slate-800">Sincerely,</p>
                  <p className="mt-8 font-bold text-lg text-slate-900">{data.name || '[Your Name]'}</p>
                </div>
              </div>
            </div>
          </div>

          <SEOContentSection 
            description={seoDescription}
            features={seoFeatures}
            howToSteps={seoSteps}
            faqs={seoFaqs}
            relatedTools={relatedTools}
            categoryPath="/career"
          />
        </div>
      </main>
    </div>
  );
};

export default CoverLetterGeneratorPage;