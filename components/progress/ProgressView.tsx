"use client";

import { useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import { useProgressClients, useProgressRecords } from "@/hooks/useProgress";
import { ClientSelector } from "./ClientSelector";
import { ProgressCharts } from "./ProgressCharts";
import { ProgressTable } from "./ProgressTable";
import { AddProgressModal } from "./AddProgressModal";

export function ProgressView() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: clients = [], isLoading: clientsLoading } = useProgressClients();
  const { data: records = [], isLoading: recordsLoading } =
    useProgressRecords(selectedClientId);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        {selectedClientId && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#000000] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 min-h-[600px]">
        {/* Left: client selector */}
        <ClientSelector
          clients={clients}
          selectedId={selectedClientId}
          onSelect={setSelectedClientId}
          isLoading={clientsLoading}
        />

        {/* Right: charts + table */}
        <div className="space-y-5">
          {!selectedClientId ? (
            <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#CCFF00]" />
              </div>
              <p className="text-white font-semibold mb-1">Select a client</p>
              <p className="text-sm text-[#A0A0A0]">
                Choose a client from the list to view their progress
              </p>
            </div>
          ) : recordsLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl h-20"
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl h-52" />
                <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl h-52" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-white">
                  {selectedClient?.full_name}
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-[#CCFF00] hover:text-[#B8E600] font-medium transition-colors min-h-[44px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Record
                </button>
              </div>
              <ProgressCharts records={records} />
              {records.length > 0 && (
                <ProgressTable
                  records={records}
                  clientId={selectedClientId}
                />
              )}
            </>
          )}
        </div>
      </div>

      {modalOpen && selectedClientId && selectedClient && (
        <AddProgressModal
          clientId={selectedClientId}
          clientName={selectedClient.full_name}
          onClose={() => setModalOpen(false)}
          onSaved={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
