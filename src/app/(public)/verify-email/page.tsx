import { Suspense } from "react";
import { ConfirmEmailConmponent } from "@/app/(public)/verify-email/_components/confirme-email";

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto px-6 pt-6">
      <Suspense fallback={<div>Carregando...</div>}>
        <ConfirmEmailConmponent />
      </Suspense>
    </div>
  );
}
