import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import WeddingFormSection from '@/components/invitations/WeddingFormSection.jsx';
import ImageUploadSection from '@/components/invitations/ImageUploadSection.jsx';
import ImageFrameCustomizer from '@/components/invitations/ImageFrameCustomizer.jsx';
import ThemeSelector from '@/components/invitations/ThemeSelector.jsx';
import ColorPaletteCustomizer from '@/components/invitations/ColorPaletteCustomizer.jsx';
import FontCustomizer from '@/components/invitations/FontCustomizer.jsx';
import BackgroundCustomizer from '@/components/invitations/BackgroundCustomizer.jsx';
import GanapatiCustomizer from '@/components/invitations/GanapatiCustomizer.jsx';
import IconElementSelector from '@/components/invitations/IconElementSelector.jsx';
import InvitationPreview from '@/components/invitations/InvitationPreview.jsx';
import ExportOptions from '@/components/invitations/ExportOptions.jsx';

const WEDDING_THEMES = [
  {
    id: 'royal',
    name: 'Royal',
    description: 'Gold, red, and traditional elements',
    colors: { primary: '#D4AF37', secondary: '#DC2626', accent: '#B87333', text: '#1F1B24', background: '#FFF8DC' },
    fonts: { heading: 'Playfair Display, serif', body: 'Outfit, sans-serif' },
    ganapatiDefault: true,
    preview: 'linear-gradient(135deg, #D4AF37 0%, #DC2626 100%)',
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Pastel colors with elegant flowers',
    colors: { primary: '#F472B6', secondary: '#FB923C', accent: '#FDE047', text: '#1F1B24', background: '#FFF1F2' },
    fonts: { heading: 'Cormorant Garamond, serif', body: 'Outfit, sans-serif' },
    ganapatiDefault: true,
    preview: 'linear-gradient(135deg, #F472B6 0%, #FB923C 100%)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, modern, and simple',
    colors: { primary: '#1F2937', secondary: '#6B7280', accent: '#F59E0B', text: '#111827', background: '#FFFFFF' },
    fonts: { heading: 'Outfit, sans-serif', body: 'Outfit, sans-serif' },
    ganapatiDefault: false,
    preview: 'linear-gradient(135deg, #1F2937 0%, #6B7280 100%)',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Red, maroon, and cultural design',
    colors: { primary: '#DC2626', secondary: '#7F1D1D', accent: '#D4AF37', text: '#1F1B24', background: '#FFFBEB' },
    fonts: { heading: 'Playfair Display, serif', body: 'Noto Sans Devanagari, sans-serif' },
    ganapatiDefault: true,
    preview: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)',
  },
];

const STEPS = [
  { id: 'template', label: 'Template', description: 'Choose a design' },
  { id: 'details', label: 'Details', description: 'Couple & event info' },
  { id: 'photos', label: 'Photos', description: 'Upload images' },
  { id: 'design', label: 'Design', description: 'Colors & fonts' },
  { id: 'elements', label: 'Elements', description: 'Ganapati & icons' },
  { id: 'preview', label: 'Preview', description: 'Review & export' },
];

const WeddingInvitationsPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(WEDDING_THEMES[0]);
  const [formData, setFormData] = useState({
    groomNameEn: '', groomNameHi: '',
    brideNameEn: '', brideNameHi: '',
    groomFatherEn: '', groomFatherHi: '',
    brideFatherEn: '', brideFatherHi: '',
    groomMotherEn: '', groomMotherHi: '',
    brideMotherEn: '', brideMotherHi: '',
    mehndiDate: '', mehndiTime: '',
    haldiDate: '', haldiTime: '',
    includeSangeet: false,
    sangeetDate: '', sangeetTime: '',
    weddingDate: '', weddingTime: '',
    includeReception: false,
    receptionDate: '', receptionTime: '',
    venueNameEn: '', venueNameHi: '',
    addressEn: '', addressHi: '',
    mapsLink: '',
    familyType: 'nivedak',
    familyNameEn: '', familyNameHi: '',
  });
  const [images, setImages] = useState({
    groom: null,
    bride: null,
    family: null,
    background: null,
  });
  const [frameSettings, setFrameSettings] = useState({
    style: 'circle',
    borderColor: '#D4AF37',
    borderWidth: 3,
    shadow: true,
    glow: false,
  });
  const [colors, setColors] = useState(selectedTheme.colors);
  const [fonts, setFonts] = useState({
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Outfit, sans-serif',
    detailsFont: 'Outfit, sans-serif',
    headingSize: 32,
    bodySize: 16,
    letterSpacing: 0,
  });
  const [background, setBackground] = useState({
    type: 'theme',
    themeId: 'royal-palace',
    solidColor: '#FFF8DC',
    gradientStart: '#FFF8DC',
    gradientEnd: '#FFFBEB',
    customImage: null,
    blur: 0,
    brightness: 100,
    overlayTint: 'transparent',
    textureClass: '',
    opacity: 100,
    contrast: 100,
  });
  const [ganapati, setGanapati] = useState({
    enabled: true,
    type: 'icon',
    placement: 'top-center',
    size: 64,
    opacity: 100,
    rotation: 0,
    color: '#D4AF37',
    showText: true,
    textSize: 18,
    textColor: '#D4AF37',
    customImage: null,
  });
  const [icons, setIcons] = useState({
    selectedIcons: [],
    iconSize: 32,
    iconColor: '#D4AF37',
    iconOpacity: 100,
    showDividers: false,
    dividerStyle: 'floral',
    dividerColor: '#D4AF37',
  });

  const previewRef = useRef(null);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      formData,
      images,
      frameSettings,
      colors,
      fonts,
      background,
      ganapati,
      icons,
      selectedTheme: selectedTheme.id,
    };
    localStorage.setItem('wedding-invitation-draft', JSON.stringify(saveData));
  }, [formData, images, frameSettings, colors, fonts, background, ganapati, icons, selectedTheme]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wedding-invitation-draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data.formData || formData);
        setImages(data.images || images);
        setFrameSettings(data.frameSettings || frameSettings);
        setColors(data.colors || colors);
        setFonts(data.fonts || fonts);
        setBackground(data.background || background);
        setGanapati(data.ganapati || ganapati);
        setIcons(data.icons || icons);
        if (data.selectedTheme) {
          const theme = WEDDING_THEMES.find(t => t.id === data.selectedTheme);
          if (theme) setSelectedTheme(theme);
        }
        toast.success('Draft loaded from previous session');
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setColors(theme.colors);
    setFonts({
      headingFont: theme.fonts.heading,
      bodyFont: theme.fonts.body,
      detailsFont: theme.fonts.body,
      headingSize: 32,
      bodySize: 16,
      letterSpacing: 0,
    });
    setGanapati({ ...ganapati, enabled: theme.ganapatiDefault });
    toast.success(`${theme.name} theme applied`);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Wedding Invitation',
        text: `${formData.groomNameEn} & ${formData.brideNameEn} - Wedding Invitation`,
        url: window.location.href,
      }).then(() => {
        toast.success('Shared successfully');
      }).catch((error) => {
        console.error('Share failed:', error);
        toast.error('Share failed');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <CalculatorLayout
      title="Wedding Invitation Maker"
      description="Create beautiful Indian wedding invitations with bilingual support"
    >
      <Helmet>
        <title>Free Wedding Invitation Maker - Create Beautiful Indian Wedding Invitations Online</title>
        <meta name="description" content="Create stunning wedding invitations with Indian cultural elements, bilingual support, and Ganapati feature. Customize with photos, colors, and fonts. Download as PDF or Image." />
        <meta name="keywords" content="wedding invitation maker, indian wedding invitations, free invitation maker, wedding card maker, bilingual invitations, ganapati invitations" />
      </Helmet>

      {/* Progress Bar */}
      <Card className="p-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{STEPS[currentStep].label}</h3>
              <p className="text-sm text-muted-foreground">{STEPS[currentStep].description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`transition-colors ${
                  index === currentStep ? 'text-primary font-medium' : 'hover:text-foreground'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Form Steps */}
        <div className="space-y-6">
          {currentStep === 0 && (
            <Card className="p-6">
              <ThemeSelector
                selectedTheme={selectedTheme}
                onThemeSelect={handleThemeSelect}
              />
            </Card>
          )}

          {currentStep === 1 && (
            <WeddingFormSection
              formData={formData}
              onFormChange={setFormData}
            />
          )}

          {currentStep === 2 && (
            <>
              <ImageUploadSection
                images={images}
                onImagesChange={setImages}
              />
              <ImageFrameCustomizer
                frameSettings={frameSettings}
                onFrameChange={setFrameSettings}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <Card className="p-6">
                <ColorPaletteCustomizer
                  colors={colors}
                  onColorsChange={setColors}
                />
              </Card>
              <Card className="p-6">
                <FontCustomizer
                  fonts={fonts}
                  onFontsChange={setFonts}
                />
              </Card>
              <BackgroundCustomizer
                background={background}
                onBackgroundChange={setBackground}
              />
            </>
          )}

          {currentStep === 4 && (
            <>
              <Card className="p-6">
                <GanapatiCustomizer
                  ganapati={ganapati}
                  onGanapatiChange={setGanapati}
                />
              </Card>
              <Card className="p-6">
                <IconElementSelector
                  icons={icons}
                  onIconsChange={setIcons}
                />
              </Card>
            </>
          )}

          {currentStep === 5 && (
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Review Your Invitation</h3>
                  <p className="text-sm text-muted-foreground">
                    Check all details and customize further if needed
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Groom:</span>
                    <span className="font-medium">{formData.groomNameEn || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Bride:</span>
                    <span className="font-medium">{formData.brideNameEn || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Wedding Date:</span>
                    <span className="font-medium">{formData.weddingDate || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-medium">{formData.venueNameEn || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Theme:</span>
                    <span className="font-medium">{selectedTheme.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Photos:</span>
                    <span className="font-medium">
                      {Object.values(images).filter(Boolean).length} uploaded
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === STEPS.length - 1}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div ref={previewRef}>
            <InvitationPreview
              formData={formData}
              colors={colors}
              fonts={fonts}
              ganapati={ganapati}
              images={images}
              frameSettings={frameSettings}
              background={background}
              icons={icons}
              type="wedding"
            />
          </div>

          {currentStep === STEPS.length - 1 && (
            <ExportOptions
              previewRef={previewRef}
              invitationName={`${formData.groomNameEn}-${formData.brideNameEn}-wedding-invitation`}
            />
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default WeddingInvitationsPage;