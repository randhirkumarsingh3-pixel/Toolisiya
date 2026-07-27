import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, Copy, Check, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const AgeCalculatorPage = () => {
  const [date, setDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const [zodiacSign, setZodiacSign] = useState('');
  const [nextBirthday, setNextBirthday] = useState('');
  const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);
  const [copied, setCopied] = useState(false);

  const getZodiacSign = (month, day) => {
    const zodiacSigns = [
      { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
      { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
    ];

    for (const zodiac of zodiacSigns) {
      const [startMonth, startDay] = zodiac.start;
      const [endMonth, endDay] = zodiac.end;
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return zodiac.sign;
      }
    }
    return 'Capricorn';
  };

  useEffect(() => {
    if (date) {
      const today = new Date();
      const birthDate = new Date(date);
      
      const years = differenceInYears(today, birthDate);
      const monthsAfterYears = differenceInMonths(today, addYears(birthDate, years));
      const daysAfterMonths = differenceInDays(
        today,
        new Date(today.getFullYear(), today.getMonth() - monthsAfterYears, birthDate.getDate())
      );
      
      setAge({ years, months: monthsAfterYears, days: daysAfterMonths });
      
      const month = birthDate.getMonth() + 1;
      const day = birthDate.getDate();
      setZodiacSign(getZodiacSign(month, day));
      
      let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (nextBday < today) {
        nextBday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
      }
      setNextBirthday(format(nextBday, 'MMMM d, yyyy'));
      setDaysUntilBirthday(differenceInDays(nextBday, today));
    }
  }, [date]);

  const handleCopy = () => {
    const result = `Age: ${age.years} years, ${age.months} months, ${age.days} days\nZodiac Sign: ${zodiacSign}\nNext Birthday: ${nextBirthday}\nDays Until Birthday: ${daysUntilBirthday}`;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'How is age calculated?',
      answer: 'Age is calculated by finding the difference between your birth date and today\'s date. The result is broken down into years, months, and days for precision.',
    },
    {
      question: 'What is a zodiac sign?',
      answer: 'A zodiac sign is determined by your birth date and represents one of the twelve astrological signs. Each sign corresponds to a specific date range in the calendar year.',
    },
    {
      question: 'How accurate is the age calculation?',
      answer: 'The age calculation is precise to the day, accounting for leap years and varying month lengths. It provides exact age in years, months, and days.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Age calculator - Calculate exact age and zodiac sign - Toolisiya.com</title>
        <meta name="description" content="Free age calculator to find your exact age in years, months, and days. Includes zodiac sign and next birthday countdown." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-smooth">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/utilities" className="hover:text-foreground transition-smooth">
                Utilities
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Age Calculator</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                Age calculator
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Calculate your exact age in years, months, and days. Find your zodiac sign and countdown to your next birthday.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Select your birth date</CardTitle>
                  <CardDescription>Choose your date of birth to calculate age</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          setCalendarOpen(false);
                        }}
                        initialFocus
                        disabled={(date) => date > new Date()}
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>

                  {date && (
                    <>
                      <div className="bg-muted rounded-xl p-6">
                        <div className="text-center mb-6">
                          <div className="text-sm text-muted-foreground mb-2">Your age</div>
                          <div className="text-4xl font-bold text-primary">
                            {age.years} years
                          </div>
                          <div className="text-lg text-muted-foreground mt-2">
                            {age.months} months, {age.days} days
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-background rounded-lg p-4 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Zodiac sign</div>
                            <div className="text-xl font-semibold">{zodiacSign}</div>
                          </div>
                          <div className="bg-background rounded-lg p-4 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Days until birthday</div>
                            <div className="text-xl font-semibold text-primary">{daysUntilBirthday}</div>
                          </div>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="text-sm text-muted-foreground">Next birthday</div>
                          <div className="text-lg font-medium">{nextBirthday}</div>
                        </div>
                      </div>

                      <Button onClick={handleCopy} className="w-full transition-smooth active:scale-[0.98]">
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy result
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8 bg-card">
                <CardHeader>
                  <CardTitle>Example calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you were born on January 15, 1995:
                  </p>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <p>Age: 31 years, 2 months, 23 days (as of April 7, 2026)</p>
                    <p>Zodiac Sign: Capricorn</p>
                    <p>Next Birthday: January 15, 2027</p>
                    <p>Days Until Birthday: 283 days</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Frequently asked questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AgeCalculatorPage;