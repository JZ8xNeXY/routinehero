interface CharacterSelectProps {
  data: {
    members: Array<{
      name: string;
      age: number;
      role: "parent" | "child";
      characterId?: string;
    }>;
  };
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: any) => void;
}

export default function CharacterSelect({
  onNext,
}: CharacterSelectProps) {
  // Skip character selection - not required for children
  onNext();
  return null;
}
