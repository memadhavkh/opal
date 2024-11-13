'use client'
import { useQueryData } from "@/hooks/useQueryData"
import { getWorkspaces } from "@/actions/workspace"
import Modal from "../modal";
import { Button } from "@/components/ui/button";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "@/components/forms/workspace-form";

const CreateWorkspace = () => {
    const {data} = useQueryData(['user-worskpaces'], getWorkspaces);
    const {data: plan} = data as  {
        status: number,
        data: {
            subscription: {
                plan: 'PRO' | 'FREE'
            } | null
        }
    }
    if(plan.subscription?.plan === 'FREE'){
        return <></>
    }
    if(plan.subscription?.plan === 'PRO'){
        <Modal title="Create A Workspace" description="Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself." trigger={<Button className="bg-[#1d1d1d] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine />
            Create a Workspace
        </Button>}>
            <WorkspaceForm />
        </Modal>
    }
}

export default CreateWorkspace