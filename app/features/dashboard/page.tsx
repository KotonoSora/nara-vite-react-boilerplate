import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { formatPrice } from '~/lib/stripe';
import { CreditCard, Package, Search, Calendar, Download } from 'lucide-react';

export function DashboardPage() {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearchCustomer = async () => {
    if (!customerEmail) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/payment/customers/by-email/${encodeURIComponent(customerEmail)}`);
      
      if (response.ok) {
        const data: any = await response.json();
        setCustomerData(data.customer);
        
        // Fetch subscriptions and orders
        const [subscriptionsRes, ordersRes] = await Promise.all([
          fetch(`/api/payment/subscriptions/${data.customer.id}`),
          fetch(`/api/payment/orders/${data.customer.id}`)
        ]);
        
        if (subscriptionsRes.ok && ordersRes.ok) {
          const subscriptionsData: any = await subscriptionsRes.json();
          const ordersData: any = await ordersRes.json();
          
          setCustomerData({
            ...data.customer,
            subscriptions: subscriptionsData.subscriptions,
            orders: ordersData.orders
          });
        }
      } else {
        setCustomerData(null);
        alert('Customer not found');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      alert('Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      const response = await fetch(`/api/payment/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });
      
      if (response.ok) {
        alert('Subscription will be canceled at the end of the current period');
        // Refresh customer data
        handleSearchCustomer();
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Dashboard</h1>
          <p className="text-slate-600">
            Enter your email to view your subscriptions and purchases.
          </p>
        </div>

        {/* Customer Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Account
            </CardTitle>
            <CardDescription>
              Enter your email address to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchCustomer()}
              />
              <Button onClick={handleSearchCustomer} disabled={loading || !customerEmail}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Data */}
        {customerData && (
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-900">{customerData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Name</label>
                    <p className="text-slate-900">{customerData.name || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Subscriptions and Orders */}
            <Tabs defaultValue="subscriptions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Subscriptions
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Orders
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions" className="space-y-4">
                {customerData.subscriptions?.length > 0 ? (
                  customerData.subscriptions.map((sub: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{sub.product?.name}</CardTitle>
                            <CardDescription>{sub.plan?.name}</CardDescription>
                          </div>
                          <Badge variant={
                            sub.subscription.status === 'active' ? 'default' :
                            sub.subscription.status === 'trialing' ? 'secondary' :
                            'destructive'
                          }>
                            {sub.subscription.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Price</label>
                            <p className="text-slate-900">
                              {formatPrice(sub.plan?.amount || 0)}/{sub.plan?.interval}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Current Period</label>
                            <p className="text-slate-900 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(sub.subscription.currentPeriodStart).toLocaleDateString()} - {' '}
                              {new Date(sub.subscription.currentPeriodEnd).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {sub.subscription.status === 'active' && !sub.subscription.cancelAtPeriodEnd && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleCancelSubscription(sub.subscription.id)}
                            className="w-full md:w-auto"
                          >
                            Cancel Subscription
                          </Button>
                        )}
                        
                        {sub.subscription.cancelAtPeriodEnd && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-800 text-sm">
                              This subscription will be canceled on {new Date(sub.subscription.currentPeriodEnd).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No active subscriptions found.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="orders" className="space-y-4">
                {customerData.orders?.length > 0 ? (
                  customerData.orders.map((order: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{order.product?.name}</CardTitle>
                            <CardDescription>{order.plan?.name}</CardDescription>
                          </div>
                          <Badge variant={
                            order.order.status === 'succeeded' ? 'default' :
                            order.order.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {order.order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Amount Paid</label>
                            <p className="text-slate-900">{formatPrice(order.order.amount)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Purchase Date</label>
                            <p className="text-slate-900">
                              {new Date(order.order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {order.order.status === 'succeeded' && order.order.accessGranted && (
                          <Button className="w-full md:w-auto">
                            <Download className="h-4 w-4 mr-2" />
                            Access Product
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No orders found.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}