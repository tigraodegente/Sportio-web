"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ProgressBar } from "./ProgressBar";
import { StepPersona, type PersonaId } from "./StepPersona";
import { StepSports } from "./StepSports";
import { StepLevel, type LevelValue, type SportWithLevel } from "./StepLevel";
import { StepLocation } from "./StepLocation";

// Confetti particles for completion
function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 2,
        size: 4 + Math.random() * 8,
        color: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ][Math.floor(Math.random() * 6)],
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: 0,
            rotate: 360 + Math.random() * 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

const PERSONA_NEEDS_SPORTS: PersonaId[] = ["athlete", "bettor"];

function getRedirectPath(personas: PersonaId[]): string {
  if (personas.includes("athlete")) return "/dashboard";
  if (personas.includes("fan")) return "/dashboard";
  if (personas.includes("organizer")) return "/tournaments/create";
  if (personas.includes("brand")) return "/brand";
  if (personas.includes("bettor")) return "/bets";
  if (personas.includes("referee")) return "/dashboard";
  return "/dashboard";
}

export function OnboardingWizard() {
  const router = useRouter();

  // State
  const [selectedPersonas, setSelectedPersonas] = useState<PersonaId[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [sportsWithLevel, setSportsWithLevel] = useState<SportWithLevel[]>([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Determine which steps are applicable
  const needsSportsStep = selectedPersonas.some((p) =>
    PERSONA_NEEDS_SPORTS.includes(p)
  );
  const needsLevelStep = needsSportsStep && selectedSports.length > 0;

  // Build the ordered steps
  const steps = useMemo(() => {
    const s = ["persona"];
    if (needsSportsStep) s.push("sports");
    if (needsLevelStep) s.push("level");
    s.push("location");
    return s;
  }, [needsSportsStep, needsLevelStep]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex] ?? "persona";
  const totalSteps = steps.length;

  // tRPC
  const sportsQuery = trpc.sport.list.useQuery(undefined, {
    enabled: needsSportsStep,
  });
  const addRoleMutation = trpc.user.addRole.useMutation();
  const addSportMutation = trpc.user.addSport.useMutation();
  const updateProfileMutation = trpc.user.updateProfile.useMutation();

  // Handlers
  const togglePersona = useCallback((id: PersonaId) => {
    setSelectedPersonas((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const toggleSport = useCallback(
    (sportId: string) => {
      setSelectedSports((prev) => {
        const next = prev.includes(sportId)
          ? prev.filter((s) => s !== sportId)
          : [...prev, sportId];

        // Sync sportsWithLevel
        const sports = sportsQuery.data ?? [];
        setSportsWithLevel(
          next.map((id) => {
            const existing = sportsWithLevel.find((s) => s.sportId === id);
            const sport = sports.find((s) => s.id === id);
            return {
              sportId: id,
              sportName: sport?.name ?? "",
              level: existing?.level ?? ("C" as LevelValue),
            };
          })
        );

        return next;
      });
    },
    [sportsQuery.data, sportsWithLevel]
  );

  const setLevel = useCallback((sportId: string, level: LevelValue) => {
    setSportsWithLevel((prev) =>
      prev.map((s) => (s.sportId === sportId ? { ...s, level } : s))
    );
  }, []);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "persona":
        return selectedPersonas.length > 0;
      case "sports":
        return true; // Sports step is optional (can skip)
      case "level":
        return true; // Level defaults are set
      case "location":
        return true; // Location is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleComplete = async () => {
    setSaving(true);

    try {
      // Save roles
      for (const persona of selectedPersonas) {
        await addRoleMutation.mutateAsync({ role: persona });
      }

      // Save sports with levels
      for (const sport of sportsWithLevel) {
        await addSportMutation.mutateAsync({
          sportId: sport.sportId,
          level: sport.level,
        });
      }

      // Save location
      if (city || state) {
        await updateProfileMutation.mutateAsync({
          city: city || undefined,
          state: state || undefined,
        });
      }

      // Show confetti
      setShowConfetti(true);
      toast.success("Perfil configurado com sucesso!");

      // Redirect after a short delay for confetti
      setTimeout(() => {
        const path = getRedirectPath(selectedPersonas);
        router.push(path);
        router.refresh();
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar perfil";
      toast.error(message);
      setSaving(false);
    }
  };

  const isOptionalStep = currentStep === "sports" || currentStep === "location";
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/80 flex flex-col">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 py-4">
        <ProgressBar currentStep={currentStepIndex + 1} totalSteps={totalSteps} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:items-center">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {currentStep === "persona" && (
              <StepPersona
                key="persona"
                selectedPersonas={selectedPersonas}
                onToggle={togglePersona}
              />
            )}
            {currentStep === "sports" && (
              <StepSports
                key="sports"
                sports={sportsQuery.data ?? []}
                selectedSports={selectedSports}
                onToggle={toggleSport}
              />
            )}
            {currentStep === "level" && (
              <StepLevel
                key="level"
                sportsWithLevel={sportsWithLevel}
                onSetLevel={setLevel}
              />
            )}
            {currentStep === "location" && (
              <StepLocation
                key="location"
                city={city}
                state={state}
                onCityChange={setCity}
                onStateChange={setState}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-sm border-t border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {currentStepIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={handleBack}
              disabled={saving}
            >
              Voltar
            </Button>
          )}

          {isOptionalStep && !isLastStep && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleSkip}
              disabled={saving}
            >
              Pular
            </Button>
          )}

          <Button
            type="button"
            size="lg"
            className="flex-1"
            onClick={handleNext}
            disabled={!canProceed() || saving}
            loading={saving}
          >
            {isLastStep ? "Concluir" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
