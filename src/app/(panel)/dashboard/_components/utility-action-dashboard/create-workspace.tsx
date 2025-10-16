"use client"
import { useRef, useState } from "react";
import { Step, Stepper } from "@/components/ui/stepper";
import { toast } from "sonner";
import { WorkspaceStepForm } from "./workspace-step-form";
import { useWorkspace, WorkspaceFormData } from "./use-workspace-form";
import { isSuccessResponse } from "@/utils/error-handler";
import { UserSearch, UserSearchRef } from "@/components/user-search";
import { useCreateWorkspace } from "@/hooks/use-workspace";

export type UserSearchType = {
  id: string,
  name: string | null,
  email: string,
  image: string | null
}

export function CreateWorkspace({ setClose }: { setClose: (value: boolean) => void }) {
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const [firstStepData, setFirstStepData] = useState<WorkspaceFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const userSearchRef = useRef<UserSearchRef>(null);
  const form = useWorkspace({});
  const createWorkspace = useCreateWorkspace();



  const onSubmit = async () => {
    setLoading(true);
    try {
      if (firstStepData?.title === undefined) {
        return;
      }
      const ids = selectedUsers.map(user => user.id);
      const response = await createWorkspace.mutateAsync({
        title: firstStepData?.title,
        invitationUsersId: ids,
        revalidatePaths: ["/dashboard", "/dashboard/Workspaces"]
      });
      if (!isSuccessResponse(response)) {
        toast.error("Erro ao cadastrar Workspace");
        return;
      }
      toast.success("Workspace cadastrada com sucesso!");
      form.reset();
      setSelectedUsers([]);
      setFirstStepData(undefined);
      setClose(false);
      userSearchRef.current?.reset();
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="">
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary">
        </div>
      )}
      <Stepper
        onStepChange={(step) => {
          if (step === 2) {
            const values = form.getValues()
            setFirstStepData(values)
          }
        }}
        onFinalStepCompleted={async () => onSubmit()}
      >

        <Step>
          {({ next, canProceed }) => (
            <WorkspaceStepForm
              form={form}
              canProceed={canProceed}
            />
          )}
        </Step>

        <Step>
          {({ next }) => (
            <UserSearch
              theResults={(users) => setSelectedUsers(users)}
              ref={userSearchRef}
              titleVisible={true}
            />
          )}
        </Step>
      </Stepper>
    </div>
  )
}