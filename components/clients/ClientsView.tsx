"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Search } from "lucide-react";
import { ClientCard } from "./ClientCard";
import { ClientModal } from "./ClientModal";
import { TierGroupHeader } from "./TierGroupHeader";
import type { Client } from "@/types";

const TIER_ORDER: ("diamond" | "gold" | "silver")[] = [
  "diamond",
  "gold",
  "silver",
];

function groupByTier(clients: Client[]) {
  const groups: Record<"diamond" | "gold" | "silver", Client[]> = {
    diamond: [],
    gold: [],
    silver: [],
  };
  for (const c of clients) {
    if (c.tier in groups) {
      groups[c.tier].push(c);
    }
  }
  return TIER_ORDER.map((tier) => ({
    tier,
    clients: groups[tier],
  }));
}

export function ClientsView() {
  const [search, setSearch] = useState("");
  const [modalClient, setModalClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const supabase = createClient();
  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("tier_score", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Client[];
    },
  });

  const filtered = search.trim()
    ? clients.filter((c) =>
        c.full_name.toLowerCase().includes(search.toLowerCase())
      )
    : clients;
  const grouped = groupByTier(filtered);

  const openAdd = () => {
    setModalClient(null);
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setModalClient(client);
    setModalOpen(true);
  };

  const handleSaved = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]"
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-[#3A3A3A]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#3A3A3A] rounded" />
                  <div className="h-3 w-24 bg-[#3A3A3A] rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-[#3A3A3A] rounded mb-2" />
              <div className="h-3 w-3/4 bg-[#3A3A3A] rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl p-12 text-center">
          <p className="text-[#A0A0A0]">
            {search.trim()
              ? "No clients match your search."
              : "No clients yet. Add your first client to get started."}
          </p>
          {!search.trim() && (
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#B8E600] min-h-[44px]"
            >
              <UserPlus className="w-4 h-4" />
              Add Client
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ tier, clients: tierClients }) =>
            tierClients.length === 0 ? null : (
              <div key={tier}>
                <div className="mb-4">
                  <TierGroupHeader tier={tier} count={tierClients.length} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tierClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onEdit={() => openEdit(client)}
                      onDelete={async () => {
                        if (
                          typeof window !== "undefined" &&
                          window.confirm(
                            `Remove ${client.full_name}? This cannot be undone.`
                          )
                        ) {
                          await supabase
                            .from("clients")
                            .delete()
                            .eq("id", client.id);
                          refetch();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {modalOpen && (
        <ClientModal
          client={modalClient}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
