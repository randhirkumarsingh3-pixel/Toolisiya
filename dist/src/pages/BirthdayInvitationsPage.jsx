import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import BilingualInput from '@/components/invitations/BilingualInput.jsx';
import LanguageToggle from '@/components/invitations/LanguageToggle.jsx';
import ImageUploadComponent from '@/components/invitations/ImageUploadComponent.jsx';
import InvitationTemplateSelector from '@/components/invitations/InvitationTemplateSelector.jsx';
import ColorCustomizer from '@/components/invitations/ColorCustomizer.jsx';
import FontCustomizer from '@/components/invitations/FontCustomizer.jsx';
import InvitationPreview from '@/components/invitations/InvitationPreview.jsx';
import ExportOptions from '@/components/invitations/ExportOptions.jsx';

const BIRTHDAY_TEMPLATES = [
  { id: 'kids-birthday', name: 'Kids Birthday', category: 'Children', colors: { primary: '#EC4899', secondary: '#F59E0B', accent: '#8B5CF6', text: '#1F1B24', background: '#FFFBEB' } },
  { id: 'teenage-birthday', name: 'Teenage Birthday', category: 'Teen', colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B', text: '#1F1B24', background: '#FAF5FF' } },
  { id: 'adult-birthday', name: 'Adult Birthday', category: 'Adult', colors: { primary: '#0284C7', secondary: '#0EA5E9', accent: '#7DD3FC', text: '#1F1B24', background: '#F0F9FF' } },
  { id: 'milestone-birthday', name: 'Milestone Birthday', category: 'Special', colors: { primary: '#D4AF37', secondary: '#B8860B', accent: '#FFD700', text: '#1F1B24', background: '#FFFBEB' } },
  { id: 'themed-birthday', name: 'Themed Birthday', category: 'Fun', colors: { primary: '#F97316', secondary: '#FB923C', accent: '#FDE047', text: '#1F1B24', background: '#FFF7ED' } },
  { id: 'minimalist-modern', name: 'Minimalist Modern', category: 'Contemporary', colors: { primary: '#1F2937', secondary: '#6B7280', accent: '#F59E0B', text: '#111827', background: '#FFFFFF' } },
  { id: 'floral-elegant', name: 'Floral & Elegant', category: 'Elegant', colors: { primary: '#E11D48', secondary: '#FB7185', accent: '#FDA4AF', text: '#1F1B24', background: '#FFF1F2' } },
  { id: 'colorful-festive', name: 'Colorful Festive', category: 'Vibrant', colors: { primary: '#06B6D4', secondary: '#3B82F6', accent: '#A78BFA', text: '#1F1B24', background: '#F0F9FF' } },
];

const BirthdayInvitationsPage = () => {
  const [language, setLanguage] = useState('english');
  const [selectedTemplate, setSelectedTemplate] = useState(BIRTHDAY_TEMPLATES[0]);
  const [formData, setFormData] = useState({
    birthdayPersonNameEn: '', birthdayPersonNameHi: '',
    age: '', birthdayDate: '',
    gender: '', interests: '',
    partyDate: '', partyTime: '',
    venue: '', address: '', city: '', state: '', postalCode: '',
    phone: '', email: '',
    theme: '', dressCode: '', rsvpDate: '', rsvpContact: '', specialInstructions: '', website: '',
  });
  const [images, setImages] = useState({
    birthdayPerson: null, background: null, theme: null,
  });
  const [colors, setColors] = useState(selectedTemplate.colors);
  const [fonts, setFonts] = useState({
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Outfit, sans-serif',
    detailsFont: 'Outfit, sans-serif',
    headingSize: 32,
    bodySize: 16,
    letterSpacing: 0,
  });

  const previewRef = useRef(null);

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setColors(template.colors);
  };

  return (
    <CalculatorLayout
      title="Birthday Invitation Maker"
      description="Create fun and colorful birthday invitations with bilingual support"
    >
      <Helmet>
        <title>Free Birthday Invitation Maker - Create Beautiful Birthday Invitations Online</title>
        <meta name="description" content="Create fun and colorful birthday invitations with bilingual support. Customize with photos, colors, and fonts. Download as PDF or Image." />
        <meta name="keywords" content="birthday invitation maker, free invitation maker, birthday card maker, bilingual invitations, birthday party invitations" />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Form & Customization */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Design Your Invitation</h2>
            <LanguageToggle currentLanguage={language} onToggle={() => setLanguage(language === 'english' ? 'hindi' : 'english')} />
          </div>

          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4">
              <InvitationTemplateSelector
                templates={BIRTHDAY_TEMPLATES}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateSelect}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Birthday Person Information</h3>
                
                <BilingualInput
                  label="Name"
                  englishValue={formData.birthdayPersonNameEn}
                  hindiValue={formData.birthdayPersonNameHi}
                  onEnglishChange={(val) => handleFormChange('birthdayPersonNameEn', val)}
                  onHindiChange={(val) => handleFormChange('birthdayPersonNameHi', val)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleFormChange('age', e.target.value)}
                      placeholder="e.g., 25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Birthday Date</Label>
                    <Input
                      type="date"
                      value={formData.birthdayDate}
                      onChange={(e) => handleFormChange('birthdayDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender (Optional)</Label>
                  <Select value={formData.gender} onValueChange={(val) => handleFormChange('gender', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interests/Hobbies (Optional)</Label>
                  <Input
                    value={formData.interests}
                    onChange={(e) => handleFormChange('interests', e.target.value)}
                    placeholder="e.g., Music, Sports, Art"
                  />
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Party Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Party Date</Label>
                    <Input
                      type="date"
                      value={formData.partyDate}
                      onChange={(e) => handleFormChange('partyDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Party Time</Label>
                    <Input
                      type="time"
                      value={formData.partyTime}
                      onChange={(e) => handleFormChange('partyTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => handleFormChange('venue', e.target.value)}
                    placeholder="Venue name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleFormChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => handleFormChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => handleFormChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Party Theme</Label>
                  <Input
                    value={formData.theme}
                    onChange={(e) => handleFormChange('theme', e.target.value)}
                    placeholder="e.g., Superhero, Princess, Retro"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dress Code</Label>
                  <Input
                    value={formData.dressCode}
                    onChange={(e) => handleFormChange('dressCode', e.target.value)}
                    placeholder="e.g., Casual, Costume, Formal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>RSVP Date</Label>
                    <Input
                      type="date"
                      value={formData.rsvpDate}
                      onChange={(e) => handleFormChange('rsvpDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RSVP Contact</Label>
                    <Input
                      value={formData.rsvpContact}
                      onChange={(e) => handleFormChange('rsvpContact', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Input
                    value={formData.specialInstructions}
                    onChange={(e) => handleFormChange('specialInstructions', e.target.value)}
                    placeholder="Any special notes for guests"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Website Link</Label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleFormChange('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              <Card className="p-6 space-y-4">
                <ImageUploadComponent
                  label="Birthday Person Photo"
                  currentImage={images.birthdayPerson}
                  onImageUpload={(img) => setImages({ ...images, birthdayPerson: img })}
                  onRemove={() => setImages({ ...images, birthdayPerson: null })}
                />

                <ImageUploadComponent
                  label="Background Image"
                  currentImage={images.background}
                  onImageUpload={(img) => setImages({ ...images, background: img })}
                  onRemove={() => setImages({ ...images, background: null })}
                />

                <ImageUploadComponent
                  label="Theme Image"
                  currentImage={images.theme}
                  onImageUpload={(img) => setImages({ ...images, theme: img })}
                  onRemove={() => setImages({ ...images, theme: null })}
                />
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card className="p-6">
                <ColorCustomizer colors={colors} onColorsChange={setColors} type="birthday" />
              </Card>

              <Card className="p-6">
                <FontCustomizer fonts={fonts} onFontsChange={setFonts} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview & Export */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div ref={previewRef}>
            <InvitationPreview
              formData={formData}
              colors={colors}
              fonts={fonts}
              images={images}
              type="birthday"
            />
          </div>

          <ExportOptions previewRef={previewRef} invitationName="birthday-invitation" />
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default BirthdayInvitationsPage;