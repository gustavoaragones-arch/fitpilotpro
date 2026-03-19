"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/DatePicker";
import { useAddProgressRecord } from "@/hooks/useProgress";

const schema = z.object({
  recorded_at: z.string().min(1, "Required"),
  weight_lbs: z.number().positive().nullish(),
  body_fat_pct: z.number().min(0).max(100).nullish(),
  skeletal_muscle_mass_lbs: z.number().positive().nullish(),
  waist_in: z.number().positive().nullish(),
  chest_in: z.number().positive().nullish(),
  hips_in: z.number().positive().nullish(),
  left_arm_in: z.number().positive().nullish(),
  right_arm_in: z.number().positive().nullish(),
  left_thigh_in: z.number().positive().nullish(),
  right_thigh_in: z.number().positive().nullish(),
  left_calf_in: z.number().positive().nullish(),
  right_calf_in: z.number().positive().nullish(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 min-h-[44px]";

function NumField({
  label,
  name,
  register,
  error,
}: {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
        {label}
      </label>
      <input
        {...register(name, { valueAsNumber: true })}
        type="number"
        step="0.1"
        min="0"
        className={inputCls}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}

interface AddProgressModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AddProgressModal({
  clientId,
  clientName,
  onClose,
  onSaved,
}: AddProgressModalProps) {
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addRecord = useAddProgressRecord();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      recorded_at: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const recordedAt = watch("recorded_at");

  const coerce = (v: number | null | undefined): number | null => {
    if (v === null || v === undefined || isNaN(v as number)) return null;
    return v as number;
  };

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await addRecord.mutateAsync({
        client_id: clientId,
        recorded_at: data.recorded_at,
        weight_lbs: coerce(data.weight_lbs),
        body_fat_pct: coerce(data.body_fat_pct),
        skeletal_muscle_mass_lbs: coerce(data.skeletal_muscle_mass_lbs),
        waist_in: coerce(data.waist_in),
        chest_in: coerce(data.chest_in),
        hips_in: coerce(data.hips_in),
        left_arm_in: coerce(data.left_arm_in),
        right_arm_in: coerce(data.right_arm_in),
        left_thigh_in: coerce(data.left_thigh_in),
        right_thigh_in: coerce(data.right_thigh_in),
        left_calf_in: coerce(data.left_calf_in),
        right_calf_in: coerce(data.right_calf_in),
        notes: data.notes || null,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3A3A] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Add Progress Record</h2>
            <p className="text-xs text-[#A0A0A0] mt-0.5">{clientName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-6 py-5 space-y-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
                Date *
              </label>
              <DatePicker
                value={recordedAt ?? ""}
                onChange={(v) => setValue("recorded_at", v)}
                error={!!errors.recorded_at}
              />
              {errors.recorded_at && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.recorded_at.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumField
                label="Weight (lbs)"
                name="weight_lbs"
                register={register}
              />
              <NumField
                label="Body Fat %"
                name="body_fat_pct"
                register={register}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumField
                label="Muscle Mass (lbs)"
                name="skeletal_muscle_mass_lbs"
                register={register}
              />
              <NumField
                label="Waist (in)"
                name="waist_in"
                register={register}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
                Notes
              </label>
              <textarea
                {...register("notes")}
                placeholder="Observations, context..."
                rows={2}
                className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 resize-none"
              />
            </div>

            {/* More measurements */}
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-[#CCFF00] hover:text-[#B8E600] transition-colors min-h-[44px]"
            >
              {showMore ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {showMore ? "Hide" : "More"} measurements
            </button>

            {showMore && (
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Chest (in)" name="chest_in" register={register} />
                <NumField label="Hips (in)" name="hips_in" register={register} />
                <NumField label="Left Arm (in)" name="left_arm_in" register={register} />
                <NumField label="Right Arm (in)" name="right_arm_in" register={register} />
                <NumField label="Left Thigh (in)" name="left_thigh_in" register={register} />
                <NumField label="Right Thigh (in)" name="right_thigh_in" register={register} />
                <NumField label="Left Calf (in)" name="left_calf_in" register={register} />
                <NumField label="Right Calf (in)" name="right_calf_in" register={register} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#3A3A3A] shrink-0 flex items-center justify-between gap-3">
            {error ? (
              <p className="text-sm text-[#EF4444] flex-1">{error}</p>
            ) : (
              <div className="flex-1" />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[#A0A0A0] hover:text-white border border-[#3A3A3A] hover:border-[#555] rounded-lg transition-all min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold bg-[#CCFF00] text-[#000000] rounded-lg hover:bg-[#B8E600] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
