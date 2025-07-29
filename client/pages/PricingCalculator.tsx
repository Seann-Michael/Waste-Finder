import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Save } from "lucide-react";

interface PricingConfig {
  dumpFees: {
    municipal: number;
    construction: number;
    hazardous: number;
    electronics: number;
  };
  laborRate: number;
  cubicYardRate: number;
  fuelCostPerMile: number;
  baseServiceFee: number;
  profitMargin: number;
}

interface JobEstimate {
  cubicYards: number;
  wasteType: string;
  distance: number;
  laborHours: number;
  additionalFees: number;
}

export default function PricingCalculator() {
  const [config, setConfig] = useState<PricingConfig>({
    dumpFees: {
      municipal: 45,
      construction: 65,
      hazardous: 120,
      electronics: 35,
    },
    laborRate: 25,
    cubicYardRate: 85,
    fuelCostPerMile: 0.65,
    baseServiceFee: 50,
    profitMargin: 35,
  });

  const [estimate, setEstimate] = useState<JobEstimate>({
    cubicYards: 0,
    wasteType: "municipal",
    distance: 0,
    laborHours: 1,
    additionalFees: 0,
  });

  useEffect(() => {
    // Load saved configuration from localStorage
    const saved = localStorage.getItem('junk-removal-pricing-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem('junk-removal-pricing-config', JSON.stringify(config));
    alert('Configuration saved successfully!');
  };

  const calculateJobPrice = () => {
    const dumpFee = config.dumpFees[estimate.wasteType as keyof typeof config.dumpFees];
    const volumeCost = estimate.cubicYards * config.cubicYardRate;
    const laborCost = estimate.laborHours * config.laborRate;
    const fuelCost = estimate.distance * 2 * config.fuelCostPerMile;
    const subtotal = config.baseServiceFee + volumeCost + laborCost + fuelCost + dumpFee + estimate.additionalFees;
    const profitAmount = subtotal * (config.profitMargin / 100);
    const total = subtotal + profitAmount;

    return {
      baseServiceFee: config.baseServiceFee,
      volumeCost,
      laborCost,
      fuelCost,
      dumpFee,
      additionalFees: estimate.additionalFees,
      subtotal,
      profitAmount,
      total,
    };
  };

  const pricing = calculateJobPrice();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Junk Removal Pricing Calculator</h1>
              <p className="text-muted-foreground">
                Free tool for junk removal business owners to calculate job estimates and pricing
              </p>
            </div>
            <Button onClick={saveConfig}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Pricing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Dump Fees</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="municipal">Municipal ($)</Label>
                      <Input
                        id="municipal"
                        type="number"
                        value={config.dumpFees.municipal}
                        onChange={(e) => setConfig({
                          ...config,
                          dumpFees: { ...config.dumpFees, municipal: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="construction">Construction ($)</Label>
                      <Input
                        id="construction"
                        type="number"
                        value={config.dumpFees.construction}
                        onChange={(e) => setConfig({
                          ...config,
                          dumpFees: { ...config.dumpFees, construction: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cubicYardRate">Price per Cubic Yard ($)</Label>
                    <Input
                      id="cubicYardRate"
                      type="number"
                      value={config.cubicYardRate}
                      onChange={(e) => setConfig({ ...config, cubicYardRate: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="laborRate">Labor Rate per Hour ($)</Label>
                    <Input
                      id="laborRate"
                      type="number"
                      value={config.laborRate}
                      onChange={(e) => setConfig({ ...config, laborRate: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    value={config.profitMargin}
                    onChange={(e) => setConfig({ ...config, profitMargin: Number(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Estimator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Job Estimator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cubicYards">Cubic Yards</Label>
                    <Input
                      id="cubicYards"
                      type="number"
                      step="0.5"
                      value={estimate.cubicYards}
                      onChange={(e) => setEstimate({ ...estimate, cubicYards: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="distance">Distance (miles)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={estimate.distance}
                      onChange={(e) => setEstimate({ ...estimate, distance: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="laborHours">Labor Hours</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    step="0.5"
                    value={estimate.laborHours}
                    onChange={(e) => setEstimate({ ...estimate, laborHours: Number(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Price Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Service Fee:</span>
                    <span className="font-medium">${pricing.baseServiceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume ({estimate.cubicYards} yd³):</span>
                    <span className="font-medium">${pricing.volumeCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor ({estimate.laborHours}h):</span>
                    <span className="font-medium">${pricing.laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel/Fuel:</span>
                    <span className="font-medium">${pricing.fuelCost.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit ({config.profitMargin}%):</span>
                    <span className="font-medium text-green-600">${pricing.profitAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-primary/5 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${pricing.total.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Total Job Price</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
