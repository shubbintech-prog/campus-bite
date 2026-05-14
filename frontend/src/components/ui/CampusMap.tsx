import { MapPin, Building2, School, Landmark, Trees, ShieldAlert } from "lucide-react";

interface LandmarkData {
  name: string;
  icon: any;
  top: string;
  left: string;
}

const LANDMARKS: LandmarkData[] = [
  { name: "Library", icon: Building2, top: "50%", left: "45%" },
  { name: "School of Engineering", icon: School, top: "60%", left: "35%" },
  { name: "School of Environmental Studies", icon: School, top: "70%", left: "35%" },
  { name: "School of Management Studies", icon: School, top: "45%", left: "55%" },
  { name: "School of Technology", icon: School, top: "45%", left: "35%" },
  { name: "Activities Area", icon: Landmark, top: "65%", left: "65%" },
  { name: "Sports Complex", icon: School, top: "85%", left: "55%" },
  { name: "Main Gate", icon: ShieldAlert, top: "95%", left: "40%" }
];

interface CampusMapProps {
  selectedLandmark?: string;
  onLandmarkSelect?: (landmark: string) => void;
  highlightedVendors?: { name: string; landmark: string }[];
}

export default function CampusMap({ selectedLandmark, onLandmarkSelect, highlightedVendors }: CampusMapProps) {
  return (
    <div className="relative w-full aspect-video bg-muted/30 rounded-2xl border border-dashed border-border overflow-hidden card-shadow">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* Landmarks */}
      {LANDMARKS.map((landmark) => {
        const isSelected = selectedLandmark === landmark.name;
        const vendorsHere = highlightedVendors?.filter(v => v.landmark === landmark.name) || [];
        const hasVendors = vendorsHere.length > 0;

        return (
          <button
            key={landmark.name}
            onClick={() => onLandmarkSelect?.(landmark.name)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
              isSelected ? "z-20 scale-125" : "z-10 hover:scale-110"
            }`}
            style={{ top: landmark.top, left: landmark.left }}
          >
            <div className={`relative flex flex-col items-center gap-1`}>
              {/* Tooltip for Vendors */}
              {hasVendors && (
                <div className="absolute bottom-full mb-2 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {vendorsHere.length} Vendor{vendorsHere.length > 1 ? 's' : ''} here
                </div>
              )}

              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                isSelected 
                  ? "bg-primary text-primary-foreground shadow-primary/20" 
                  : hasVendors 
                    ? "bg-success/20 text-success border border-success/30" 
                    : "bg-background text-muted-foreground border border-border"
              }`}>
                <landmark.icon className="w-5 h-5" />
                {hasVendors && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded shadow-sm transition-colors ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}>
                {landmark.name}
              </span>
            </div>
          </button>
        );
      })}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Active Vendors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span>Campus Landmarks</span>
        </div>
      </div>
    </div>
  );
}
