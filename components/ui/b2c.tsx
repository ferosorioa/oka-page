"use client";

import { useState } from "react";
import B2CClientCheckout from "./b2c_clients";
import B2CSalesCheckout from "./b2c_sales";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function B2CSalesProcess() {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  function handleNextStep(items: any, totalAmount: any) {
    setCartItems(items);
    setTotal(totalAmount);
    setStep(2);
  }

  function handlePreviousStep() {
    setStep(1);
  }

  function handleComplete() {
    setStep(1);
    setCartItems([]);
    setTotal(0);
  }

  return (
    <div className=" ">
      <div className="flex justify-between items-center mb-4  bg-muted p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold  text-white">Ventas B2C</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Step 1: Select Products" : "Step 2: Select or Add Client"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <B2CSalesCheckout onNext={() => handleNextStep(cartItems, total)} />
          ) : (
            <>
              <Button variant="outline" onClick={handlePreviousStep} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Products
              </Button>
              <B2CClientCheckout cartItems={cartItems} total={total} onComplete={handleComplete} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
