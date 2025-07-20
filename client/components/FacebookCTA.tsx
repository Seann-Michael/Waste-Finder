import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Users } from "lucide-react";

interface FacebookCTAProps {
  facebookUrl?: string;
  className?: string;
}

export default function FacebookCTA({
  facebookUrl,
  className = "",
}: FacebookCTAProps) {
  if (!facebookUrl) {
    return null;
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Facebook className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Join Our Community!
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Connect with other waste management professionals and get tips,
              updates, and industry insights.
            </p>
            <Button
              onClick={() => window.open(facebookUrl, "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Facebook Group
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
