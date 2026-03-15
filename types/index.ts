export type SubscriptionTier =
  | "free"
  | "professional"
  | "elite"
  | "studio";
export type ClientTier = "diamond" | "gold" | "silver";
export type SessionStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";
export type PaymentStatus = "unpaid" | "paid" | "waived";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type LocationType =
  | "home"
  | "gym"
  | "studio"
  | "park"
  | "online"
  | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  timezone: string;
  language: string;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: string;
  subscription_period_end: string | null;
  trial_ends_at: string | null;
  mileage_rate: number;
  default_session_duration: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  trainer_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  goal: string | null;
  health_conditions: string | null;
  fitness_level: FitnessLevel | null;
  preferred_location: LocationType | null;
  session_price: number;
  sessions_per_week: number;
  payment_model: "per_session" | "monthly" | "upfront";
  attendance_rate: number;
  tier: ClientTier;
  tier_score: number;
  status: "active" | "inactive" | "prospect";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  trainer_id: string | null;
  name: string;
  description: string | null;
  muscle_groups: string[];
  equipment: string[];
  difficulty: FitnessLevel | null;
  category: string | null;
  instructions: string | null;
  video_url: string | null;
  is_custom: boolean;
  wger_id: number | null;
  created_at: string;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  order_index: number;
  sets: number | null;
  reps: string | null;
  duration_seconds: number | null;
  rest_seconds: number;
  weight_notes: string | null;
  notes: string | null;
  exercise?: Exercise;
}

export interface Routine {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  focus_area: string | null;
  goal: string | null;
  difficulty: FitnessLevel | null;
  duration_minutes: number;
  warm_up: string | null;
  cool_down: string | null;
  notes: string | null;
  tags: string[];
  is_template: boolean;
  created_at: string;
  updated_at: string;
  routine_exercises?: RoutineExercise[];
}

export interface Session {
  id: string;
  trainer_id: string;
  client_id: string | null;
  routine_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  location_type: LocationType | null;
  price: number;
  payment_status: PaymentStatus;
  payment_method: string | null;
  status: SessionStatus;
  cancellation_reason: string | null;
  notes: string | null;
  trainer_notes: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  routine?: Routine;
}

export interface Payment {
  id: string;
  trainer_id: string;
  client_id: string | null;
  session_id: string | null;
  amount: number;
  currency: string;
  payment_date: string;
  payment_method: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  client?: Client;
}

export interface ProgressRecord {
  id: string;
  client_id: string;
  trainer_id: string;
  recorded_at: string;
  weight_lbs: number | null;
  body_fat_pct: number | null;
  skeletal_muscle_mass_lbs: number | null;
  visceral_fat_level: number | null;
  body_water_pct: number | null;
  bmi: number | null;
  chest_in: number | null;
  waist_in: number | null;
  hips_in: number | null;
  left_arm_in: number | null;
  right_arm_in: number | null;
  left_thigh_in: number | null;
  right_thigh_in: number | null;
  left_calf_in: number | null;
  right_calf_in: number | null;
  photo_front_url: string | null;
  photo_side_url: string | null;
  photo_back_url: string | null;
  notes: string | null;
  created_at: string;
}

export const TIER_LIMITS: Record<
  SubscriptionTier,
  { maxClients: number; features: string[] }
> = {
  free: {
    maxClients: 5,
    features: ["dashboard", "clients", "routines", "schedule", "progress"],
  },
  professional: {
    maxClients: Infinity,
    features: [
      "dashboard",
      "clients",
      "routines",
      "schedule",
      "progress",
      "analytics",
      "social_export",
      "route_optimization",
    ],
  },
  elite: {
    maxClients: Infinity,
    features: [
      "dashboard",
      "clients",
      "routines",
      "schedule",
      "progress",
      "analytics",
      "social_export",
      "route_optimization",
      "ai_scheduler",
    ],
  },
  studio: {
    maxClients: Infinity,
    features: [
      "dashboard",
      "clients",
      "routines",
      "schedule",
      "progress",
      "analytics",
      "social_export",
      "route_optimization",
      "ai_scheduler",
      "team_management",
      "white_label",
    ],
  },
};
