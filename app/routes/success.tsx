import type { Route } from "./+types/success";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Payment Successful - NARA" },
    { name: "description", content: "Your payment was processed successfully." },
  ];
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-slate-900">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Thank you for your purchase. You should receive a confirmation email shortly.
            </p>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}