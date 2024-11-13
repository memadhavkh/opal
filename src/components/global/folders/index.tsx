'use client'
import FolderDuotone from '@/components/icons/folder-duotone'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import Folder from './folder'
import { useQueryData } from '@/hooks/useQueryData'
import { getWorkspaceFolders } from '@/actions/workspace'
import { useMutationDataState } from '@/hooks/useMutationData'
import { useDispatch } from 'react-redux'
import { FOLDERS } from '@/redux/slices/folder'

type Props = {
    workspaceId: string
}
export type FolderProps = {
    status: number,
    data: ({
        _count: {
            videos: number,
        }
    } & {
        id: string,
        name: string,
        createdAt: Date,
        workspaceId: string | null
    })[]
}

const Folders = ({workspaceId}: Props) => {
    const {data, isFetched} = useQueryData(
        ['workspace-folders'],
        () => getWorkspaceFolders(workspaceId)
    )
    const { latestVariables } = useMutationDataState(
        ['create-folder']
    );
    const { status, data: folders} = data as FolderProps
    const dispatch = useDispatch();
    if(isFetched && folders){
        dispatch(FOLDERS({folders: folders}))
    }
  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <FolderDuotone />
                <h2 className="text-xl text-[#BDBDBD]">Folders</h2>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-[#BDBDBD]">See All</p>
                <ArrowRight color='#707070' />
            </div>
        </div>
        <section className={cn(status !== 200 && 'justify-center', 'flex items-center gap-4 overflow-x-auto w-full')}>
            {
                status !== 200 ? (
                    <p className="text-neutral-300">No Folders In Workspace</p>
                ): (
                    <>
                    {latestVariables && latestVariables.status === 'pending' && (
                        <Folder
                        name={latestVariables.variables.name} id={latestVariables.variables.id} optimistic />
                    )}
                    {folders.map((folder) => (
                        <Folder name={folder.name} count={folder._count.videos} id={folder.id} key={folder.id} />
                    ))}
                    </>
                )
            }
        </section>
    </div>
  )
}

export default Folders