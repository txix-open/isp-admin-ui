export interface ApplicationsGroupType {
    createdAt: string,
    description: string,
    domainId: number,
    id: number,
    name: string,
    updatedAt: string
}

export type NewApplicationsGroupType = Omit<ApplicationsGroupType, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateApplicationsGroupType = Omit<ApplicationsGroupType, 'createdAt' | 'updatedAt'>

export interface ApplicationsServiceType {
    app:ApplicationAppType
    tokens: ApplicationTokenType[]
}

export type NewApplicationTokenType = Omit<ApplicationTokenType, 'createdAt' | 'token'>
export interface ApplicationAppType  {
    createdAt: string,
    description: string,
    id: number,
    name: string,
    serviceId: number,
    type: string,
    updatedAt: string
}


export type UpdateApplicationAppType = Omit<ApplicationAppType, 'createdAt' | 'updatedAt'>
export type NewApplicationAppType = Omit<ApplicationAppType, 'id' | 'createdAt' | 'updatedAt'>

export interface ApplicationTokenType {
    appId: number,
    createdAt: string,
    expireTimeMs: number,
    token: string
}

