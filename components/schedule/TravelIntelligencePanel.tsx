"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  calculateTravelIntelligence,
  type TravelIntelligence,
  type SessionNeighbor,
} from "@/lib/travel";
import { cn } from "@/lib/utils";

interface TravelIntelligencePanelProps {
  proposedTime: Date | null;
  newClientName: string;
  newClientAddress: string | null;
  existingSessions: SessionNeighbor[];
}

const qualityConfig = {
  great: {
    label: "Great routing",
    color: "text-[#4ADE80]",
    bg: "bg-[#4ADE80]/10 border-[#4ADE80]/20",
  },
  ok: {
    label: "Moderate drive",
    color: "text-[#FACC15]",
    bg: "bg-[#FACC15]/10 border-[#FACC15]/20",
  },
  long: {
    label: "Long drive",
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10 border-[#EF4444]/20",
  },
};

export function TravelIntelligencePanel({
  proposedTime,
  newClientName,
  newClientAddress,
  existingSessions,
}: TravelIntelligencePanelProps) {
  const [intel, setIntel] = useState<TravelIntelligence | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proposedTime || !newClientName) {
      setIntel(null);
      return;
    }

    if (existingSessions.length === 0) {
      setIntel(null);
      return;
    }

    setLoading(true);
    calculateTravelIntelligence(
      proposedTime,
      newClientAddress,
      newClientName,
      existingSessions
    )
      .then((result) => {
        setIntel(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [
    proposedTime,
    newClientName,
    newClientAddress,
    existingSessions,
  ]);

  if (!loading && (!intel || (!intel.before && !intel.after))) return null;

  return (
    <div className="rounded-xl border border-[#3A3A3A] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] border-b border-[#3A3A3A]">
        <Navigation className="w-3.5 h-3.5 text-[#CCFF00]" />
        <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest">
          Travel Intelligence
        </span>
      </div>

      {loading ? (
        <div className="px-4 py-4 space-y-2 animate-pulse">
          <div className="w-48 h-3 bg-[#3A3A3A] rounded" />
          <div className="w-32 h-3 bg-[#3A3A3A] rounded" />
          <div className="w-40 h-3 bg-[#3A3A3A] rounded" />
        </div>
      ) : intel ? (
        <div className="px-4 py-4 space-y-3">
          <div className="space-y-2">
            {intel.before && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#A0A0A0]" />
                  {intel.travelToNew && (
                    <div className="w-px flex-1 bg-[#3A3A3A] my-1 min-h-[16px]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#A0A0A0] truncate">
                    {intel.before.clientName}
                  </p>
                  <p className="text-[10px] text-[#555] capitalize">
                    {intel.before.locationType ?? "Unknown location"}
                  </p>
                </div>
                {intel.travelToNew && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3 text-[#555]" />
                    <span className="text-xs text-[#A0A0A0]">
                      {intel.travelToNew.label}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]" />
                {intel.travelFromNew && (
                  <div className="w-px flex-1 bg-[#3A3A3A] my-1 min-h-[16px]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {newClientName}{" "}
                  <span className="text-[#555] font-normal">(new)</span>
                </p>
                {newClientAddress && (
                  <p className="text-[10px] text-[#555] truncate">
                    {newClientAddress}
                  </p>
                )}
              </div>
            </div>

            {intel.after && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#A0A0A0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#A0A0A0] truncate">
                    {intel.after.clientName}
                  </p>
                  <p className="text-[10px] text-[#555] capitalize">
                    {intel.after.locationType ?? "Unknown location"}
                  </p>
                </div>
                {intel.travelFromNew && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3 text-[#555]" />
                    <span className="text-xs text-[#A0A0A0]">
                      {intel.travelFromNew.label}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {intel.totalAddedMinutes > 0 && (
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border",
                qualityConfig[intel.quality].bg
              )}
            >
              <div className="flex items-center gap-2">
                <MapPin
                  className={`w-3.5 h-3.5 ${qualityConfig[intel.quality].color}`}
                />
                <span
                  className={`text-xs font-semibold ${qualityConfig[intel.quality].color}`}
                >
                  {qualityConfig[intel.quality].label}
                </span>
              </div>
              <span className="text-xs text-[#A0A0A0]">
                ~{intel.totalAddedMinutes} min total travel
              </span>
            </div>
          )}

          {!newClientAddress && (
            <p className="text-xs text-[#555] flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Add client address to see drive time estimates
            </p>
          )}

          {intel.openInMapsUrl && (
            <a
              href={intel.openInMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#3A3A3A] text-xs font-medium text-[#A0A0A0] hover:text-white hover:border-[#555] transition-all min-h-[36px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open route in Google Maps
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
