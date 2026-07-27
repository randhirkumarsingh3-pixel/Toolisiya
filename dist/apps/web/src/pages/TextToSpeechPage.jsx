import React, { useState, useEffect } from 'react';
import { Play, Square, Pause, Mic, Download, RefreshCcw, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const TextToSpeechPage = () => {
  const [text, setText] = useState('Welcome to Toolisiya Text to Speech generator. This tool converts your text into natural sounding speech.');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Find a good default English voice
        const defaultVoice = availableVoices.find(v => v.name.includes('Google US English')) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!text.trim()) {
      toast.error('Please enter text to speak');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = voices.find(v => v.name === selectedVoice);
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast.error('Speech synthesis interrupted');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleDownloadAttempt = () => {
    toast('Audio Download Unavailable', {
      description: 'Browsers restrict saving Web Speech API output directly. Please use system audio recording software to capture the output.',
      action: { label: 'Understand', onClick: () => {} }
    });
  };

  const renderSlider = (label, value, setValue, min, max, step, icon) => (
    <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="flex items-center gap-2">{icon} {label}</span>
        <span className="text-primary">{value}x</span>
      </div>
      <Slider value={[value]} onValueChange={v => setValue(v[0])} min={min} max={max} step={step} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead defaultTitle="Text to Speech Converter | Toolisiya" defaultDescription="Convert text into natural sounding voice with adjustable pitch, speed, and accents." />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Text to Speech" />
          
          <div className="mb-8 mt-4 text-center">
            <Mic className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Text to Speech</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Turn any written text into spoken words. Choose from multiple languages and accents.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <Card className="lg:col-span-8 shadow-md border-border flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col relative">
                <Textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste text here to be spoken aloud..."
                  className="flex-1 min-h-[400px] border-0 rounded-t-xl focus-visible:ring-0 text-lg md:text-xl leading-relaxed p-6 resize-none shadow-inner"
                />
                <div className="bg-muted/30 border-t p-4 flex justify-between items-center rounded-b-xl">
                  <span className="text-sm font-medium text-muted-foreground">{text.length} characters</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setText('')}><RefreshCcw className="h-4 w-4 mr-2"/> Clear</Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadAttempt}><Download className="h-4 w-4 mr-2"/> Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader><CardTitle>Voice Settings</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Voice / Accent</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Choose a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map(voice => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                        {voices.length === 0 && <SelectItem value="none" disabled>Loading voices...</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>

                  {renderSlider('Speech Rate', rate, setRate, 0.5, 2, 0.1, <Play className="h-4 w-4 text-muted-foreground" />)}
                  {renderSlider('Voice Pitch', pitch, setPitch, 0.5, 2, 0.1, <Volume2 className="h-4 w-4 text-muted-foreground" />)}
                  {renderSlider('Volume', volume, setVolume, 0, 1, 0.1, <Volume2 className="h-4 w-4 text-muted-foreground" />)}

                  <div className="pt-4 grid grid-cols-2 gap-3">
                    {!isPlaying && !isPaused ? (
                      <Button size="lg" className="col-span-2 h-14 text-lg" onClick={handlePlay}>
                        <Play className="h-5 w-5 mr-2 fill-current" /> Speak Text
                      </Button>
                    ) : (
                      <>
                        <Button size="lg" variant={isPlaying ? "outline" : "default"} className="h-14" onClick={isPlaying ? handlePause : handlePlay}>
                          {isPlaying ? <><Pause className="h-5 w-5 mr-2" /> Pause</> : <><Play className="h-5 w-5 mr-2 fill-current" /> Resume</>}
                        </Button>
                        <Button size="lg" variant="destructive" className="h-14" onClick={handleStop}>
                          <Square className="h-5 w-5 mr-2 fill-current" /> Stop
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextToSpeechPage;