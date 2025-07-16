import React from 'react';
import { formatPrice } from '~/lib/stripe';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Check } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  type: string;
  interval?: string;
  amount: number;
  currency: string;
  trialPeriodDays?: number;
  features: string[];
  limits: Record<string, any>;
  sortOrder: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  category?: string;
  features: string[];
  plans: Plan[];
}

interface PricingPageProps {
  products: Product[];
}

export function PricingPage({ products }: PricingPageProps) {
  const handleGetStarted = async (planId: number) => {
    try {
      // For demo purposes, we'll use a simple checkout flow
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data: any = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start your free trial today.
          </p>
        </div>

        {products.map((product) => (
          <div key={product.id} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {product.name}
              </h2>
              <p className="text-lg text-slate-600 mb-4">
                {product.description}
              </p>
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            </div>

            {product.type === 'saas' ? (
              <SaasPricingGrid product={product} onGetStarted={handleGetStarted} />
            ) : (
              <OneTimePricingCard product={product} onGetStarted={handleGetStarted} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SaasPricingGrid({ product, onGetStarted }: { 
  product: Product; 
  onGetStarted: (planId: number) => void;
}) {
  const monthlyPlans = product.plans.filter(plan => plan.interval === 'month');
  const yearlyPlans = product.plans.filter(plan => plan.interval === 'year');
  
  const [billingInterval, setBillingInterval] = React.useState<'monthly' | 'yearly'>('monthly');
  const plans = billingInterval === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <>
      {/* Billing Toggle */}
      {yearlyPlans.length > 0 && (
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200 p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setBillingInterval('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'yearly'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setBillingInterval('yearly')}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600">Save 17%</span>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={plan.id} className={`relative ${
            index === 1 ? 'border-blue-500 shadow-lg scale-105' : 'border-slate-200'
          }`}>
            {index === 1 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{formatPrice(plan.amount)}</span>
                <span className="text-slate-600">/{plan.interval}</span>
              </div>
              {plan.trialPeriodDays && (
                <CardDescription className="text-green-600 font-medium">
                  {plan.trialPeriodDays}-day free trial
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={index === 1 ? "default" : "outline"}
                onClick={() => onGetStarted(plan.id)}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function OneTimePricingCard({ product, onGetStarted }: { 
  product: Product; 
  onGetStarted: (planId: number) => void;
}) {
  const plan = product.plans[0]; // Assuming one-time products have a single plan

  if (!plan) return null;

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold">{formatPrice(plan.amount)}</span>
            <span className="text-slate-600"> one-time</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => onGetStarted(plan.id)}
          >
            Purchase Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}