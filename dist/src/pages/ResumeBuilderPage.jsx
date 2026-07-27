import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Download, Printer, Save, Plus, Trash2, Image as ImageIcon, CheckCircle, Type, Scaling, LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import { useSEOData } from '@/hooks/useSEOData.js';

const ResumeBuilderPage = () => {
  const { seoData } = useSEOData('resume-builder');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [data, setData] = useState({
    personal: { fullName: 'Alex Johnson', email: 'alex@example.com', phone: '(555) 123-4567', location: 'New York, NY', photo: null },
    summary: 'Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.',
    experience: [{ id: 1, company: 'Tech Corp', position: 'Senior Developer', duration: '2020 - Present', description: 'Led a team of 5 developers to build scalable web applications.' }],
    education: [{ id: 1, school: 'State University', degree: 'B.S. Computer Science', year: '2019' }],
    skills: 'JavaScript, React, Node.js, Python, SQL'
  });
  
  const [template, setTemplate] = useState('modern');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personal) setData(parsed);
      } catch (e) {
        console.error("Could not parse saved resume");
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(data));
    toast.success('Resume saved securely in browser storage');
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updatePersonal('photo', event.target.result);
      toast.success('Profile photo uploaded');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonal('photo', null);
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePersonal = (field, value) => setData({ ...data, personal: { ...data.personal, [field]: value } });
  
  const addExperience = () => setData({ ...data, experience: [...data.experience, { id: Date.now(), company: '', position: '', duration: '', description: '' }] });
  const updateExperience = (id, field, value) => setData({ ...data, experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) });
  const removeExperience = (id) => setData({ ...data, experience: data.experience.filter(exp => exp.id !== id) });

  const addEducation = () => setData({ ...data, education: [...data.education, { id: Date.now(), school: '', degree: '', year: '' }] });
  const updateEducation = (id, field, value) => setData({ ...data, education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) });
  const removeEducation = (id) => setData({ ...data, education: data.education.filter(edu => edu.id !== id) });

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-[0.875rem]';
    if (fontSize === 'large') return 'text-[1.125rem] leading-relaxed';
    return 'text-[1rem]'; 
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Helmet>
        <title>{seoData?.meta_title || 'Resume Builder – Create Professional Resumes Online'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>

      <div className="fixed bottom-4 left-4 z-50 bg-background/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-border no-print">
        <NavigationButtons />
      </div>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <BreadcrumbNavigation customTitle="Resume Builder" />
          
          <div className="flex flex-col lg:flex-row gap-8 mt-6 items-start">
            <div className="w-full lg:w-1/2 space-y-6 no-print">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-balance text-foreground">{seoData?.h1_tag || 'Resume Builder – Create Professional Resumes'}</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave} className="font-semibold border-primary/20 hover:bg-primary/5 text-primary">
                    <Save className="h-4 w-4 mr-2" /> Save Progress
                  </Button>
                </div>
              </div>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/50">
                    <div className="relative group shrink-0">
                      {data.personal.photo ? (
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary shadow-md">
                          <img src={data.personal.photo} alt="Profile" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Trash2 className="h-6 w-6 text-white cursor-pointer" onClick={removePhoto} />
                          </div>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full border-2 border-dashed border-muted-foreground/50 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground transition-colors group-hover:bg-muted/40 group-hover:border-primary/50 relative overflow-hidden">
                          <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                          <span className="text-[10px] font-medium uppercase">Upload</span>
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg, image/webp" 
                            onChange={handlePhotoUpload} 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            title="Upload Photo"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <Label className="text-base font-semibold">Profile Photo</Label>
                      <p className="text-sm text-muted-foreground">Upload a professional headshot (JPG, PNG, max 2MB).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input value={data.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Location</Label><Input value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} /></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Professional Summary</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <Textarea rows={4} value={data.summary} onChange={e => setData({ ...data, summary: e.target.value })} className="resize-none" placeholder="A brief summary of your professional background and goals." />
                </CardContent>
              </Card>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button variant="outline" size="sm" onClick={addExperience}><Plus className="h-4 w-4 mr-2" /> Add Job</Button>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {data.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-4 p-5 bg-muted/10 border rounded-xl relative group">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                        <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Position</Label><Input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} /></div>
                        <div className="space-y-2 sm:col-span-2"><Label>Duration</Label><Input value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} placeholder="e.g. Jan 2020 - Present" /></div>
                      </div>
                      <div className="space-y-2"><Label>Description / Achievements</Label><Textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="resize-none h-24" /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button variant="outline" size="sm" onClick={addEducation}><Plus className="h-4 w-4 mr-2" /> Add Degree</Button>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-muted/10 border rounded-xl relative group">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="space-y-2"><Label>School / University</Label><Input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} /></div>
                      <div className="space-y-2"><Label>Degree / Certification</Label><Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                      <div className="space-y-2 sm:col-span-2"><Label>Graduation Year</Label><Input value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-md border-border">
                <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Skills</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <Input value={data.skills} onChange={e => setData({ ...data, skills: e.target.value })} placeholder="Comma separated skills (e.g. React, Node.js, Leadership)" />
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <div className="no-print bg-card p-5 rounded-2xl border border-border shadow-lg flex flex-col gap-4 sticky top-20 z-40">
                <div className="flex items-center gap-2 mb-1 pb-3 border-b border-border/50">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="font-semibold text-foreground">Live Preview & Formatting</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1"><LayoutTemplate className="h-3 w-3" /> Layout</Label>
                    <Select value={template} onValueChange={setTemplate}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1"><Type className="h-3 w-3" /> Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                        <SelectItem value="'Calibri', sans-serif">Calibri</SelectItem>
                        <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                        <SelectItem value="Georgia, serif">Georgia</SelectItem>
                        <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1"><Scaling className="h-3 w-3" /> Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleDownloadPDF} disabled={isGenerating} className="flex-1 font-bold h-11 shadow-sm">
                    <Download className="h-4 w-4 mr-2" /> {isGenerating ? 'Generating...' : 'Export PDF'}
                  </Button>
                  <Button variant="outline" onClick={handlePrint} className="flex-1 h-11 bg-background border-border">
                    <Printer className="h-4 w-4 mr-2" /> Print
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div 
                  className={`bg-white text-black p-8 md:p-12 shadow-xl min-h-[1122px] w-[794px] mx-auto print:shadow-none print:p-0 border border-slate-200 transition-all duration-300 ${getFontSizeClass()}`} 
                  ref={resumeRef}
                  style={{ fontFamily: fontFamily }}
                >
                  {template === 'modern' ? (
                    <div className="space-y-8">
                      <div className="flex items-center gap-6 border-b-4 border-slate-900 pb-6">
                        {data.personal.photo && (
                          <div className="shrink-0 h-28 w-28 rounded-full overflow-hidden border border-slate-300">
                            <img src={data.personal.photo} alt="Profile" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h1 className="text-[2.5em] font-extrabold text-slate-900 mb-2 tracking-tight leading-none">{data.personal.fullName || 'Your Name'}</h1>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 font-medium">
                            {data.personal.email && <span>{data.personal.email}</span>}
                            {data.personal.email && data.personal.phone && <span className="text-slate-300">•</span>}
                            {data.personal.phone && <span>{data.personal.phone}</span>}
                            {data.personal.phone && data.personal.location && <span className="text-slate-300">•</span>}
                            {data.personal.location && <span>{data.personal.location}</span>}
                          </div>
                        </div>
                      </div>
                      
                      {data.summary && (
                        <div>
                          <h2 className="text-[1.25em] font-bold text-slate-900 mb-3 uppercase tracking-widest border-l-4 border-slate-900 pl-3">Professional Summary</h2>
                          <p className="text-slate-700 leading-relaxed text-justify">{data.summary}</p>
                        </div>
                      )}

                      {data.experience.length > 0 && (
                        <div>
                          <h2 className="text-[1.25em] font-bold text-slate-900 mb-4 uppercase tracking-widest border-l-4 border-slate-900 pl-3">Work Experience</h2>
                          <div className="space-y-6">
                            {data.experience.map(exp => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                  <h3 className="font-bold text-[1.1em] text-slate-900">{exp.position}</h3>
                                  <span className="text-slate-500 font-bold tracking-wide">{exp.duration}</span>
                                </div>
                                <div className="text-slate-700 font-semibold mb-2">{exp.company}</div>
                                <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.education.length > 0 && (
                        <div>
                          <h2 className="text-[1.25em] font-bold text-slate-900 mb-4 uppercase tracking-widest border-l-4 border-slate-900 pl-3">Education</h2>
                          <div className="space-y-4">
                            {data.education.map(edu => (
                              <div key={edu.id} className="flex justify-between items-baseline">
                                <div>
                                  <h3 className="font-bold text-slate-900 text-[1.1em]">{edu.degree}</h3>
                                  <div className="text-slate-600 font-medium mt-1">{edu.school}</div>
                                </div>
                                <span className="font-bold text-slate-500">{edu.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.skills && (
                        <div>
                          <h2 className="text-[1.25em] font-bold text-slate-900 mb-3 uppercase tracking-widest border-l-4 border-slate-900 pl-3">Core Skills</h2>
                          <p className="text-slate-700 font-medium leading-relaxed">{data.skills}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center pb-4 border-b-2 border-black">
                        {data.personal.photo && (
                          <div className="h-24 w-24 rounded border border-gray-400 mb-4 p-1">
                            <img src={data.personal.photo} alt="Profile" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <h1 className="text-[2.25em] font-bold mb-2 tracking-wide uppercase">{data.personal.fullName || 'Your Name'}</h1>
                        <p className="text-gray-800 tracking-wide text-center">
                          {data.personal.email && <span>{data.personal.email}</span>}
                          {data.personal.email && data.personal.phone && <span className="mx-2">|</span>}
                          {data.personal.phone && <span>{data.personal.phone}</span>}
                          {data.personal.phone && data.personal.location && <span className="mx-2">|</span>}
                          {data.personal.location && <span>{data.personal.location}</span>}
                        </p>
                      </div>
                      
                      {data.summary && (
                        <div>
                          <h2 className="text-[1.1em] font-bold border-b border-gray-300 mb-3 uppercase tracking-widest pb-1">Summary</h2>
                          <p className="text-gray-800 leading-relaxed text-justify">{data.summary}</p>
                        </div>
                      )}

                      {data.experience.length > 0 && (
                        <div>
                          <h2 className="text-[1.1em] font-bold border-b border-gray-300 mb-4 uppercase tracking-widest pb-1">Professional Experience</h2>
                          <div className="space-y-5">
                            {data.experience.map(exp => (
                              <div key={exp.id}>
                                <div className="flex justify-between font-bold text-black mb-1">
                                  <span className="text-[1.05em] uppercase tracking-wide">{exp.company}</span>
                                  <span>{exp.duration}</span>
                                </div>
                                <div className="italic text-gray-800 mb-2">{exp.position}</div>
                                <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.education.length > 0 && (
                        <div>
                          <h2 className="text-[1.1em] font-bold border-b border-gray-300 mb-4 uppercase tracking-widest pb-1">Education</h2>
                          <div className="space-y-3">
                            {data.education.map(edu => (
                              <div key={edu.id} className="flex justify-between">
                                <div>
                                  <span className="font-bold text-black">{edu.school}</span><br/>
                                  <span className="italic text-gray-700">{edu.degree}</span>
                                </div>
                                <span className="font-medium text-gray-800">{edu.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.skills && (
                        <div>
                          <h2 className="text-[1.1em] font-bold border-b border-gray-300 mb-3 uppercase tracking-widest pb-1">Skills</h2>
                          <p className="text-gray-800 leading-relaxed">{data.skills}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm mt-12">
            <h2 className="text-2xl font-bold mb-4">Understanding the resume builder</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Resume Builder is a comprehensive online tool designed to help job seekers create professional, ATS-friendly resumes that stand out to both automated screening systems and human recruiters. In today's competitive job market, having a well-formatted, keyword-optimized resume is essential for getting past Applicant Tracking Systems (ATS) that many companies use to filter applications.
              </p>
              <p>
                Creating an effective resume requires more than just listing your work history – it demands strategic formatting, appropriate use of keywords, quantifiable achievements, and a clear narrative of your professional growth. The Resume Builder guides you through this process with structured sections.
              </p>
            </div>
          </section>

          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Features & functionality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Professional Templates</h3>
                </div>
                <p className="text-muted-foreground text-sm">Choose from modern and classic resume templates designed by career professionals.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">ATS Optimization</h3>
                </div>
                <p className="text-muted-foreground text-sm">All templates are optimized for Applicant Tracking Systems with proper heading hierarchy.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Real-time Preview</h3>
                </div>
                <p className="text-muted-foreground text-sm">See your resume update instantly as you make changes.</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default ResumeBuilderPage;