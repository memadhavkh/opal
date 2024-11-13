"use server"

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"

export const verifyAccessToWorkSpace = async (workspaceId: string) => {
    try {
        const user = await currentUser();
        if(!user) return {status: 403}
        const isUserInWorkspace = await client.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        User: {
                            clerkid: user.id
                        },
                    },
                    {
                        members: {
                            every: {
                                User: {
                                    clerkid: user.id
                                }
                            }
                        }
                    }
                ]
            }
        })
        return {
            status: 200,
            data: {workspace: isUserInWorkspace}
        }
    } catch {
        return {
            status: 403,
            data: {workspace: null}
        }
    }
}

export const getWorkspaceFolders = async (workspaceId: string) => {
    try {
        const isFolders = await client.folder.findMany({
            where: {
                workSpaceId: workspaceId
            },
            include: {
                _count: {
                    select: {videos: true}
                }
            }
        })
        if(isFolders && isFolders.length > 0){
            return {status: 200, data: isFolders}
        }
        return {status: 404, data: []}
    } catch  {
        return {status: 403, data: []}
    }
}

export const getAllUserVideos = async (workspaceId: string) => {
    try {
        const user = await currentUser();
        if(!user) return {status: 404}
        const videos = await client.video.findMany({
            where: {
                OR: [{workSpaceId: workspaceId}, {folderId: workspaceId}]
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                Folder: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true
                    }
                },
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        if(videos && videos.length > 0){
            return {status: 200, data: videos}
        }
        return {status: 404, data: []}
    } catch  {
        return {status: 403, data: []}
    }
}

export const getWorkspaces = async () => {
    try {
        const user = await currentUser();
        if(!user) return {status: 404}

        const workspaces = await client.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                },
                members: {
                    select: {
                        WorkSpace: {
                            select: {
                                id: true,
                                name: true,
                                type: true
                            }
                        }
                    }
                }
            }
        })
        if(workspaces) return {status: 200, data: workspaces}
        return {status: 404, data: []}
    } catch {
        return {status: 500, data: []}
    }
}

export const createWorkspace = async (name: string) => {
    try {
        const user = await currentUser();
        if(!user)  return {status: 404}
        const authorized = await client.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                }
            }
        })
        if(authorized?.subscription?.plan === 'PRO'){
            const workspace = await client.user.update({
                where: {
                    clerkid: user.id
                },
                data: {
                    workspace: {
                        create: {
                            name,
                            type: 'PUBLIC'
                        }
                    }
                }
            })
            if(workspace) return {status: 401, data: 'Workspace Created'}
            return {status: 401, data: 'You are not authorized to create a workspace'}
        }
    } catch {
        return {status: 500, data: "Internal server error"}
    }
}

export const renameFolders = async (folderId: string, name: string) => {
    try {
        const folder = await client.folder.update({
            where: {
                id: folderId
            },
            data: {
                name
            }
        })
        if(folder){
            return {status: 200, data: 'Folder Renamed'}
        }
        return {status: 404, data: 'Folder not found'}
    } catch  {
        return {status: 500, data: "Something went wrong"}
    }
}

export const createFolder = async(workspaceId: string) => {
    try {
        const isNewFolder = await client.workSpace.update({
            where: {
                id: workspaceId
            },
            data: {
                folders: {
                    create: {name : 'Untitled'}
                }
            }
        });
        if(isNewFolder){
            return {status: 200, message: "New Folder Created"}
        }
    } catch {
        return {status: 500, message: "Oops! Something Went Wrong"}
    }
}

export const getFolderInfo = async (folderId: string) => {
    try {
        const folder = await client.folder.findUnique({
            where: {
                id: folderId
            },
            select: {
                name: true,
                _count: {
                    select: {
                        videos: true
                    }
                }
            }
        })
        if(folder) {
            return {status: 200, data: folder}
        }
        return {status: 400, data: null};
    } catch {
        return {status: 500, data: null}
    }
}

export const moveVideoLocation = async (
    videoId: string,
    workSpaceId: string,
    folderId: string
  ) => {
    try {
      const location = await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          folderId: folderId || null,
          workSpaceId,
        },
      })
      if (location) return { status: 200, data: 'folder changed successfully' }
      return { status: 404, data: 'workspace/folder not found' }
    } catch {
      return { status: 500, data: 'Oops! something went wrong' }
    }
  }

  export const getPreviewVideo = async (videoId: string) => {
    try {
        const user = await currentUser();
        if(!user) return {status: 404}
        const video = await client.video.findUnique({
            where: {
                id: videoId
            },
            select: {
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                description: true,
                views: true,
                summery: true,
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                        clerkid: true,
                        trial: true,
                        subscription: {
                            select: {
                                plan: true
                            }
                        }
                    }
                }
            }
        })
        if(video) {
            return {status: 200, data: video, author: user.id === video.User?.clerkid ? true : false}
        }
        return {status: 404, data: null}
    } catch {
        return {status: 500, data: null}
    }
  }