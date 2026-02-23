"use client";

import { useState } from "react";
import { Box, Container, Paper, Stepper, Step, StepLabel } from "@mui/material";
import Welcome from "@/components/onboarding/steps/Welcome";
import ParentSetup from "@/components/onboarding/steps/ParentSetup";
import AddParents from "@/components/onboarding/steps/AddParents";
import AddKids from "@/components/onboarding/steps/AddKids";
import CharacterSelect from "@/components/onboarding/steps/CharacterSelect";
import HabitSelect from "@/components/onboarding/steps/HabitSelect";

const steps = [
  "Welcome",
  "Family Info",
  "Add Parents",
  "Add Kids",
  "Characters",
  "Habits",
];

export default function OnboardingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    familyName: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: "en",
    members: [] as Array<{
      name: string;
      age: number;
      role: "parent" | "child";
      characterId?: string;
    }>,
    habits: [] as string[],
  });

  const handleNext = () => {
    console.log("OnboardingPage: handleNext called, current step:", activeStep);
    setActiveStep((prev) => {
      const next = prev + 1;
      console.log("OnboardingPage: moving to step:", next);
      return next;
    });
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Welcome onNext={handleNext} />;
      case 1:
        return (
          <ParentSetup
            data={formData}
            onNext={handleNext}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <AddParents
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <AddKids
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateFormData}
          />
        );
      case 4:
        return (
          <CharacterSelect
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateFormData}
          />
        );
      case 5:
        return (
          <HabitSelect
            data={formData}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4 }}>
          {renderStep()}
        </Paper>
      </Box>
    </Container>
  );
}
