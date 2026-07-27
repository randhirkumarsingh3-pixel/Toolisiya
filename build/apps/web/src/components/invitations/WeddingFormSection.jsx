import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import BilingualInput from './BilingualInput.jsx';

const WeddingFormSection = ({ formData, onFormChange }) => {
  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Couple Details */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Couple Details</h3>
        
        <BilingualInput
          label="Groom's Name"
          englishValue={formData.groomNameEn || ''}
          hindiValue={formData.groomNameHi || ''}
          onEnglishChange={(val) => handleChange('groomNameEn', val)}
          onHindiChange={(val) => handleChange('groomNameHi', val)}
          required
        />

        <BilingualInput
          label="Bride's Name"
          englishValue={formData.brideNameEn || ''}
          hindiValue={formData.brideNameHi || ''}
          onEnglishChange={(val) => handleChange('brideNameEn', val)}
          onHindiChange={(val) => handleChange('brideNameHi', val)}
          required
        />

        <BilingualInput
          label="Groom's Father Name"
          englishValue={formData.groomFatherEn || ''}
          hindiValue={formData.groomFatherHi || ''}
          onEnglishChange={(val) => handleChange('groomFatherEn', val)}
          onHindiChange={(val) => handleChange('groomFatherHi', val)}
        />

        <BilingualInput
          label="Bride's Father Name"
          englishValue={formData.brideFatherEn || ''}
          hindiValue={formData.brideFatherHi || ''}
          onEnglishChange={(val) => handleChange('brideFatherEn', val)}
          onHindiChange={(val) => handleChange('brideFatherHi', val)}
        />

        <BilingualInput
          label="Groom's Mother Name (Optional)"
          englishValue={formData.groomMotherEn || ''}
          hindiValue={formData.groomMotherHi || ''}
          onEnglishChange={(val) => handleChange('groomMotherEn', val)}
          onHindiChange={(val) => handleChange('groomMotherHi', val)}
        />

        <BilingualInput
          label="Bride's Mother Name (Optional)"
          englishValue={formData.brideMotherEn || ''}
          hindiValue={formData.brideMotherHi || ''}
          onEnglishChange={(val) => handleChange('brideMotherEn', val)}
          onHindiChange={(val) => handleChange('brideMotherHi', val)}
        />
      </Card>

      {/* Event Details */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mehndi Date</Label>
            <Input
              type="date"
              value={formData.mehndiDate || ''}
              onChange={(e) => handleChange('mehndiDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Mehndi Time</Label>
            <Input
              type="time"
              value={formData.mehndiTime || ''}
              onChange={(e) => handleChange('mehndiTime', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Haldi Date</Label>
            <Input
              type="date"
              value={formData.haldiDate || ''}
              onChange={(e) => handleChange('haldiDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Haldi Time</Label>
            <Input
              type="time"
              value={formData.haldiTime || ''}
              onChange={(e) => handleChange('haldiTime', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Label>Include Sangeet Ceremony</Label>
          <Switch
            checked={formData.includeSangeet || false}
            onCheckedChange={(checked) => handleChange('includeSangeet', checked)}
          />
        </div>

        {formData.includeSangeet && (
          <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
            <div className="space-y-2">
              <Label>Sangeet Date</Label>
              <Input
                type="date"
                value={formData.sangeetDate || ''}
                onChange={(e) => handleChange('sangeetDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sangeet Time</Label>
              <Input
                type="time"
                value={formData.sangeetTime || ''}
                onChange={(e) => handleChange('sangeetTime', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Wedding Date *</Label>
            <Input
              type="date"
              value={formData.weddingDate || ''}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Wedding Time *</Label>
            <Input
              type="time"
              value={formData.weddingTime || ''}
              onChange={(e) => handleChange('weddingTime', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Label>Include Reception</Label>
          <Switch
            checked={formData.includeReception || false}
            onCheckedChange={(checked) => handleChange('includeReception', checked)}
          />
        </div>

        {formData.includeReception && (
          <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
            <div className="space-y-2">
              <Label>Reception Date</Label>
              <Input
                type="date"
                value={formData.receptionDate || ''}
                onChange={(e) => handleChange('receptionDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reception Time</Label>
              <Input
                type="time"
                value={formData.receptionTime || ''}
                onChange={(e) => handleChange('receptionTime', e.target.value)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Venue Details */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Venue Details</h3>
        
        <BilingualInput
          label="Venue Name"
          englishValue={formData.venueNameEn || ''}
          hindiValue={formData.venueNameHi || ''}
          onEnglishChange={(val) => handleChange('venueNameEn', val)}
          onHindiChange={(val) => handleChange('venueNameHi', val)}
          required
        />

        <BilingualInput
          label="Full Address"
          englishValue={formData.addressEn || ''}
          hindiValue={formData.addressHi || ''}
          onEnglishChange={(val) => handleChange('addressEn', val)}
          onHindiChange={(val) => handleChange('addressHi', val)}
          required
        />

        <div className="space-y-2">
          <Label>Google Maps Link (Optional)</Label>
          <Input
            type="url"
            value={formData.mapsLink || ''}
            onChange={(e) => handleChange('mapsLink', e.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </Card>

      {/* Family/Nivedak Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Family/Nivedak Section</h3>
        
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <Label className="font-medium">Section Type</Label>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.familyType === 'nivedak' ? 'Nivedak (Inviter)' : 'With Blessings From'}
            </p>
          </div>
          <Switch
            checked={formData.familyType === 'blessings'}
            onCheckedChange={(checked) => handleChange('familyType', checked ? 'blessings' : 'nivedak')}
          />
        </div>

        <BilingualInput
          label={formData.familyType === 'nivedak' ? 'Nivedak Name' : 'Family Name'}
          englishValue={formData.familyNameEn || ''}
          hindiValue={formData.familyNameHi || ''}
          onEnglishChange={(val) => handleChange('familyNameEn', val)}
          onHindiChange={(val) => handleChange('familyNameHi', val)}
        />
      </Card>
    </div>
  );
};

export default WeddingFormSection;