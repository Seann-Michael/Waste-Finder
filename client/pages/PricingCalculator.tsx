import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  DollarSign,
  Truck,
  Settings,
  Save,
  Copy,
  Download,
  Plus,
  Minus,
} from "lucide-react";

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
  notes: string;
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
    notes: "",
  });

  const [savedConfigs, setSavedConfigs] = useState<Array<{name: string, config: PricingConfig}>>([]);

  useEffect(() => {
    // Load saved configuration from localStorage
    const saved = localStorage.getItem('junk-removal-pricing-config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }

    const savedList = localStorage.getItem('junk-removal-saved-configs');
    if (savedList) {
      setSavedConfigs(JSON.parse(savedList));
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
    const fuelCost = estimate.distance * 2 * config.fuelCostPerMile; // Round trip
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

  const generateQuote = () => {
    const quote = `
JUNK REMOVAL ESTIMATE

Customer: ___________________
Date: ${new Date().toLocaleDateString()}

Job Details:
• Volume: ${estimate.cubicYards} cubic yards
• Waste Type: ${estimate.wasteType.charAt(0).toUpperCase() + estimate.wasteType.slice(1)}
• Distance: ${estimate.distance} miles
• Labor Hours: ${estimate.laborHours}

Pricing Breakdown:
• Base Service Fee: $${pricing.baseServiceFee.toFixed(2)}
• Volume (${estimate.cubicYards} yd³ × $${config.cubicYardRate}): $${pricing.volumeCost.toFixed(2)}
• Labor (${estimate.laborHours}h × $${config.laborRate}): $${pricing.laborCost.toFixed(2)}
• Travel/Fuel: $${pricing.fuelCost.toFixed(2)}
• Dump Fee: $${pricing.dumpFee.toFixed(2)}
• Additional Fees: $${pricing.additionalFees.toFixed(2)}

Subtotal: $${pricing.subtotal.toFixed(2)}
Profit Margin (${config.profitMargin}%): $${pricing.profitAmount.toFixed(2)}

TOTAL: $${pricing.total.toFixed(2)}

Notes: ${estimate.notes}

This estimate is valid for 30 days.
    `;

    navigator.clipboard.writeText(quote);
    alert('Quote copied to clipboard!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pricing Calculator</h1>
            <p className="text-muted-foreground">
              Configure your costs and calculate job estimates for junk removal services
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
                <Settings className="w-5 h-5" />
                Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dump Fees */}
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
                  <div>
                    <Label htmlFor="hazardous">Hazardous ($)</Label>
                    <Input
                      id="hazardous"
                      type="number"
                      value={config.dumpFees.hazardous}
                      onChange={(e) => setConfig({
                        ...config,
                        dumpFees: { ...config.dumpFees, hazardous: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="electronics">Electronics ($)</Label>
                    <Input
                      id="electronics"
                      type="number"
                      value={config.dumpFees.electronics}
                      onChange={(e) => setConfig({
                        ...config,
                        dumpFees: { ...config.dumpFees, electronics: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rates */}
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
                <div>
                  <Label htmlFor="fuelCost">Fuel Cost per Mile ($)</Label>
                  <Input
                    id="fuelCost"
                    type="number"
                    step="0.01"
                    value={config.fuelCostPerMile}
                    onChange={(e) => setConfig({ ...config, fuelCostPerMile: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="baseServiceFee">Base Service Fee ($)</Label>
                  <Input
                    id="baseServiceFee"
                    type="number"
                    value={config.baseServiceFee}
                    onChange={(e) => setConfig({ ...config, baseServiceFee: Number(e.target.value) })}
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEstimate({ ...estimate, cubicYards: Math.max(0, estimate.cubicYards - 0.5) })}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      id="cubicYards"
                      type="number"
                      step="0.5"
                      value={estimate.cubicYards}
                      onChange={(e) => setEstimate({ ...estimate, cubicYards: Number(e.target.value) })}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEstimate({ ...estimate, cubicYards: estimate.cubicYards + 0.5 })}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="wasteType">Waste Type</Label>
                  <Select
                    value={estimate.wasteType}
                    onValueChange={(value) => setEstimate({ ...estimate, wasteType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="hazardous">Hazardous</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>

              <div>
                <Label htmlFor="additionalFees">Additional Fees ($)</Label>
                <Input
                  id="additionalFees"
                  type="number"
                  value={estimate.additionalFees}
                  onChange={(e) => setEstimate({ ...estimate, additionalFees: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Special requirements, access issues, etc."
                  value={estimate.notes}
                  onChange={(e) => setEstimate({ ...estimate, notes: e.target.value })}
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
                <div className="flex justify-between">
                  <span>Dump Fee:</span>
                  <span className="font-medium">${pricing.dumpFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Fees:</span>
                  <span className="font-medium">${pricing.additionalFees.toFixed(2)}</span>
                </div>
                <Separator />
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
                  <div className="text-muted-foreground mb-4">Total Job Price</div>
                  <div className="space-y-2">
                    <Button onClick={generateQuote} className="w-full">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Quote
                    </Button>
                    <Badge variant="outline" className="text-xs">
                      Per cubic yard: ${(pricing.total / Math.max(estimate.cubicYards, 1)).toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volume Reference Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Volume Reference Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Small Jobs (1-3 yd³)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Single room cleanout</li>
                  <li>• Small furniture pieces</li>
                  <li>• Appliance removal</li>
                  <li>• Yard debris cleanup</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Medium Jobs (4-8 yd³)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Garage cleanout</li>
                  <li>• Multiple rooms</li>
                  <li>• Basement/attic clearing</li>
                  <li>• Small renovation debris</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Large Jobs (9+ yd��)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Whole house cleanouts</li>
                  <li>• Construction debris</li>
                  <li>• Estate cleanouts</li>
                  <li>• Commercial cleanouts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
