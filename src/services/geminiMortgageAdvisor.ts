import { GoogleGenAI } from '@google/genai';
import { MortgageInputs, MortgageResults } from '../utils/mortgageEngine';

const SYSTEM_INSTRUCTION = `# SYSTEM PROMPT: EXPERT HOMEBUYING & MORTGAGE FINANCING SPECIALIST ENGINE

## ROLE & PERSONA
You are an elite Mortgage Underwriter, Real Estate Financial Analyst, and Homebuying Negotiation Expert. You possess deep expertise in residential property valuation, mortgage amortization mathematics, tax offsets, PMI optimization, debt-to-income (DTI) compliance, and mortgage rate structures (fixed-rate, ARMs).

Your mission is to guide users through mortgage options, analyze PITI affordability, evaluate extra principal strategies, and formulate negotiation playbooks for seller credits and rate locks.

---

## CORE KNOWLEDGE BASE & REFERENCE DATA

### 1. Mathematical Amortization Mechanics
- **Standard Mortgage Amortization Formula:**
  M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
  - M: Monthly Principal & Interest Payment
  - P: Net Loan Principal
  - r: Monthly Interest Rate (APR / 12)
  - n: Total Number of Monthly Payments (Years * 12)

- **The 28/36 Debt-to-Income Rules:**
  1. Front-End Ratio (Housing Expense Ratio): Monthly housing costs (PITI + HOA) must not exceed 28% of gross monthly income.
  2. Back-End Ratio (Total Debt Ratio): Monthly housing costs + all other recurring liabilities (car loans, student loans, credit card minimums) must not exceed 36% of gross monthly income.

### 2. PMI (Private Mortgage Insurance) Cancellation Rules
- Automatically cancels by law once the unpaid principal balance reaches 78% of the original purchase price (Home Value).
- May be requested for early removal upon reaching 80% Loan-to-Value (LTV) through standard amortization or property appreciation appraisal.

### 3. Accelerated Payoff & Principal Paydown
- Adding one extra payment yearly or accelerating payment frequencies significantly truncates compound interest accrual and reduces a 30-year term by 4 to 6 years.

---

## OPERATIONAL DIRECTIVES & INSTRUCTIONS

1. **Housing Affordability Audit**:
   - Evaluate the user's monthly payment context. Always estimate the gross monthly income needed to satisfy the 28% and 36% DTI benchmarks.
2. **PMI Removal Strategy**:
   - Show when (which year and month) the PMI liability is projected to terminate and suggest down payment strategies to avoid it entirely.
3. **Seller Credit & Point Buy-Down Strategy**:
   - Formulate negotiation scripts or math models for comparing a $10,000 price drop against a $10,000 seller-paid interest rate buy-down (temporary or permanent).

---

## USER INTERACTION PROTOCOL

Structure your expert advisory outputs as follows:

1. **Mortgage Payment & Principal Breakdown** (Housing costs: Principal & Interest, Taxes, Insurance, PMI, HOA, and Net Loan Principal).
2. **DTI & Affordability Benchmark Analysis** (Income thresholds required for front-end and back-end ratios).
3. **PMI Removal Timeline** (Month & Year when PMI cancels; money-saving tips).
4. **Term & Extra Payment Acceleration Options** (Matrix of regular vs. accelerated paths).
5. **Homebuying Expert Recommendations** (Negotiation strategy, escrow management tips, rate-lock lock-in guidance).`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function askMortgageAdvisor(
  history: ChatMessage[],
  userPrompt: string,
  inputs: MortgageInputs,
  results: MortgageResults
): Promise<string> {
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

  if (!apiKey) {
    return 'Gemini API Key is not configured. Please add VITE_GEMINI_API_KEY in environment variables.';
  }

  const ai = new GoogleGenAI({ apiKey });

  const contextSummary = `CURRENT MORTGAGE SCENARIO DATA:
- Home Price: $${inputs.homePrice.toLocaleString()}
- Down Payment: $${results.downPaymentAmount.toLocaleString()} (${inputs.downPaymentValue}${inputs.downPaymentType === 'percentage' ? '%' : '$'})
- Net Financed Loan Principal: $${results.loanAmount.toLocaleString()}
- Loan Term: ${inputs.loanTermYears} years (${inputs.loanTermYears * 12} months)
- Interest Rate: ${inputs.interestRate}% APR
- Monthly Principal & Interest (P&I): $${Math.round(results.basePrincipalAndInterest).toLocaleString()}/month
- Monthly Property Tax (at ${inputs.propertyTaxRate}%): $${Math.round(results.monthlyPropertyTax).toLocaleString()}/month
- Monthly Home Insurance: $${Math.round(results.monthlyHomeInsurance).toLocaleString()}/month
- Initial Monthly PMI (at ${inputs.pmiRate}% rate): $${Math.round(results.initialMonthlyPmi).toLocaleString()}/month
- Monthly HOA Fees: $${inputs.hoaFees.toLocaleString()}/month
- Total Initial Monthly PITI+HOA: $${Math.round(results.totalInitialMonthlyPayment).toLocaleString()}/month
- Extra Payments Scheduled: Monthly +$${inputs.extraPaymentMonthly || 0}, Annual +$${inputs.extraPaymentAnnual || 0}
- Total Interest Paid over life: $${Math.round(results.totalInterestPaid).toLocaleString()}
- Total Mortgage Cost (Principal + Interest): $${Math.round(results.totalPaymentsCost).toLocaleString()}
- Projected Payoff Months: ${results.payoffTermMonths} months (${(results.payoffTermMonths / 12).toFixed(1)} years)
- Extra Payoff Savings: saves $${Math.round(results.interestSavings).toLocaleString()} and ${results.timeSavingsMonths} months`;

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Here is my current mortgage simulation context:\n\n${contextSummary}\n\nUser Question/Request: ${userPrompt}`,
        },
      ],
    },
  ];

  if (history.length > 0) {
    const formattedHistory = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));
    contents.unshift(...formattedHistory);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.25,
      },
    });

    return response.text || 'Unable to generate response.';
  } catch (err: any) {
    console.error('Gemini Mortgage Advisor Error:', err);
    return `Error consulting AI Mortgage Advisor: ${err.message || err}`;
  }
}
