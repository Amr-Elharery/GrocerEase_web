import { useDocumentDirection } from "@/lib/useDocumentDirection";

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  useDocumentDirection();
  return <>{children}</>;
}
