import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  ChevronLeft,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  X,
  FileText,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface ColumnMapping {
  csvColumn: string;
  systemField: string;
}

const systemFields = [
  { value: "", label: "Skip this column" },
  { value: "name", label: "Location Name" },
  { value: "address", label: "Street Address" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "zipCode", label: "ZIP Code" },
  { value: "phone", label: "Phone Number" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "facilityType", label: "Location Type" },
  { value: "paymentTypes", label: "Payment Methods" },
  { value: "debrisTypes", label: "Debris Types" },
  { value: "operatingHours", label: "Operating Hours" },
  { value: "notes", label: "Notes" },
];

export default function BulkUploadFacilities() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadResults(null);
      setValidationErrors([]);
      setShowMapping(false);
      parseCsvFile(file);
    }
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      const data = lines.map((line) => {
        // Simple CSV parsing - would need more robust parsing for production
        return line.split(",").map((cell) => cell.trim().replace(/"/g, ""));
      });
      setCsvData(data);

      // Initialize column mappings with smart defaults
      if (data.length > 0) {
        const headers = data[0];
        const mappings = headers.map((header) => {
          const smartMapping = getSmartMapping(header.toLowerCase());
          return {
            csvColumn: header,
            systemField: smartMapping,
          };
        });
        setColumnMappings(mappings);
        setShowMapping(true);
      }
    };
    reader.readAsText(file);
  };

  const getSmartMapping = (header: string): string => {
    const mappings: { [key: string]: string } = {
      name: "name",
      "location name": "name",
      facility: "name",
      "facility name": "name",
      address: "address",
      "street address": "address",
      city: "city",
      state: "state",
      zip: "zipCode",
      zipcode: "zipCode",
      "zip code": "zipCode",
      postal: "zipCode",
      phone: "phone",
      "phone number": "phone",
      email: "email",
      website: "website",
      url: "website",
      type: "facilityType",
      "facility type": "facilityType",
      "location type": "facilityType",
      payment: "paymentTypes",
      "payment methods": "paymentTypes",
      "payment types": "paymentTypes",
      debris: "debrisTypes",
      "debris types": "debrisTypes",
      waste: "debrisTypes",
      hours: "operatingHours",
      "operating hours": "operatingHours",
      notes: "notes",
      description: "notes",
    };

    return mappings[header] || "";
  };

  const updateColumnMapping = (index: number, systemField: string) => {
    const updatedMappings = [...columnMappings];
    updatedMappings[index].systemField = systemField;
    setColumnMappings(updatedMappings);
  };

  const handleUpload = async () => {
    if (!uploadedFile || !showMapping) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Mock API call with column mappings
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mock validation results
      const mockResults = {
        totalRows: csvData.length - 1, // Exclude header
        successfulImports: Math.max(0, csvData.length - 1 - 7),
        errors: 7,
        warnings: 12,
        duplicates: 3,
      };

      const mockErrors = [
        {
          row: 5,
          field: "zipCode",
          value: "invalid_zip",
          error: "Invalid ZIP code format",
        },
        {
          row: 12,
          field: "facilityType",
          value: "waste_center",
          error:
            "Invalid location type. Must be: landfill, transfer_station, or construction_landfill",
        },
        {
          row: 23,
          field: "phone",
          value: "123-456",
          error: "Phone number must be in format (XXX) XXX-XXXX",
        },
        {
          row: 45,
          field: "email",
          value: "invalid-email",
          error: "Invalid email format",
        },
        {
          row: 67,
          field: "address",
          value: "",
          error: "Address is required",
        },
      ];

      setUploadResults(mockResults);
      setValidationErrors(mockErrors);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Updated template with location terminology
    const csvContent = `name,address,city,state,zipCode,phone,email,website,facilityType,paymentTypes,debrisTypes,operatingHours,notes
"Sample Landfill","123 Main St","Springfield","IL","62701","(555) 123-4567","info@sample.com","https://sample.com","landfill","Cash,Credit Card","General Waste,Yard Waste","Mon-Fri 7AM-5PM","Sample notes"
"Sample Transfer Station","456 Oak Ave","Springfield","IL","62702","(555) 987-6543","contact@transfer.com","","transfer_station","Cash,Check","General Waste,Electronics","Mon-Sat 6AM-6PM","Transfer station example"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "location_upload_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild>
              <Link to="/admin">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Bulk Upload Locations</h1>
              <p className="text-muted-foreground">
                Upload multiple locations at once using CSV or Excel files
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload File
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">
                      Select CSV or Excel file (.csv, .xlsx, .xls)
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      className="mt-2"
                    />
                  </div>

                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                          {csvData.length > 0 ? csvData.length - 1 : 0} data
                          rows
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setShowMapping(false);
                          setCsvData([]);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading and validating...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpload}
                      disabled={!showMapping || isUploading}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Processing..." : "Upload & Validate"}
                    </Button>
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="w-4 h-4 mr-2" />
                      Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Column Mapping */}
              {showMapping && csvData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Column Mapping
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Map your CSV columns to system fields. Mappings are
                      auto-detected but can be adjusted.
                    </p>
                    <div className="space-y-3">
                      {columnMappings.map((mapping, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {mapping.csvColumn}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Sample:{" "}
                              {csvData[1] && csvData[1][index]
                                ? csvData[1][index]
                                : "N/A"}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <Select
                              value={mapping.systemField}
                              onValueChange={(value) =>
                                updateColumnMapping(index, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {systemFields.map((field) => (
                                  <SelectItem
                                    key={field.value}
                                    value={field.value}
                                  >
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Results */}
              {uploadResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {uploadResults.totalRows}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Rows
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {uploadResults.successfulImports}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Imported
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {uploadResults.errors}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Errors
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {uploadResults.warnings}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Warnings
                        </div>
                      </div>
                    </div>

                    {uploadResults.errors > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {uploadResults.errors} rows had errors and were not
                          imported. Review the error details below.
                        </AlertDescription>
                      </Alert>
                    )}

                    {uploadResults.successfulImports > 0 && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Successfully imported{" "}
                          {uploadResults.successfulImports} locations into the
                          database.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Validation Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Field</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationErrors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{error.field}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {error.value || "(empty)"}
                            </TableCell>
                            <TableCell className="text-red-600">
                              {error.error}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">File Format</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• CSV, XLSX, or XLS files supported</li>
                      <li>• Maximum file size: 10 MB</li>
                      <li>• First row must contain headers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Fields</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• name</li>
                      <li>• address</li>
                      <li>• city</li>
                      <li>• state</li>
                      <li>• zipCode</li>
                      <li>• facilityType</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Location Types</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• landfill</li>
                      <li>• transfer_station</li>
                      <li>• construction_landfill</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Template Download */}
              <Card>
                <CardHeader>
                  <CardTitle>Sample Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a sample CSV template with example data and proper
                    formatting.
                  </p>
                  <Button onClick={downloadTemplate} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
