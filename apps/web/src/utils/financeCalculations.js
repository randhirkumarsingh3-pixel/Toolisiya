export const MOCK_RATES = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  GBP: 0.79
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount || isNaN(amount)) return 0;
  const inUSD = amount / MOCK_RATES[fromCurrency];
  return inUSD * MOCK_RATES[toCurrency];
};

export const calculateGST = (amount, rate) => {
  if (!amount || !rate) return { gstAmount: 0, total: 0 };
  const gstAmount = (amount * rate) / 100;
  return {
    gstAmount,
    total: amount + gstAmount
  };
};

export const reverseGST = (totalAmount, rate) => {
  if (!totalAmount || !rate) return { baseAmount: 0, gstAmount: 0 };
  const baseAmount = totalAmount / (1 + rate / 100);
  const gstAmount = totalAmount - baseAmount;
  return {
    baseAmount,
    gstAmount
  };
};

export const calculateMonthlyEMI = (principal, annualRate, tenureYears) => {
  if (!principal || !annualRate || !tenureYears) return { emi: 0, totalInterest: 0, totalAmount: 0 };
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;
  
  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
};

export const generateAmortizationSchedule = (principal, annualRate, tenureYears) => {
  if (!principal || !annualRate || !tenureYears) return [];
  const { emi } = calculateMonthlyEMI(principal, annualRate, tenureYears);
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  const schedule = [];
  
  let yearlyInterest = 0;
  let yearlyPrincipal = 0;
  
  for (let month = 1; month <= tenureYears * 12; month++) {
    const interest = balance * monthlyRate;
    const principalPayment = emi - interest;
    balance -= principalPayment;
    
    yearlyInterest += interest;
    yearlyPrincipal += principalPayment;
    
    if (month % 12 === 0 || month === tenureYears * 12) {
      schedule.push({
        year: Math.ceil(month / 12),
        interest: Math.round(yearlyInterest),
        principal: Math.round(yearlyPrincipal),
        balance: Math.max(0, Math.round(balance))
      });
      yearlyInterest = 0;
      yearlyPrincipal = 0;
    }
  }
  
  return schedule;
};

export const calculateCompoundInterest = (principal, rate, years, frequency = 1) => {
  if (!principal || !rate || !years) return { maturity: 0, totalInterest: 0, schedule: [] };
  const r = rate / 100;
  const n = frequency;
  const t = years;
  
  const maturity = principal * Math.pow(1 + (r / n), n * t);
  const totalInterest = maturity - principal;
  
  const schedule = [];
  let currentAmount = principal;
  
  for (let i = 1; i <= years; i++) {
    const yearMaturity = principal * Math.pow(1 + (r / n), n * i);
    const yearInterest = yearMaturity - currentAmount;
    schedule.push({
      year: i,
      investment: principal,
      interest: yearInterest,
      totalAmount: yearMaturity
    });
    currentAmount = yearMaturity;
  }
  
  return { maturity, totalInterest, schedule };
};

export const calculateFDMaturity = (principal, rate, years, frequency) => {
  return calculateCompoundInterest(principal, rate, years, frequency);
};